const fs = require('fs')
const gToys = require('../data/toy.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

// const itemsPerPage = 2
function query(filterAndSort = {}) {
  const { filter: filterBy, sort: sortBy } = filterAndSort
  // return gToys
  if (!Object.keys(filterBy).length) return Promise.resolve(gToys)
  const { name, inStock, labels } = filterBy

  // Filter
  const regex = new RegExp(name, 'i')
  let filteredToys = gToys.filter((toy) => regex.test(toy.name))
  if (inStock) filteredToys = filteredToys.filter(toy => toy.inStock)
  if (labels && labels.length) {
    const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));
    filteredToys = filteredToys.filter(toy => {
      return isSubset(toy.labels, labels)
    })
  }

  // Sorting
  for (let sorter in sortBy) {
    if (sortBy[sorter]) {
      console.log('sorting');
      sorter === 'name'
        ? filteredToys.sort((toy1, toy2) => toy1[sorter].localeCompare(toy2[sorter]))
        : filteredToys.sort((toy1, toy2) => toy2[sorter] - toy1[sorter])
    }
  }
  // Pagination
  // console.log('page:', page)
  // const startIdx = page * itemsPerPage
  // const totalPages = Math.ceil(filteredToys.length / itemsPerPage)
  // filteredToys = filteredToys.slice(startIdx, startIdx + itemsPerPage)
  return Promise.resolve(filteredToys)
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId)
  gToys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = gToys.findIndex((currToy) => currToy._id === toy._id)
    gToys[idx] = toy
  } else {
    toy._id = _makeId()
    gToys.unshift(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gToys, null, 2)

    fs.writeFile('data/toy.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
