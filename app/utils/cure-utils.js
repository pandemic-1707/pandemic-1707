const NUM_CARDS_FOR_CURE = 5

module.exports = {
  // ///////CURE///////
  // canCureDisease > displayCardsForCure > handleCureCardChange, handleCureCardConfirm > cureDisease > change treat func so that it will auto cure all disease

  // check if it's possible to cure disease at this city
  // TODO: refactor to only have to check if research city once 
  // returns { curableColors: curableColors, sameColors: sameColors }
  // sameColors has key=color, value = array of cards of same color
  // curableColors is array of curable colors
  // if we have no curableColors, deactivate cure button
  canCureDisease: (activePlayer, allCities) => {
    // are we in a research city?
    const activePlayerCity = activePlayer && activePlayer.position && activePlayer.position.city
    const researchCity = Object.keys(allCities).find(function (city) {
      if (city === activePlayerCity && allCities[city].research === true) {
        return city
      }
    })
    if (researchCity) {
      // do we have 5 city cards of the same color
      const sameColors = {}
      // we have no cards on hand
      if (!activePlayer.hand || !activePlayer.hand.length) return false
      activePlayer.hand.forEach(function (card) {
        if (card.props) {
          if (sameColors[card.props.color]) sameColors[card.props.color].push(card)
          else sameColors[card.props.color] = [card]
        }
      })
      const curableColors = []
      Object.keys(sameColors).map(function (color) {
        if (sameColors[color].length >= NUM_CARDS_FOR_CURE) curableColors.push(color)
      })
      if (curableColors.length) return { curableColors: curableColors, sameColors: sameColors }
      else return false
    }
    return false
  }
}
