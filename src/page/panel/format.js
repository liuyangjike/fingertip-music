import BACK_LINES from '../../assets/audio/main.json'

let target = {}
let j = 0
for (let i in BACK_LINES) {
  if (j >2 && (j % 2 === 1) ) {
    for (let o = 0; o < 3; o++) {
      target[`${j}l${o}g0.mp3`] = BACK_LINES['0.mp3']
      target[`${j}l${o}g2.mp3`] = BACK_LINES['2.mp3']
      target[`${j}l${o}g${i}`] = BACK_LINES[`${j}.mp3`]
      target[`${j}l${o}g${j+1}.mp3`] = BACK_LINES[`${j}.mp3`]
    }
  }
  j++
}


export default target