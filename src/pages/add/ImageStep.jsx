import { addBase } from '../../PlantContext.jsx'
import PageContainer from "../../components/PageContainer.jsx"

export default function ImageStep({ image, placeholder, dispatch, onNext, onBack }) {
  const handleFileChange = e => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => dispatch({ type: 'SET_IMAGE', payload: ev.target.result })
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <PageContainer maxWidth="md">
    <form onSubmit={e => {e.preventDefault(); onNext();}} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">Add Plant</h1>
      <div className="grid gap-1">
        <label htmlFor="image" className="font-medium">Image URL</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={e => dispatch({ type: 'SET_IMAGE', payload: e.target.value })}
          className="border rounded p-2"
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor="imageFile" className="font-medium">Upload Photo</label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2"
        />
      </div>
      {(image || placeholder) && (
        <img
          src={addBase(image || placeholder)}
          alt="Preview"
          className="object-cover w-24 h-24 rounded"
        />
      )}
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
      </div>
    </form>
    </PageContainer>
  )
}
