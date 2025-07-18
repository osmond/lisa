import { render, screen, waitFor } from '@testing-library/react'
import useINatPhoto from '../useINatPhoto.js'

function Test() {
  const photo = useINatPhoto('aloe')
  return <div>{photo ? photo.src : 'loading'}</div>
}

test('skips photos that fail to load', async () => {
  const searchData = {
    results: [
      { record: { id: 1 } },
      { record: { id: 2 } },
    ],
  }
  const taxon1 = {
    results: [
      { default_photo: { medium_url: 'bad.jpg', attribution: 'a' } },
    ],
  }
  const taxon2 = {
    results: [
      { default_photo: { medium_url: 'good.jpg', attribution: 'b' } },
    ],
  }
  let call = 0
  const origFetch = global.fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve(call++ === 0 ? searchData : call === 1 ? taxon1 : taxon2),
    })
  )

  const origImage = global.Image
  global.Image = class {
    set src(url) {
      if (url === 'good.jpg') {
        setTimeout(() => this.onload())
      } else {
        setTimeout(() => this.onerror(new Error('fail')))
      }
    }
  }

  render(<Test />)
  await waitFor(() => screen.getByText('good.jpg'))

  global.fetch = origFetch
  global.Image = origImage
})
