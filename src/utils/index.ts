import { Arc } from './circle'
import { Boom } from './boom'
import { getClickMusic } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

let context: any
let canvas: any

interface posi {
  x: number,
  y: number
}

function randomColor(){
  // 返回一个0-255的数值，三个随机组合为一起可定位一种rgb颜色
  let num = 3
  let color = []
  while(num--){
      color.push(Math.floor(Math.random()*254+1))
  }
  return color.join(', ')
}


class Animate {
  private booms: Array<any>

  constructor (c: any) {
    // 定义一个数组为爆炸的集合
    this.booms = []
    // 避免每帧都进行绘制导致的过量绘制，设置阀值，到达阀值的时候再进行绘制
    canvas = c
    context = canvas.getContext('2d')
    this.pushBoom()
  }

  private pushBoom() {
     // 实例化爆炸效果，随机条数的射线扩散
    for (let bi = Math.random()*10 + 20; bi > 0; bi--) {
      this.booms.push(new Boom(centerX, centerY, context))
    }
  }

  public run () {
    window.requestAnimationFrame(this.run.bind(this))
    context.clearRect(0, 0, canvas.width, canvas.height)

    let bnum = this.booms.length
    while(bnum--) {
      // 触发动画
      this.booms[bnum].init()
      if (this.booms[bnum].arrived) {
        // 到达目标透明度后，把炸点给移除，释放空间
        this.booms.splice(bnum, 1)
      }
    }
  }
}

export const boom = Animate

export {
  getClickMusic,
  Arc
}