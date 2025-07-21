import { createContext, useContext, useEffect, useState } from "react";
import initialPlants from "./plants.json";
import { useWeather } from "./WeatherContext.jsx";
import { getNextWateringDate } from "./utils/watering.js";
import { getWaterPlan, getSmartWaterPlan } from "./utils/waterCalculator.js";
import autoTag from "./utils/autoTag.js";

const PlantContext = createContext();

export const addBase = (url) => {
  if (!url) return url;
  if (/^https?:/.test(url) || url.startsWith("data:")) return url;
  const base = (process.env.VITE_BASE_PATH || "/").replace(/\/$/, "");
  if (url.startsWith(base)) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

const mapPhoto = (photo) => {
  if (!photo) return photo;
  if (typeof photo === "string") {
    return { src: addBase(photo), caption: "", tags: [] };
  }
  return { ...photo, src: addBase(photo.src), tags: photo.tags || [] };
};

export function PlantProvider({ children }) {
  const [plants, setPlants] = useState(() => {
    const mapPlant = (p) => ({
      ...p,
      image: addBase(p.image),
      photos: (p.photos || p.gallery || []).map(mapPhoto),
      careLog: (p.careLog || []).map((ev) => ({ ...ev, tags: ev.tags || [] })),
      diameter: p.diameter || 0,

      waterPlan: p.waterPlan || { volume: 0, interval: 0 },

      carePlan: p.carePlan || null,

      smartWaterPlan: p.smartWaterPlan || null,

      lastEvaluated: p.lastEvaluated || null,
    });

    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("plants");
      if (stored) {
        try {
          return JSON.parse(stored).map(mapPlant);
        } catch {
          // fall through to initial plants
        }
      }
    }
    return initialPlants.map(mapPlant);
  });

  const weatherCtx = useWeather();
  const weather = { rainTomorrow: weatherCtx?.forecast?.rainfall || 0 };

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("plants", JSON.stringify(plants));
    }
  }, [plants]);

  const evaluatePlans = (forecast) => {
    if (!forecast) return;
    setPlants((prev) =>
      prev.map((p) => {
        if (!p.name || !p.diameter) return p;
        const logs = (p.careLog || []).filter((l) => l.type === "Watered");
        const plan = getSmartWaterPlan(
          { name: p.name, diameter: p.diameter, light: p.light },
          forecast,
          logs,
        );
        return {
          ...p,
          smartWaterPlan: plan,
          lastEvaluated: new Date().toISOString(),
        };
      }),
    );
  };

  useEffect(() => {
    const handler = (e) => evaluatePlans(e.detail);
    window.addEventListener("weather-updated", handler);
    return () => window.removeEventListener("weather-updated", handler);
  }, []);

  const [timelineNotes, setTimelineNotes] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("timelineNotes");
      if (stored) {
        try {
          return JSON.parse(stored).map((n) => ({ ...n, tags: n.tags || [] }));
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("timelineNotes", JSON.stringify(timelineNotes));
    }
  }, [timelineNotes]);

  const addTimelineNote = async (text) => {
    const date = new Date().toISOString().slice(0, 10);
    const tags = await autoTag(text);
    setTimelineNotes((prev) => [...prev, { date, text, tags }]);
  };

  const logEvent = async (id, type, note = "") => {
    const date = new Date().toISOString().slice(0, 10);
    const tags = await autoTag(note);
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              careLog: [...(p.careLog || []), { date, type, note, tags }],
            }
          : p,
      ),
    );
  };

  const markWatered = async (id, note) => {
    const tags = await autoTag(note);
    const today = new Date().toISOString().slice(0, 10);
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const { date: nextStr, reason } = getNextWateringDate(today, weather);
          const newLog = [
            ...(p.careLog || []),
            { date: today, type: "Watered", note, tags },
          ];
          const plan = getSmartWaterPlan(
            { name: p.name, diameter: p.diameter, light: p.light },
            weatherCtx?.forecast,
            newLog.filter((l) => l.type === "Watered"),
          );
          return {
            ...p,
            careLog: newLog,
            lastWatered: today,
            nextWater: nextStr,
            nextWaterReason: reason,
            smartWaterPlan: plan,
            lastEvaluated: new Date().toISOString(),
          };
        }
        return p;
      }),
    );
  };

  const markFertilized = (id, note) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const today = new Date().toISOString().slice(0, 10);
          let nextDate = new Date(today);
          if (p.lastFertilized && p.nextFertilize) {
            const last = new Date(p.lastFertilized);
            const next = new Date(p.nextFertilize);
            const diff = Math.round((next - last) / 86400000) || 30;
            nextDate.setDate(nextDate.getDate() + diff);
          } else {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          return {
            ...p,
            lastFertilized: today,
            nextFertilize: nextDate.toISOString().slice(0, 10),
          };
        }
        return p;
      }),
    );
    logEvent(id, "Fertilized", note);
  };

  const addPlant = (plant) => {
    setPlants((prev) => {
      const nextId = prev.reduce((m, p) => Math.max(m, p.id), 0) + 1;

      const newPlant = {
        id: nextId,
        photos: [],
        careLog: [],
        diameter: 0,
        waterPlan: { volume: 0, interval: 0 },
        carePlan: null,
        ...plant,
      };
      return [...prev, newPlant];
    });
  };

  const updatePlant = (id, updates) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...updates };
        if (Object.prototype.hasOwnProperty.call(updates, "diameter")) {
          next.waterPlan = getWaterPlan(next.name, updates.diameter, next.light);
        }
        return next;
      }),
    );
  };

  const removePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  const restorePlant = (plant, index) => {
    setPlants((prev) => {
      const arr = [...prev];
      const pos = index != null ? index : arr.length;
      arr.splice(pos, 0, plant);
      return arr;
    });
  };

  const addPhoto = async (id, photo) => {
    const newPhoto = mapPhoto(photo);
    const tags = await autoTag(newPhoto.caption || "");
    newPhoto.tags = tags;
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, photos: [...(p.photos || []), newPhoto] } : p,
      ),
    );
  };

  const removePhoto = (id, index) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = (p.photos || []).filter((_, i) => i !== index);
          return { ...p, photos: updated };
        }
        return p;
      }),
    );
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        markWatered,
        markFertilized,
        logEvent,
        addPlant,
        updatePlant,
        removePlant,
        restorePlant,
        addPhoto,
        removePhoto,
        timelineNotes,
        addTimelineNote,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export const usePlants = () => useContext(PlantContext);
