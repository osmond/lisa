import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PlantProvider, usePlants } from "../PlantContext.jsx";
import autoTag from "../utils/autoTag.js";

jest.mock("../utils/autoTag.js");

function TestComponent() {
  const { plants, markWatered } = usePlants();
  const plant = plants[0];
  return (
    <div>
      <button onClick={() => markWatered(plant.id, "test note")}>log</button>
      <ul>
        {(plant.careLog || []).map((e, i) => (
          <li key={i}>{e.note}</li>
        ))}
      </ul>
      {plant.smartWaterPlan && (
        <span data-testid="plan">{plant.smartWaterPlan.interval}</span>
      )}
    </div>
  );
}

function FertTestComponent() {
  const { plants, markFertilized } = usePlants();
  const plant = plants[0];
  return (
    <div>
      <button onClick={() => markFertilized(plant.id, "fert note")}>log</button>
      <ul>
        {(plant.careLog || []).map((e, i) => (
          <li key={i}>{e.note}</li>
        ))}
      </ul>
    </div>
  );
}

test("markWatered stores notes in careLog", async () => {
  render(
    <PlantProvider>
      <TestComponent />
    </PlantProvider>,
  );

  fireEvent.click(screen.getByText("log"));
  await screen.findByText("test note");
});

test("markWatered updates smart plan", async () => {
  render(
    <PlantProvider>
      <TestComponent />
    </PlantProvider>,
  );

  fireEvent.click(screen.getByText("log"));
  await screen.findByTestId("plan");
});

test("markFertilized stores notes in careLog", async () => {
  render(
    <PlantProvider>
      <FertTestComponent />
    </PlantProvider>,
  );

  fireEvent.click(screen.getByText("log"));
  await screen.findByText("fert note");
});

function NoteTest() {
  const { addTimelineNote, timelineNotes } = usePlants();
  return (
    <div>
      <button onClick={() => addTimelineNote("hi")}>add</button>
      {timelineNotes.map((n, i) => (
        <span key={i}>{n.tags.join(",")}</span>
      ))}
    </div>
  );
}

function LogTest() {
  const { plants, logEvent } = usePlants();
  const plant = plants[0];
  return (
    <div>
      <button onClick={() => logEvent(plant.id, "Note", "hello")}>add</button>
      {(plant.careLog || []).map((e, i) => (
        <span key={i}>{e.tags.join(",")}</span>
      ))}
    </div>
  );
}

test("addTimelineNote stores tags", async () => {
  autoTag.mockResolvedValue(["tag"]);
  render(
    <PlantProvider>
      <NoteTest />
    </PlantProvider>,
  );
  fireEvent.click(screen.getByText("add"));
  await screen.findByText("tag");
});

test("logEvent stores tags", async () => {
  autoTag.mockResolvedValue(["t"]);
  render(
    <PlantProvider>
      <LogTest />
    </PlantProvider>,
  );
  fireEvent.click(screen.getByText("add"));
  await screen.findByText("t");
});

function DiameterTest() {
  const { plants, updatePlant } = usePlants();
  const plant = plants[0];
  return (
    <div>
      <span>{plant.waterPlan ? plant.waterPlan.volume : "none"}</span>
      <button onClick={() => updatePlant(plant.id, { diameter: 5 })}>
        set
      </button>
    </div>
  );
}

test("updating diameter recalculates water plan", async () => {
  render(
    <PlantProvider>
      <DiameterTest />
    </PlantProvider>,
  );
  expect(screen.getByText("0")).toBeInTheDocument();
  fireEvent.click(screen.getByText("set"));
  await screen.findByText("74");
});
