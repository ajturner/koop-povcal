'use strict'
const request = require('request').defaults({gzip: true})
// const tsv = require('tsv')
const Baby = require('babyparse')

module.exports = function (koop) {
  // Public: fetch data from povcal and return as a feature collection
  this.get = function (options, callback) {
    // koop.cache.get('povcal', options.cacheKey, query, (err, entry) => {
      // if (entry && entry[0]) {
      //   callback(null, entry[0])
      // } else {
        fetch(options, (err, geojson) => {
          callback(err, geojson)
          // koop.cache.insert('povcal', options.cacheKey, geojson, 0, e => {
          //   if (e) console.trace(e)
          // })
        })
      // }
    // })
  }

  this.drop = function (options, callback) {
    console.log(options, options.cacheKey)
    koop.cache.remove('povcal', options.cacheKey, {layer: 0}, callback)
  }

  return this
}

function fetch (options, callback) {
  var years = [];
  for (var i = 1970; i <= 2018; i++) {
      years.push(i);
  }
  let url = `http://iresearch.worldbank.org/PovcalNet/PovcalNetAPI.ashx?C0=${options.country}_3&PL0=${options.povline}&Y0=${years.join(',')}&GroupedBy=false`;

  request(url, (err, res, body) => {
    if (err) return callback(err)
    const lines = translate(res.body)
    callback(null, lines)
  })
}

// Map accross all elements from a povcal respsonse and translate it into a feature collection
function translate (data) {
  // let list = tsv.parse(data);
  let parsed = Baby.parse(data, {'delimiter': '\t', 'header': true, 'skipEmptyLines': true})
  let list = parsed.data

  console.log("Povcal list", list)

  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  }
  if (list && list[0]) {
    featureCollection.features = list.map(formatFeature)
  }
  return featureCollection
}

// This function takes a single element from the povcal response and translates it to GeoJSON
function formatFeature (line) {
  // console.log("Format", line)
  let population = parseInt(parseFloat(line["'ReqYearPopulation'"]) * 1000000)
  let impoverished = parseInt(population * parseFloat(line["'HeadCount'"]))
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0,0] // null island for now
    },
    properties: {
      country: line["'CountryName'"],
      year: parseInt(line["'RequestYear'"]),
      population: population,
      impoverished: impoverished
    }
  }
}

function dateFormat (date) {
  return new Date(parseInt(date, 10) * 1000).toISOString()
}
