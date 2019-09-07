import { Arc } from './circle'
import { FireBooms } from './boom'
import { getClickMusic } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

let context: any
let canvas: any

interface posi {
  x: number,
  y: number
}

class Animate {
  private animations: Array<any>
  private stopAnimate: boolean

  constructor (c: any) {
    // 定义一个数组为动画集合
    this.animations = []
    this.stopAnimate = false
    // 避免每帧都进行绘制导致的过量绘制，设置阀值，到达阀值的时候再进行绘制
    canvas = c
    context = canvas.getContext('2d')
  }

  public pushAnimate(type:any) {
    // 如果还没有启动动画, 用一个定时器去启动, 为了push, 在run之前
    if (!this.animations.length) {
      setTimeout(() => {
        this.run()
      }, 100)
    }
    if (type === 'boom') {
      this.animations.push(new FireBooms(canvas, type))
    } else {
      this.animations.push(new Arc(canvas, type))
    }
    this.animations = this.animations.filter(item => item.name === type)
    this.stopAnimate = false
  }

  public run () {
    if (this.stopAnimate) return
    window.requestAnimationFrame(this.run.bind(this))
    context.clearRect(0, 0, canvas.width, canvas.height)

    let bnum = this.animations.length
    while(bnum--) {
      // 触发每个动画draw
      this.animations[bnum].run()
      console.log("TC -> run -> bnum", this.animations[bnum].isStop);
      if (this.animations[bnum].isStop) {
        //移除那个动画，释放空间
        this.animations.splice(bnum, 1)
      }
    }

    if (!this.animations.length) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      this.stopAnimate = true
    }
  }
}

export {
  getClickMusic,
  Arc,
  Animate
}