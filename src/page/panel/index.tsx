
import React, { createRef } from 'react';
import track from '../../assets/audio/track.json'
import BACK_LINES from './format'
import MikuAudio from './audio'
import Music from '../music'
import SwitchButton from '../../components/switch-button'
import { randBetween, throttle, debounce } from '../../utils/tools'
import { getClickMusic, Animate } from '../../utils'
import main from '../../assets/audio/main.json'
import './style.scss'

let bcList = []
for (let i in main) {
  bcList.push(main[i])
}

interface PanelProps {
}

interface PanelStates {
  audioUrl: string,
  cilckCount: number,
  current: number,
  bcColor: string,
  hasBackMusic: boolean
  showBtn: boolean

}

const mainColor = ['#88CCCC', '#594F57', '#EC5685', '#312B2D']
interface AudioObj {
  index: string
  audio: any
  buffer: any,
}


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

function endBack () {
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

function startBack () {
  if (!backEnable || backTimer) return
  backTimer = setInterval(() => {
    mikuAudio.play(backas[bindex], `b${bindex}`)
    bindex++
    if (bindex >= backas.length) bindex = 0
  }, 200)
}


class Panel extends React.Component<PanelProps, PanelStates> {

  private canvasRef = createRef<HTMLCanvasElement>()
  private musicRef = createRef<any>()

  private canvas: HTMLCanvasElement | null
  private actions: any
  private timer: any
  private lastActive: number

  constructor(props: any) {
    super(props)
    this.canvasRef = createRef()
    this.musicRef = createRef()
    this.canvas = null
    this.actions = null
    this.lastActive = 0
    this.state = {
      audioUrl: track[0].path,
      cilckCount: 1,
      bcColor: mainColor[0],
      current: 0,
      hasBackMusic: false,
      showBtn: true
    }
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current
    this.actions = new Animate(this.canvas)
    if (this.canvas) {
      this.canvas.addEventListener('click', this.handleClick, false)
      this.canvas.addEventListener('touchmove', throttle(this.handleTouch, 100), false)
      window.addEventListener('resize', () => {
        window.location.reload()
      }, false)
      
    }
  }

  componentWillUnmount() {
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick, false)
    }
  }

  handleTouch = (e:any) => {
    this.handleClick(e)
  }

  switchBackMusic = () => {
    const { hasBackMusic } = this.state
    if (hasBackMusic) {
      endBack()
    } else {
      startBack()
    }
    this.setState({
      hasBackMusic: !hasBackMusic
    })
  }

  handleClick = (e: any) => {
    const { cilckCount } = this.state
    const params = getClickMusic(e, e.target)
    if (e.touches) {
      if (this.lastActive === params.aIndex) {
        return
      } else {
        this.lastActive = params.aIndex
      }
    }
    let map = {
      0: 'fireboom',
      1: 'line',
      2: 'arc',
      3: 'ballboom'
    }
    let key = params.aIndex % 4
    if (cilckCount === 5) {
      this.setState({
        cilckCount: 0,
        bcColor: mainColor[randBetween(0, 3)]
      })
    } else {
      this.setState({
        cilckCount: cilckCount + 1
      })
    }

    this.actions.pushAnimate('button', params)
    this.actions.pushAnimate(map[key])
    clearTimeout(this.timer)
    this.setState({
      audioUrl: track[params.aIndex-1].path,
      showBtn: false
    }, () => {
      this.musicRef.current.onPlay()
    })
    this.timer = setTimeout(() => {
      this.setState({
        showBtn: true
      })
    }, 2000);
  }


  render () {
    const { audioUrl, bcColor, showBtn, hasBackMusic } = this.state
    const musicColor = {backgroundColor: bcColor}

    return (
      <div className='panel'>
       <Music audioUrl={audioUrl} ref={this.musicRef}/>
       <canvas
          ref={this.canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="music-canvas"
          style={musicColor}
        ></canvas>
        {showBtn && <div className='bc-music' onClick={this.switchBackMusic}>背景音乐: <SwitchButton hasBackMusic={hasBackMusic} /></div>}
      </div>
    )
  }
}


export default Panel;
