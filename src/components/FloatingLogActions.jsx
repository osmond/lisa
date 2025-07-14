export default function FloatingLogActions({ onWatered, onAddNote, onAddCareLog }) {
  return (
    <div className="fixed bottom-16 inset-x-0 flex justify-center z-20">
      <div
        role="group"
        aria-label="log actions"
        className="flex text-sm rounded-full overflow-hidden bg-accent text-white divide-x divide-white"
      >
        <button
          type="button"
          onClick={onWatered}
          className="flex-1 px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Watered
        </button>
        <button
          type="button"
          onClick={onAddNote}
          className="flex-1 px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Add Note
        </button>
        <button
          type="button"
          onClick={onAddCareLog}
          className="flex-1 px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          + Add care log
        </button>
      </div>
    </div>
  );
}
