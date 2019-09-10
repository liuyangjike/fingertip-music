
import React, { createRef } from 'react';
import track from '../../assets/audio/track.json'
import Music from '../music'
import { getClickMusic, Animate } from '../../utils'
import './style.scss'


interface PanelProps {
}

interface PanelStates {
  audioUrl: string,
  blockInfo: any
}


class Panel extends React.Component<PanelProps, PanelStates> {

  private canvasRef = createRef<HTMLCanvasElement>()
  private musicRef = createRef<any>()
  private canvas: HTMLCanvasElement | null
  private actions: any

  constructor(props: any) {
    super(props)
    this.canvasRef = createRef()
    this.musicRef = createRef()
    this.canvas = null
    this.actions = null
    this.state = {
      audioUrl: track[0].path,
      blockInfo: null
    }
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current
    this.actions = new Animate(this.canvas)
    if (this.canvas) {
      this.canvas.addEventListener('click', this.handleClick, false)
    }
  }

  componentWillUnmount() {
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick, false)
    }
  }

  handleClick = (e: any) => {
    const params = getClickMusic(e, e.target)
    this.actions.pushAnimate('button', params)
    let map = {
      0: 'fireboom',
      1: 'line',
      2: 'arc',
      3: 'ballboom'
    }
    // let key = `${params.aIndex % 4}`
    let key = 1 % 4

    this.actions.pushAnimate(map[key])
    this.setState({
      audioUrl: track[params.aIndex-1].path,
      blockInfo: params
    }, () => {
      this.musicRef.current.onPlay()
      setTimeout(() => {
        this.setState({
          blockInfo: null
        })
      }, 300);
    })
  }


  render () {
    const { audioUrl, blockInfo } = this.state

    const blockStyle = blockInfo
      ? {
        width: blockInfo.w,
        height: blockInfo.h,
        top: blockInfo.y,
        left: blockInfo.x
      }
      : {}
    return (
      <div className='panel'>
       <Music audioUrl={audioUrl} ref={this.musicRef}/>
       <canvas 
          ref={this.canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="music-canvas"
        ></canvas>
      </div>
    )
  }
}


export default Panel;
