const should = require('chai').should()
const cureUtils = require('../utils/cure-utils.js')
const players = require('./playersCureTest.json').players
const playerKeys = Object.keys(players)
const allCities = require('./allCitiesCureTest.json').cities

describe('#canCureDisease', function () {
  it('returns false if not in research city', function () {
    const notAtResearch = players[playerKeys[0]]
    cureUtils.canCureDisease(notAtResearch, allCities).should.equal(false)
  })
  it('returns false if player does not have 5 cards of same color', function () {
    const noCureCards = players[playerKeys[1]]
    cureUtils.canCureDisease(noCureCards, allCities).should.equal(false)
  })
  // canCureDisease
  // returns { curableColors: curableColors, sameColors: sameColors }
  // sameColors has key=color, value = array of cards of same color
  // curableColors is array of curable colors'
  // NOTE!!: SHOULD BE WORKING BUT DOESN'T COMPARE THE RETURN OBJECTS CORRECTLY
  it('returns ', function () {
    const canCure = players[playerKeys[2]]
    const expectedObj = {
      curableColors: ['blue'],
      sameColors: {
        blue: [
          {
            'city': 'Atlanta',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Chicago',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Essen',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Madrid',
            'props': {
              'color': 'blue'
            }
          },
          {
            'city': 'Milan',
            'props': {
              'color': 'blue'
            }
          }
        ]
      }
    }
    console.log("CANCURE", cureUtils.canCureDisease(canCure, allCities))
    cureUtils.canCureDisease(canCure, allCities).should.equal(expectedObj)
  })
})
