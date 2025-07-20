import express from 'express'
import plantFactHandler from './api/plantFact.js'

const app = express()

app.get('/api/plant-fact', (req, res) => {
  plantFactHandler(req, res)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
