const should = require('chai').should()
const utils = require('../index')
const deckUtils = utils.deckUtils
const citiesNames = require('../data/citiesNames')

describe('#shuffle', function () {
  it('shuffles an array of cards', function () {
    let deck = citiesNames.slice(0, 10)
    // shuffle modifies original array, keep original
    let deckOriginal = citiesNames.slice(0, 10)
    deckUtils.shuffle(deck)
    deckOriginal.join().should.not.equal(deck.join())
  });
})