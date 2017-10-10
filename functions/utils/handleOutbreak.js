module.exports = function(outbreakSite, cities) {
  // outbreak site must get an infectionRate of 3
  // if the infection rate was 0 before, that's all you need to do
  const updatedData = {}
  updatedData['cities/' + outbreakSite + '/infectionRate'] = 3
  let nOutbreaks = 0

  // TO-DO: MOVE THIS IF STATEMENT
  // if epidemic site had infection rate > 0 (i.e. adding three to it would push you over the edge)
  // then you have an outbreak! handle it
  if (cities[outbreakSite].infectionRate > 0) {
    const outbreakQueue = [outbreakSite]
    const seen = new Set()

    while (outbreakQueue.length) {
      nOutbreaks++
      const nextOutbreakSite = outbreakQueue.shift()
      const connections = cities[nextOutbreakSite].connections

      connections.forEach(connection => {
        const path = 'cities/' + connection + '/infectionRate'
        // outbreaks can compound infections in affected cities
        // so if you've already affected that city, you need to use its
        // updatedValue the next time (until it outbreaks and then its safe)
        const updatedInfectionRate = updatedData[path]
        const oldInfectionRate = cities[connection].infectionRate
        const infectionRate = updatedInfectionRate || oldInfectionRate

        // each new outbreak site is one with an infectionRate of 3
        // that you haven't already visited before
        if (infectionRate === 3 && !seen.has(connection)) {
          outbreakQueue.push(connection)
          seen.add(connection)
        }

        // any connection that has an infection rate of 0, 1 or 2
        // just needs to have its value incremented
        if (infectionRate < 3) {
          const newInfectionRate = infectionRate + 1
          updatedData[path] = newInfectionRate
        }
      })
    }
  }
  return { updatedData, nOutbreaks }
}
