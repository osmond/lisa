import React from 'react'

export default function OptionalInfoStep({ location, notes, careLevel, dispatch, onBack, onSubmit }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold font-headline">Add Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="location" className="font-medium">Location</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={e => dispatch({ type: 'SET_LOCATION', payload: e.target.value })}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="notes" className="font-medium">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
          className="border rounded p-2"
          rows="3"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="careLevel" className="font-medium">Care Level</label>
        <select
          id="careLevel"
          value={careLevel}
          onChange={e => dispatch({ type: 'SET_CARE', payload: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">Select...</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add Plant</button>
      </div>
    </form>
  )
}
