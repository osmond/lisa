import { useEffect, useRef } from 'react'
import PageContainer from "../../components/PageContainer.jsx"

export default function NameStep({ name, dispatch, onNext }) {
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <PageContainer>
    <form onSubmit={e => {e.preventDefault(); onNext();}} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">Add Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="name" className="font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => dispatch({type: 'SET_NAME', payload: e.target.value})}
          ref={inputRef}
          className="border rounded p-2"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
    </form>
    </PageContainer>
  )
}
