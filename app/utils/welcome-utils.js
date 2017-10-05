import fire from '../../fire'
export function filteredObj(players) {
  var convertPlayersToArr = Object.keys(players).map(function(key) {
    return [(key), players[key]]
  })
  var filteredArr = convertPlayersToArr.filter(arr => arr[1]['name'])
  var res = filteredArr.reduce(function(result, item) {
    var key = item[0]
    result[key] = item[1]
    return result
  }, {})
  return res
}
