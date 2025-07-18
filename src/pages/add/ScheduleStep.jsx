import PageContainer from "../../components/PageContainer.jsx"
export default function ScheduleStep({ lastWatered, nextWater, dispatch, onBack, onSubmit }) {
  return (
    <PageContainer>
    <form onSubmit={e => {e.preventDefault(); onSubmit();}} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">Add Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="lastWatered" className="font-medium">Last Watered</label>
        <input
          id="lastWatered"
          type="date"
          value={lastWatered}
          onChange={e => dispatch({ type: 'SET_LAST', payload: e.target.value })}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="nextWater" className="font-medium">Next Watering</label>
        <input
          id="nextWater"
          type="date"
          value={nextWater}
          onChange={e => dispatch({ type: 'SET_NEXT', payload: e.target.value })}
          className="border rounded p-2"
        />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
      </div>
    </form>
    </PageContainer>
  )
}
