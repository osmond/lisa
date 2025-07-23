import {
  Link,
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useState, useRef, useMemo, useEffect } from "react";

import {
  Drop,
  Flower,
  Info,
  CaretDown,
  CaretRight,
  SortDescending,
  Trash,
  ArrowLeft,
  PencilSimpleLine,
  ClockCounterClockwise,
  Sun,
  Robot,
  Leaf,
  Ruler,
  Thermometer,
} from "phosphor-react";

import Lightbox from "../components/Lightbox.jsx";
import PageContainer from "../components/PageContainer.jsx";

import { usePlants } from "../PlantContext.jsx";
import actionIcons from "../components/ActionIcons.jsx";
import NoteModal from "../components/NoteModal.jsx";
import { useMenu, defaultMenu } from "../MenuContext.jsx";
import LegendModal from "../components/LegendModal.jsx";
import CarePlanInfoModal from "../components/CarePlanInfoModal.jsx";
import CareCard from "../components/CareCard.jsx";
import PlantDetailFab from "../components/PlantDetailFab.jsx";
import DetailTabs from "../components/DetailTabs.jsx";
import BaseCard from "../components/BaseCard.jsx";
import MetadataStrip from "../components/MetadataStrip.jsx";
import UnifiedTaskCard from "../components/UnifiedTaskCard.jsx";
import InputModal from "../components/InputModal.jsx";
import usePlantFact from "../hooks/usePlantFact.js";

import useToast from "../hooks/useToast.jsx";
import confetti from "canvas-confetti";

import { formatMonth, formatDate, daysUntil } from "../utils/date.js";
import { formatDaysAgo, formatTimeOfDay } from "../utils/dateFormat.js";
import { getWateringProgress } from "../utils/watering.js";

import { buildEvents, groupEventsByMonth } from "../utils/events.js";
import { useWeather } from "../WeatherContext.jsx";

const bulletColors = {
  water: "bg-blue-500",
  fertilize: "bg-yellow-500",
  note: "bg-gray-400",
  log: "bg-green-500",
  advanced: "bg-purple-500",
  noteText: "bg-gray-400",
};

