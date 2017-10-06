// TO-DO: REFACTOR INTO TWO FUNCTIONS: 1) INFECT/DETECT OUTBREAKS AND 2) HANDLE OUTBREAK
module.exports = function(outbreakSite, cities) {
  const updatedData = {}
  updatedData['cities/' + outbreakSite + '/infectionRate'] = 3

  if (cities[outbreakSite].infectionRate > 0) {
    const outbreakQueue = [outbreakSite]
    const seen = new Set()

    while (outbreakQueue.length) {
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

  return updatedData
}
