import { Circle } from './circle'
import { FireBoom } from './fireboom'
import { Line } from './line'
import { BallBoom } from './fireball'
import { ActiveButton } from './active-button'
import { getClickMusic } from './tools'

let context: any
let canvas: any
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

  public pushAnimate(type:any, params: any) {
    let currentAnimate

    // 如果还没有启动动画, 用一个定时器去启动, 为了push, 在run之前
    if (type === 'fireboom') {
      currentAnimate = new FireBoom(canvas, type)
    } else if (type === 'arc') {
      currentAnimate = new Circle(canvas, type)
    } else if (type === 'line') {
      currentAnimate = new Line(canvas, type)
    } else if (type === 'ballboom') {
      currentAnimate = new BallBoom(canvas, type)
    } else {
      currentAnimate = new ActiveButton(canvas, type, params)
    } 
    if (!this.animations.length) {
      setTimeout(() => {
        this.run()
      }, 100)
    }
    
    // 如果还没有启动动画, 用一个定时器去启动, 为了push, 在run之前
    this.animations.push(currentAnimate)
    this.stopAnimate = false
  }

  private run () {
    if (this.stopAnimate) return
    window.requestAnimationFrame(this.run.bind(this))
    context.clearRect(0, 0, canvas.width, canvas.height)


    let bnum = this.animations.length
    while(bnum--) {
      // 触发每个动画draw
      this.animations[bnum].update()
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
  Animate
}