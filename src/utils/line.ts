import { randomColor } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2
const easing = 0.05


interface posi {
  x: number,
  y: number
}

export class Line {
  private lineCollection: Array<posi>
  private lineWidth: number
  private speed: number
  private angle: number
  private alpha: number
  private color: string
  private canvas: any
  private context: any
  private targetCount: number
  private isStop: boolean
  private name: string


  constructor(c: any, name: any) {
    this.alpha = 1  // 透明度
    this.lineCollection = []
    this.color = `${randomColor()}`
    this.lineWidth = Math.random() * 20 + 5
    this.speed = Math.random() * 10 + 10
    this.angle = Math.random() * 2 + 0.2
    this.isStop = false
    this.canvas = c
    this.targetCount = 0
    this.name = name
    this.context = this.canvas.getContext('2d')
    this.init()
  }

  private init () {
    let direction = Math.random() > 0.5 ? 'x' : 'y'
    let startPoint = direction === 'x' ? {x: -10, y: Math.random() * window.innerHeight/3 + window.innerHeight/3} :  {x:  Math.random() * window.innerWidth/3 + window.innerWidth/3, y: -10}
    let secondPoint = Object.assign({}, startPoint)
    this.lineCollection.push(startPoint, secondPoint)
  }

  private draw () {
    this.context.beginPath()
    this.context.moveTo(this.lineCollection[0].x, this.lineCollection[0].y)
    for (let i = 1; i< this.lineCollection.length; i++) {
      this.context.lineTo(this.lineCollection[i].x, this.lineCollection[i].y)
    }
    this.context.strokeStyle = `rgba(${this.color}, ${this.alpha})`
    this.context.lineWidth = this.lineWidth
    this.context.stroke()
    this.context.closePath()
  }

  public run (){
    this.draw()
    let speed = this.angle * this.speed
    let secondPoint = this.lineCollection[1]
    this.targetCount++
    if (this.targetCount < 20) {
      this.lineCollection[1] = {
        x: secondPoint.x + this.speed,
        y: secondPoint.y + speed,
      }
    } else if(this.targetCount === 20) {
      this.lineCollection[2] = {
        x: secondPoint.x + this.speed,
        y: secondPoint.y - speed,
      }
    } else {
      let thirdPoint = this.lineCollection[2]
      if (thirdPoint.y < 0) {
        this.alpha -= 0.02
        if (this.alpha < 0) {
          this.isStop = true
          return
        }
      }
      this.lineCollection[2] = {
        x: thirdPoint.x + speed,
        y: thirdPoint.y - speed,
      }
    }
  }
}