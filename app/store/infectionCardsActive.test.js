/* global describe beforeEach it */

import { expect } from 'chai'

import infectionDeck from '../data/infection-deck'
import { shuffle } from '../utils/deck-utils'

describe.only('shuffle function', () => {
  const original = infectionDeck.slice()
  let shuffled
  let count

  beforeEach(() => {
    shuffled = shuffle(infectionDeck)
    count = 0
  })

  it('should generate an array with the same length as the original', () => {
    expect(shuffled.length).to.be.equal(original.length)
  })

  it('should have a non-zero number of elements that are different from the original', () => {
    for (let i = 0; i < original.length; i++) {
      if (original[i] !== shuffled[i]) count++
    }
    expect(count).to.be.greaterThan(0)
  })
})
