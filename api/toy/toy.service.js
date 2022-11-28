const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterAndSort) {
    try {
        const { filterBy, sortBy } = filterAndSort
        const criteria = _createCriteria(filterBy)
        const sortCriteria = _createSort(sortBy)
        console.log("🚀 ~ file: toy.service.js ~ line 9 ~ query ~ criteria", criteria)
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort(sortCriteria)
        return toys.toArray()
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        let addedToy = await collection.insertOne(toy)
        addedToy = addedToy.ops[0]

        return addedToy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}
async function update(toy) {
    try {
        var id = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: id }, { $set: { ...toy } })
        toy._id = id
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function addToyMsg(toyId,msg){
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
          { _id: ObjectId(toyId) },
          { $push: { msgs: msg } }
        )
        return msg
      } catch (err) {
        logger.error(`cannot add car msg ${toyId}`, err)
        throw err
      }
}

function _createCriteria(filterBy) {
    const criteria = {}
    if (!Object.keys(filterBy).length) return criteria
    const { name, inStock, labels } = filterBy
    criteria.name = { $regex: name, $options: 'i' }
    if (inStock) criteria.inStock = true
    if (labels.length) criteria.labels = { $all: labels }
    return criteria
}

function _createSort(sortBy) {
    const criteria = {}
    for (sorter in sortBy) {
        if (sortBy[sorter]) criteria[sorter] = -1
    }
    return criteria
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg
}