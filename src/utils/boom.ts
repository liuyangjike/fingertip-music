
import { randomColor } from './tools'

interface posi {
  x: number,
  y: number
}

export class Boom {
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
    this.gravity = 0.8 // 重力加速度
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