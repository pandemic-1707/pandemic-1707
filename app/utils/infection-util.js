const InfectionLevel = [2, 2, 2, 3, 3, 4, 4]
// everytime an infection card is withdrawn
function moveInfectionLevel(idx) {
  return InfectionLevel[idx+1]
}
