
import React, { createRef } from 'react';
import Music from '../music'
import SwitchButton from '../../components/switch-button'
import { randBetween, throttle, debounce } from '../../utils/tools'
import { endBack, startBack } from '../../utils/back-music'
import { getClickMusic, Animate } from '../../utils'
import track from '../../assets/track.json'
import './style.scss'

interface PanelProps {
}

interface PanelStates {
  audioUrl: string
  cilckCount: number
  current: number
  bcColor: string
  hasBackMusic: boolean
  showBtn: boolean
  viewWidth: number
  viewHeight: number
}

const mainColor = ['#88CCCC', '#594F57', '#EC5685', '#312B2D']

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
      showBtn: true,
      viewWidth: window.innerWidth,
      viewHeight: window.innerHeight
    }
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current
    this.actions = new Animate(this.canvas)
    if (this.canvas) {
      this.canvas.addEventListener('click', this.handleClick, false)
      this.canvas.addEventListener('touchmove', throttle(this.handleTouch, 100), false)
      window.addEventListener('resize', debounce(this.handleReize, 100), false)
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

  handleReize = () => {
    this.setState({
      viewWidth: window.innerWidth,
      viewHeight: window.innerHeight
    })
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
    const { audioUrl, bcColor, showBtn, hasBackMusic, viewWidth, viewHeight } = this.state
    const musicColor = {backgroundColor: bcColor}

    return (
      <div className='panel'>
       <Music audioUrl={audioUrl} ref={this.musicRef}/>
       <canvas
          ref={this.canvasRef}
          width={viewWidth}
          height={viewHeight}
          className="music-canvas"
          style={musicColor}
        ></canvas>
        {showBtn && <div className='bc-music' >
          <div onClick={this.switchBackMusic}>背景音乐: <SwitchButton hasBackMusic={hasBackMusic} /></div>
          <p>参考: <a className="link" href="https://aidn.jp/mikutap">aidn.jp/mikutap</a></p>
        </div>}
      </div>
    )
  }
}


export default Panel;
