const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const toyService = require('./services/toy.service')

const app = express()

const port = process.env.PORT || 3030;

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
const corsOptions = {
  origin: ['http://127.0.0.1:3001', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true
}
app.use(cors(corsOptions))

// Express Routing:

// LIST
app.get('/api/toy', (req, res) => {
  const { byVendor, page } = req.query

  // const filterBy = {
  //   byVendor: byVendor || '',
  //   page: +page || 0,
  // }
   toyService.query().then((toys) => {
    res.send(toys)
  })
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.getById(toyId).then((toy) => {
    res.send(toy)
  })
})

// ADD
app.post('/api/toy', (req, res) => {
  const { name, price, createdAt, inStock, labels, reviews } = req.body

  const toy = {
    name,
    price,
    createdAt,
    inStock,
    labels,
    reviews
  }

  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})
// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const { name, price, _id, reviews, createdAt, labels } = req.body

  const toy = {
    _id,
    name,
    price,
    reviews,
    createdAt,
    labels
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})

// DELETE
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.remove(toyId).then(() => {
    res.send('Removed!')
  })
})

app.listen(port, () =>
  console.log(`Server listening on port ${port}!`)
)
