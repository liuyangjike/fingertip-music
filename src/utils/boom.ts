
import { randomColor } from './tools'

interface posi {
  x: number,
  y: number
}


let context: any
let canvas: any


const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

class Boom {
  private nowLocation: posi
  private speed: number
  private acceleration: number
  private angle: number
  private targetCount: number
  private nowNum: number
  private alpha: number
  private gravity: number
  private decay: number
  private collection: Array<any>
  private context: any
  private mainColor: string
  private arrived: boolean

  constructor(startX: number, startY: number, context: any) {
    this.nowLocation = { x: startX, y: startY }  
    this.speed = Math.random() * window.innerWidth/30 + 5  // 速度
    this.acceleration = 0.95  // 加速度
    this.angle =  Math.random() * Math.PI * 2  // 随机角度扩散
    this.targetCount = 90  //阀值
    this.nowNum = 1  // 当前计算值
    this.alpha = 1  // 透明度
    this.gravity = 0.4 // 重力加速度
    this.decay = 0.015
    this.collection = new Array(4) //// 线段集合, 每次存3个，取3个帧的距离
    this.arrived = false  // 是否到达目标点
    this.mainColor = randomColor()
    this.context = context
  }

  private draw() {
    this.context.beginPath()
    try {
      this.context.moveTo(this.collection[0][0], this.collection[0][1])
    } catch(e) {
      this.context.moveTo(this.nowLocation.x, this.nowLocation.y)
    }
    this.context.lineWidth = 3
    this.context.lineCap = 'round'
    this.context.lineTo(this.nowLocation.x, this.nowLocation.y)
    this.context.strokeStyle = `rgba(${this.mainColor}, ${this.alpha})`
    this.context.stroke()
  }

  private update() {
    this.collection.shift()
    this.collection.push([this.nowLocation.x, this.nowLocation.y])
    this.speed *= this.acceleration

    let vx = Math.cos(this.angle) * this.speed
    // 加上重力系数，运动轨迹会趋向下
    let vy = Math.sin(this.angle) * this.speed + this.gravity

    // 当前计算大于阀值的时候的时候，开始进行渐隐处理
    if (this.nowNum >= this.targetCount) {
      this.alpha -= this.decay
    } else {
      this.nowLocation.x += vx
      this.nowLocation.y += vy
      this.nowNum++
    }

    // 透明度为0的话，可以进行移除处理，释放空间
    if (this.alpha <= 0) {
      this.arrived = true
    }
  }

  private init() {
    this.draw()
    this.update()
  }
}

export class FireBooms {
  private booms: Array<any>
  private isStop: boolean
  private name: string

  constructor (c: any, name: any) {
    // 定义一个数组为爆炸的集合
    this.booms = []
    this.isStop = false
    this.name = name
    // 避免每帧都进行绘制导致的过量绘制，设置阀值，到达阀值的时候再进行绘制
    canvas = c
    context = canvas.getContext('2d')
    this.pushBoom()
  }

  private pushBoom() {
     // 实例化爆炸效果，随机条数的射线扩散
    for (let bi = Math.random()*10 + 30; bi > 0; bi--) {
      this.booms.push(new Boom(centerX, centerY, context))
    }
  }

  public run () {

    let bnum = this.booms.length
    if (!bnum) this.isStop = true  // 停止单个动画
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