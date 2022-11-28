const toyService = require('./toy.service.js')
const logger = require('../../services/logger.service')

// GET LIST
async function getToys(req, res) {
  try {
    logger.debug('Getting Toys')
    const { filterBy: filter, sortBy: sort } = req.query
    const { name, labels, inStock } = filter
    const filterBy = {
      name: name || '',
      labels: labels || [],
      inStock: JSON.parse(inStock) || false,
    }
    console.log('sort', sort);
    const sortBy = {
      name: JSON.parse(sort.name) || false,
      price: JSON.parse(sort.price) || false,
      createdAt: JSON.parse(sort.createdAt) || false
    }
    const toys = await toyService.query({ filterBy, sortBy })
    res.json(toys)
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

// GET BY ID 
async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

// POST (add toy)
async function addToy(req, res) {
  try {
    const toy = req.body
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

// PUT (Update toy)
async function updateToy(req, res) {
  try {
    const toy = req.body
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)

  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

// DELETE (Remove toy)
async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const removedId = await toyService.remove(toyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

async function addToyMsg(req,res) {
  const { id } = req.params
  const { txt } = req.body
  const {loggedinUser} = req
  delete loggedinUser.username
  try{
    const msg = {
      txt,
      by:loggedinUser
    }
    const savedMsg = await toyService.addToyMsg(id,msg)
    res.json(savedMsg)
  } catch(err){
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }

}

function removeToyMsg() {

}

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  addToyMsg,
  removeToyMsg
}
