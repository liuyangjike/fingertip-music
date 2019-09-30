import { getBackMusic } from './tools'
import MikuAudio from './audio'

interface AudioObj {
  index: string
  audio: any
  buffer: any,
}

let BACK_LINES = getBackMusic()
let backas = addBackAuido()
let backEnable = true
let backTimer:any
let mikuAudio = new MikuAudio()
let bindex = 0

function addBackAuido () {
  let arr = []
  for (let i in BACK_LINES) {
    let src = BACK_LINES[i]
    let obj: AudioObj = {
      index: '',
      audio: {},
      buffer: {}
    }
    obj.index = i
    obj.audio = new Audio(src)
    obj.buffer = base64ToArrayBuffer(src)
    arr.push(obj)
  }
  return arr
}

export function endBack () {
  if (backTimer) {
    clearInterval(backTimer)
    backTimer = null
  }
}

function base64ToArrayBuffer (base64: string) {
  var binary_string = window.atob(base64.split(',')[1])
  var len = binary_string.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

export function startBack () {
  if (!backEnable || backTimer) return
  backTimer = setInterval(() => {
    mikuAudio.play(backas[bindex], `b${bindex}`)
    bindex++
    if (bindex >= backas.length) bindex = 0
  }, 200)
}