export default function PlantDetail() {
  const { id } = useParams();
  const {
    plants,
    addPhoto,
    removePhoto,
    markWatered,
    markFertilized,
    logEvent,
    updatePlant,
  } = usePlants();
  const plant = plants.find((p) => p.id === Number(id));
  const { forecast } = useWeather() || {};
  const { fact } = usePlantFact(plant?.name);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    searchParams.get("tab") || "tasks",
  );
  useEffect(() => {
    const param = searchParams.get("tab");
    setActiveTab(param || "tasks");
  }, [searchParams]);
  const from = location.state?.from;
  let backLabel = "Back";
  if (from === "/") backLabel = "Back to Today";
  else if (from === "/myplants") backLabel = "Back to All Plants";
  else if (from === "/tasks") backLabel = "Back to Tasks";
  else if (from === "/timeline") backLabel = "Back to Timeline";
  else if (from && from.startsWith("/room/")) {
    const name = decodeURIComponent(from.split("/")[2] || "");
    backLabel = `Back to ${name}`;
  }

  const fileInputRef = useRef();
  const { Toast, showToast } = useToast();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showCarePlanInfo, setShowCarePlanInfo] = useState(false);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [latestFirst, setLatestFirst] = useState(true);
  const [offsetY, setOffsetY] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [showDiameterModal, setShowDiameterModal] = useState(false);
  const [fertilizeDone, setFertilizeDone] = useState(false);

  const waterProgress = getWateringProgress(
    plant?.lastWatered,
    plant?.nextWater,
  );
  const fertProgress = getWateringProgress(
    plant?.lastFertilized,
    plant?.nextFertilize,
  );

  const waterDays = daysUntil(plant?.nextWater);
  const fertDays = daysUntil(plant?.nextFertilize);

  const getStatus = (days) => {
    if (days == null) return "Not scheduled";
    if (days < 0) return "Overdue";
    if (days === 0) return "Due Today";
    if (days === 1) return "Due Tomorrow";
    return `Due in ${days} days`;
  };

  const waterStatus = getStatus(waterDays);
  const fertStatus = getStatus(fertDays);

  const todayIso = new Date().toISOString().slice(0, 10);
  const dueWater = plant?.nextWater && plant.nextWater <= todayIso;
  const dueFertilize = plant?.nextFertilize && plant.nextFertilize <= todayIso;
  const urgent =
    plant?.urgency === "high" ||
    (dueWater && plant.nextWater === todayIso) ||
    (dueFertilize && plant.nextFertilize === todayIso);
  const overdue =
    (dueWater && plant.nextWater < todayIso) ||
    (dueFertilize && plant.nextFertilize < todayIso);
  const lastCared = [plant?.lastWatered, plant?.lastFertilized]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const events = useMemo(() => buildEvents(plant), [plant]);
  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByMonth(events);
    if (latestFirst) {
      return grouped
        .map(([month, list]) => [month, [...list].reverse()])
        .reverse();
    }
    return grouped;
  }, [events, latestFirst]);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * -0.2);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        addPhoto(plant.id, { src: ev.target.result, caption: "" });
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleWatered = () => {
    markWatered(plant.id, "");
    showToast("Watered");
    if (
      typeof HTMLCanvasElement !== "undefined" &&
      HTMLCanvasElement.prototype.getContext
    ) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Canvas API may be missing in some environments (like jsdom)
      }
    }
  };

  const handleFertilized = () => {
    setFertilizeDone(true);
    markFertilized(plant.id, "");
    showToast("Fertilized");
    setTimeout(() => setFertilizeDone(false), 200);
  };

  const handleLogEvent = () => {
    setShowNoteModal(true);
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveDiameter = (value) => {
    const num = Number(value);
    if (num > 0) {
      updatePlant(plant.id, { diameter: num });
    }
    setShowDiameterModal(false);
  };

  const handleEdit = () => {
    navigate(`/plant/${plant.id}/edit`);
  };

  const handleRescheduleWater = () => {
    const next = new Date(plant.nextWater || new Date());
    next.setDate(next.getDate() + 1);
    updatePlant(plant.id, { nextWater: next.toISOString().slice(0, 10) });
    showToast("Rescheduled");
  };

  const handleDeleteWater = () => {
    updatePlant(plant.id, { nextWater: null });
    showToast("Deleted");
  };

  const handleRescheduleFertilize = () => {
    const next = new Date(plant.nextFertilize || new Date());
    next.setDate(next.getDate() + 1);
    updatePlant(plant.id, { nextFertilize: next.toISOString().slice(0, 10) });
    showToast("Rescheduled");
  };

  const handleDeleteFertilize = () => {
    updatePlant(plant.id, { nextFertilize: null });
    showToast("Deleted");
  };

  // Menu is now consistent across pages so no override here

  useEffect(() => {
    const defaults = {};
    if (groupedEvents.length > 0) {
      groupedEvents.slice(0, -1).forEach(([key]) => {
        defaults[key] = true;
      });
    }
    setCollapsedMonths(defaults);
  }, [groupedEvents]);

  const saveNote = (note) => {
    if (note) {
      logEvent(plant.id, "Note", note);
      showToast("Logged");
    }
    setShowNoteModal(false);
  };

  const cancelNote = () => {
    setShowNoteModal(false);
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams);
    if (id === "tasks") params.delete("tab");
    else params.set("tab", id);
    setSearchParams(params, { replace: true });
  };

  const tabs = [
    {
      id: "tasks",
      label: "Tasks",
      content: (
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold" data-testid="tasks-heading">
            Today's Tasks
          </h3>
          <div
            className="flex flex-col items-center"
            aria-label="Care progress"
            aria-describedby="progress-hint"
            title="Progress toward next scheduled care"
          >
            <div className="w-full max-w-xs flex flex-col gap-y-4">
              <CareCard
                label="Water"
                Icon={Drop}
                progress={waterProgress}
                status={waterStatus}
                detail={
                  plant.smartWaterPlan
                    ? `${plant.smartWaterPlan.volume} in³ every ${plant.smartWaterPlan.interval} days — ${plant.smartWaterPlan.reason}`
                    : plant.waterPlan?.volume > 0
                    ? `${plant.waterPlan.volume} in³ every ${plant.waterPlan.interval} days`
                    : undefined
                }
                onDone={handleWatered}
              />
              <div
                className={
                  plant.nextFertilize
                    ? ''
                    : 'opacity-50 bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl'
                }
              >
              <CareCard
                  label="Fertilize"
                  Icon={Sun}
                  progress={fertProgress}
                  status={fertStatus}
                  completed={fertilizeDone}
                  onDone={plant.nextFertilize ? handleFertilized : undefined}
                />
                {!plant.nextFertilize && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="mt-3 inline-block px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-50 rounded-full"
                  >
                    Add Schedule
                  </button>
                )}
              </div>
            </div>
            <span
              id="progress-hint"
              className="sr-only"
              data-testid="progress-hint"
            >
              Progress toward next scheduled care
            </span>
          </div>
          {plant.smartWaterPlan ? (
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-testid="smart-water-plan"
            >
              {plant.smartWaterPlan.volume} in³ every{' '}
              {plant.smartWaterPlan.interval} days —{' '}
              {plant.smartWaterPlan.reason}
            </p>
          ) : plant.waterPlan?.volume > 0 ? (
            <p
              className="text-xs text-gray-500 dark:text-gray-400"
              data-testid="water-plan"
            >
              {plant.waterPlan.volume} in³ every {plant.waterPlan.interval} days
            </p>
          ) : null}
        </div>
      ),
    },
    {
      id: "care-plan",
      label: "Care Plan",
      content: (
        <div className="p-4 space-y-2" data-testid="care-plan-tab">
          <div className="flex items-center justify-between">
              {(plant.waterPlan?.interval || plant.smartWaterPlan) && (
                <h3 className="text-lg font-semibold">
                  {plant.smartWaterPlan ? "Recommended Plan" : "Custom Care Plan"}
                </h3>
              )}
            <button
              type="button"
              aria-label="How care plan is generated"
              onClick={() => setShowCarePlanInfo(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ⓘ
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded space-y-2">
            {plant.carePlan ? (
              <ul className="space-y-1 text-sm" data-testid="care-plan-list">
                <li className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  Pot diameter: {plant.diameter ? `${plant.diameter} in` : "N/A"}
                </li>
                <li className="flex items-center gap-2">
                  <Drop className="w-4 h-4 text-blue-500" />
                  Water every {plant.carePlan.water} days
                </li>
                <li className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-yellow-500" />
                  Amount: {plant.waterPlan.volume} in³
                </li>
                <li className="flex items-center gap-2">
                  <Flower className="w-4 h-4 text-pink-500" />
                  Fertilize every {plant.carePlan.fertilize} days
                </li>
                <li className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-orange-500" />
                  Light: {plant.carePlan.light}
                </li>
              </ul>
            ) : (
              <>
                <p className="text-sm flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  Pot diameter: {plant.diameter ? `${plant.diameter} in` : "N/A"}
                </p>
                {plant.waterPlan?.interval ? (
                  <>
                    <p className="text-sm flex items-center gap-2">
                      <Drop className="w-4 h-4 text-blue-500" />
                      Water every: {plant.waterPlan.interval} days
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-yellow-500" />
                      Amount: {plant.waterPlan.volume} in³
                    </p>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <img src="/happy-plant.svg" alt="Set up care" className="w-16 mx-auto" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Care plan pending setup
                    </p>
                    <Link
                      to={`/plant/${plant.id}/edit-care-plan`}
                      className="inline-block px-3 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-full"
                    >
                      Set Up Care Plan
                    </Link>
                  </div>
                )}
              </>
            )}
            {plant.smartWaterPlan && (
              <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="smart-water-plan-details">
                {plant.smartWaterPlan.volume} in³ every {plant.smartWaterPlan.interval} days — {plant.smartWaterPlan.reason}
              </p>
            )}
            {!plant.carePlan && plant.notes && (
              <pre className="whitespace-pre-wrap">{plant.notes}</pre>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "activity",
      label: "Activity",
      content: (
        <div className="space-y-4 p-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setLatestFirst((l) => !l)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <SortDescending
                className={`w-4 h-4 transform transition-transform ${latestFirst ? "" : "rotate-180"}`}
                aria-hidden="true"
              />
              <span className="sr-only">
                {latestFirst ? "Show oldest first" : "Show newest first"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowLegend(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Info className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Legend</span>
            </button>
          </div>
          {events.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity for {plant.name}. Start logging care to build a
              timeline.
            </p>
          )}
          {groupedEvents.map(([monthKey, list]) => {
            const isCollapsed = collapsedMonths[monthKey];
            return (
              <div key={monthKey} className="mt-6 first:mt-0">
                <h3 className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-1 text-timestamp uppercase tracking-wider text-gray-300 mb-2 flex items-center">
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                      setCollapsedMonths((c) => ({
                        ...c,
                        [monthKey]: !isCollapsed,
                      }))
                    }
                    className="mr-1"
                  >
                    {isCollapsed ? (
                      <CaretRight className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <CaretDown className="w-3 h-3" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {isCollapsed ? "Expand month" : "Collapse month"}
                    </span>
                  </button>
                  {formatMonth(monthKey)}
                </h3>
                <ul
                  className={`${isCollapsed ? "hidden" : ""} relative ml-3 space-y-8 pl-5 before:absolute before:inset-y-0 before:left-2 before:border-l before:border-dashed before:border-gray-300 dark:before:border-gray-600`}
                >
                  {list.map((e, i) => {
                    const Icon = actionIcons[e.type];
                    const noteKey = `${e.date}-${i}`;
                    const expanded = expandedNotes[noteKey];
                    return (
                      <li
                        key={`${e.date}-${i}`}
                        className="relative text-xs sm:text-sm"
                      >
                        {Icon && (
                          <div
                            className={`absolute -left-5 top-[0.25rem] w-4 h-4 flex items-center justify-center rounded-full ${bulletColors[e.type]} z-10`}
                          >
                            <Icon
                              className="w-3 h-3 text-white"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                        <div
                          className={`flex items-start ${e.note ? "bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm" : ""}`}
                        >
                          <div>
                            <span className="font-medium">
                              {formatDate(e.date)}
                            </span>{" "}
                            — {e.label}
                            {e.note && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedNotes((n) => ({
                                    ...n,
                                    [noteKey]: !expanded,
                                  }))
                                }
                                className="block text-left text-xs font-normal text-green-800 mt-1"
                              >
                                {expanded
                                  ? e.note
                                  : `${e.note.slice(0, 60)}${e.note.length > 60 ? "\u2026" : ""}`}
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "gallery",
      label: "Gallery",
      content: (
        <div className="space-y-4 p-4">
          {(plant.photos || []).length > 0 && (
            <h3 className="text-heading font-semibold mb-2">Recent Photos</h3>
          )}
          {(plant.photos || []).length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Add your first photo
            </p>
          )}
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-1 sm:pb-2">
            {(plant.photos || []).slice(0, 3).map((photo, i) => {
              const { src, caption } = photo;
              const extra = (plant.photos || []).length - 3;
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center group transition-all ease-in-out duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="block focus:outline-none"
                  >
                    <img
                      src={src}
                      alt={caption || `${plant.name} photo ${i + 1}`}
                      className="w-24 aspect-[4/3] object-cover rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105"
                    />
                    {i === 2 && extra > 0 && (
                      <span className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                        +{extra}
                      </span>
                    )}
                  </button>
                  <button
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 bg-white/70 rounded p-1 text-gray-600 hover:text-rose-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all ease-in-out duration-200"
                    onClick={() => removePhoto(plant.id, i)}
                  >
                    <Trash className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
          {(plant.photos || []).length > 3 && (
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-500">
                Showing 3 of {(plant.photos || []).length} photos
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="text-green-600 hover:underline"
              >
                View All Photos
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFiles}
            className="hidden"
          />
          {lightboxIndex !== null && (
            <Lightbox
              images={plant.photos}
              startIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              label={`${plant.name} gallery`}
            />
          )}
        </div>
      ),
    },
  ];

  if (!plant) {
    return (
      <div className="text-gray-700 dark:text-gray-200">Plant not found</div>
    );
  }

  return (
    <>
      <div className="full-bleed relative mb-1 -mt-8 lg:sticky top-0 z-10">
        <div className="hidden lg:block absolute inset-0 overflow-hidden -z-10">
          <img
            src={plant.image}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110"
            aria-hidden="true"
          />
        </div>
        <div
          className="rounded-xl shadow-md overflow-hidden relative"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          <img
            src={plant.image}
            alt={plant.name}
            loading="lazy"
            className="w-full h-[50vh] md:h-[60vh] object-cover"
          />
          <div className="img-gradient-overlay" aria-hidden="true"></div>
          <div className="fixed top-2 left-2 z-20 flex items-center gap-1 text-white">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-1 rounded-full bg-black/40 hover:bg-black/50 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="ml-1">{backLabel}</span>
            </button>
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex flex-col sm:flex-row justify-between text-white drop-shadow space-y-1 sm:space-y-0">
            <div className="hero-name-bg">
              <h2 className="text-4xl font-extrabold font-headline tracking-wide animate-fade-in-down">
                {plant.name}
              </h2>
              {plant.scientificName && (
                <p className="text-sm italic text-gray-100 animate-fade-in-down" style={{ animationDelay: '50ms' }}>
                  {plant.scientificName}
                </p>
              )}
              {plant.nickname && (
                <p
                  className="text-sm italic text-gray-100 animate-fade-in-down"
                  style={{ animationDelay: "100ms" }}
                >
                  {plant.nickname}
                </p>
              )}
              {fact && (
                <p
                  className="text-sm italic text-gray-100 animate-fade-in-down"
                  style={{ animationDelay: "200ms" }}
                >
                  {fact}
                </p>
              )}
              <MetadataStrip plant={plant} />
              <Link
                to={`/plant/${plant.id}/coach`}
                className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-green-600 rounded-full text-sm text-white shadow"
              >
                <Robot className="w-4 h-4" />
                Coach
              </Link>
            </div>
          </div>
        </div>
      </div>
      <PageContainer size="xl" className="relative text-left pt-0 space-y-3">
        <Toast />

        <div className="space-y-3">
          <div className="full-bleed sticky top-0 z-10 backdrop-blur-sm">
            <DetailTabs
              tabs={tabs}
              value={activeTab}
              onChange={handleTabChange}
            />
          </div>
        </div>
        <PlantDetailFab
          onAddPhoto={openFileInput}
          onAddNote={handleLogEvent}
          onWater={handleWatered}
          onFertilize={handleFertilized}
          plantName={plant.name}
        />
        {showNoteModal && (
          <NoteModal label="Note" onSave={saveNote} onCancel={cancelNote} />
        )}
        {showLegend && <LegendModal onClose={() => setShowLegend(false)} />}
        {showCarePlanInfo && (
          <CarePlanInfoModal onClose={() => setShowCarePlanInfo(false)} />
        )}
        {showDiameterModal && (
          <InputModal
            label="Pot diameter (inches)"
            initialValue={plant.diameter || ""}
            onSave={handleSaveDiameter}
            onCancel={() => setShowDiameterModal(false)}
          />
        )}
      </PageContainer>
    </>
  );
}
