import { createContext, useContext, useEffect, useState } from "react";
import initialPlants from "./plants.json";
import { useWeather } from "./WeatherContext.jsx";
import { getNextWateringDate } from "./utils/watering.js";
import { getWaterPlan, getSmartWaterPlan } from "./utils/waterCalculator.js";
import { cubicInchesToMl, mlToOz } from "./utils/volume.js";
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
    const mapPlant = (p) => {
      const wp = p.waterPlan || { interval: 0 };
      const ml =
        wp.volume_ml !== undefined
          ? wp.volume_ml
          : cubicInchesToMl(wp.volume || 0);
      const oz =
        wp.volume_oz !== undefined ? wp.volume_oz : mlToOz(ml);
      const smart = p.smartWaterPlan
        ? {
            ...p.smartWaterPlan,
            volume_ml:
              p.smartWaterPlan.volume_ml !== undefined
                ? p.smartWaterPlan.volume_ml
                : cubicInchesToMl(p.smartWaterPlan.volume || 0),
            volume_oz:
              p.smartWaterPlan.volume_oz !== undefined
                ? p.smartWaterPlan.volume_oz
                : mlToOz(
                    p.smartWaterPlan.volume_ml !== undefined
                      ? p.smartWaterPlan.volume_ml
                      : cubicInchesToMl(p.smartWaterPlan.volume || 0),
                  ),
          }
        : null;
      return {
        ...p,
        image: addBase(p.image),
        photos: (p.photos || p.gallery || []).map(mapPhoto),
        careLog: (p.careLog || []).map((ev) => ({ ...ev, tags: ev.tags || [] })),
        diameter: p.diameter || 0,
        petSafe: !!p.petSafe,
        waterPlan: { interval: wp.interval || 0, volume_ml: Math.round(ml), volume_oz: Math.round(oz) },
        carePlan: p.carePlan || null,
        smartWaterPlan: smart,
        lastEvaluated: p.lastEvaluated || null,
      };
    };

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

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (typeof fetch === 'undefined') return;
      try {
        const res = await fetch("/api/plants");
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore) setPlants(data.map(mapPlant));
      } catch {
        // ignore network errors and keep local data
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

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
        const raw = getSmartWaterPlan(
          { name: p.name, diameter: p.diameter, light: p.light },
          forecast,
          logs,
        );
        const ml = cubicInchesToMl(raw.volume);
        const plan = {
          interval: raw.interval,
          reason: raw.reason,
          volume_ml: Math.round(ml),
          volume_oz: Math.round(mlToOz(ml)),
        };
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
          const raw = getSmartWaterPlan(
            { name: p.name, diameter: p.diameter, light: p.light },
            weatherCtx?.forecast,
            newLog.filter((l) => l.type === "Watered"),
          );
          const volMl = cubicInchesToMl(raw.volume);
          const plan = {
            interval: raw.interval,
            reason: raw.reason,
            volume_ml: Math.round(volMl),
            volume_oz: Math.round(mlToOz(volMl)),
          };
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
        waterPlan: { interval: 0, volume_ml: 0, volume_oz: 0 },
        carePlan: null,
        ...plant,
      };
      if (typeof fetch !== 'undefined')
        fetch('/api/plants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPlant),
        }).catch(() => {})
      return [...prev, newPlant];
    });
  };

  const updatePlant = (id, updates) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...updates };
        if (Object.prototype.hasOwnProperty.call(updates, "diameter")) {
          const base = getWaterPlan(next.name, updates.diameter, next.light);
          const ml = cubicInchesToMl(base.volume);
          next.waterPlan = {
            interval: base.interval,
            volume_ml: Math.round(ml),
            volume_oz: Math.round(mlToOz(ml)),
          };
        }
        return next;
      }),
    );
    if (typeof fetch !== 'undefined')
      fetch(`/api/plants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {})
  };

  const removePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
    if (typeof fetch !== 'undefined')
      fetch(`/api/plants/${id}`, { method: 'DELETE' }).catch(() => {})
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
    const form = new FormData();
    if (photo.file) form.append('photos', photo.file);
    if (typeof fetch !== 'undefined' && form.has('photos'))
      fetch(`/api/plants/${id}/photos`, { method: 'POST', body: form }).catch(
        () => {},
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
    if (typeof fetch !== 'undefined')
      fetch(`/api/plants/${id}/photos/${index}`, { method: 'DELETE' }).catch(() => {});
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
