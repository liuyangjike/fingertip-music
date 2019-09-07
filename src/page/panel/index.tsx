
import React, { createRef } from 'react';
import track from '../../assets/audio/track.json'
import Music from '../music'
import { getClickMusic, Arc, Animate } from '../../utils'
import './style.scss'


interface PanelProps {
}

interface PanelStates {
  audioUrl: string,
  blockInfo: any
}

let btnOpacity = 0.02
let direction = 1

class Panel extends React.Component<PanelProps, PanelStates> {

  private canvasRef = createRef<HTMLCanvasElement>()
  private musicRef = createRef<any>()
  private blockRef = createRef<HTMLDivElement>()
  private canvas: HTMLCanvasElement | null
  private actions: any


  constructor(props: any) {
    super(props)
    this.canvasRef = createRef()
    this.musicRef = createRef()
    this.blockRef = createRef()
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

  hoverButton = (params: any) => {
    if (this.canvas) {
      const context = this.canvas.getContext('2d')
      if (context) {
        // this.drawButton(context, params)
      }
    }
  }

  // drawButton = (context: any, params: any) => {
  // const { x, y, w, h} = params  //  rgba(136,204,204, 1)
  //   context.fillStyle = `rgba(255, 255, 255, 1)`
  //   // btnOpacity += 0.01 * direction
  //   // context.fillRect(x,y,w,h)
  //   // context.fillStyle = `rgba(255, 255, 255, 0.3)`
  //   // context.fillRect(0,0,w + w,h + h)

  //   // if (btnOpacity > 0.3) {
  //   //   direction = -1
  //   // }
  //   // if (btnOpacity < 0.02) {
  //   //   context.clearRect(x - 1,y - 1,w + 2,h + 2)
  //   //   btnOpacity = 0.02
  //   //   direction = 1
  //   //   return
  //   // }
  //   // requestAnimationFrame(this.drawButton.bind(this, context, params))

  // }

  handleClick = (e: any) => {
    const params = getClickMusic(e, e.target)
    this.hoverButton(params)
    // this.canvas && drawFireSquare(this.canvas)
    // const vm = new boom(this.canvas)
    // vm.run()
    console.log(1)
    this.actions.pushAnimate(params.aIndex % 2 ===0 ? 'boom' : 'arc')
    // animate.run()
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
       <div className={blockInfo && 'click-block'} style={blockStyle}></div>
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
