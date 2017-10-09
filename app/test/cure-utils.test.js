const should = require('chai').should()
const cureUtils = require('../utils/cure-utils.js')
const players = require('./playersCureTest.json')
const allCities = require('./allCitiesCureTest.json')

console.log("PLAYERS TEST", players, allCities)

describe('#canCureDisease', function () {
  it('returns false if not in research city', function () {
    const notAtResearch = players[0]
    cureUtils.canCureDisease(notAtResearch, allCities).should.equal(false)
  })
  it('returns false if player does not have 5 cards of same color', function () {
    const noCureCards = players[0]
    cureUtils.canCureDisease(notAtResearch, allCities).should.equal(false)
  })
  // canCureDisease
  // returns { curableColors: curableColors, sameColors: sameColors }
  // sameColors has key=color, value = array of cards of same color
  // curableColors is array of curable colors
  it('returns ', function () {
    const noCureCards = players[0]
    cureUtils.canCureDisease(notAtResearch, allCities).should.equal(false)
  })

})
