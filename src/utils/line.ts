import { randomColor, randBetween } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2
const easing = 0.05


interface posi {
  x: number,
  y: number
}

let canvas: any
let context: any

export class Line {
  private lineCollection: Array<posi>
  private lineWidth: number
  private speed: number
  private startAngle: number
  private angle: number
  private alpha: number
  private color: string
  private targetCount: number
  private fadeTimer: string
  private isStop: boolean
  private name: string
  private direction: string
  private firstChange: number
  private firstAngle: number
  private secondChange: number


  constructor(c: any, name: any) {
    this.alpha = 1  // 透明度
    this.lineCollection = []
    this.color = `${randomColor()}`
    this.lineWidth = Math.random() * 20 + 5
    this.speed = Math.random() * 10 + 10
    this.angle = Math.random() * 2 + 0.2
    this.isStop = false
    this.startAngle = Math.PI * randBetween(60, 120) / 180
    this.firstAngle = Math.PI * randBetween(170, 190) / 180 - this.startAngle
    this.targetCount = 0
    this.name = name
    this.fadeTimer = ''
    this.direction = Math.random() > 0.5 ? 'x' : 'y'
    this.firstChange = this.direction === 'x' ? window.innerWidth /3 : window.innerHeight /3
    this.secondChange = this.direction === 'x' ? window.innerWidth * 2/3 : window.innerHeight * 2 /3
    canvas = c
    context = canvas.getContext('2d')
    this.init()
  }

  private init () {
    let startPoint = this.direction === 'x' ? {x: -10, y: Math.random() * window.innerHeight/3 + window.innerHeight/3} :  {x:  Math.random() * window.innerWidth/3 + window.innerWidth/3, y: -10}
    let secondPoint = Object.assign({}, startPoint)
    this.lineCollection.push(startPoint, secondPoint)
  }

  private draw () {
    context.beginPath()
    context.moveTo(this.lineCollection[0].x, this.lineCollection[0].y)
    for (let i = 1; i< this.lineCollection.length; i++) {
      context.lineTo(this.lineCollection[i].x, this.lineCollection[i].y)
    }
    context.strokeStyle = `rgba(${this.color}, ${this.alpha})`
    context.lineWidth = this.lineWidth
    context.stroke()
    context.closePath()
  }

  public update (){
    this.draw()
    let secondPoint = this.lineCollection[1]
    if (secondPoint[this.direction] < this.firstChange) {
      let xAdd = this.direction === 'x' ? Math.sin(this.startAngle) : Math.cos(this.startAngle)
      let yAdd = this.direction === 'x' ? Math.cos(this.startAngle) : Math.sin(this.startAngle)
      this.lineCollection[1] = {
        x: secondPoint.x + xAdd * this.speed,
        y: secondPoint.y + yAdd * this.speed,
      }
    } else if (secondPoint[this.direction] < this.secondChange) {
      if (this.lineCollection.length === 2 ) {
        this.lineCollection.push(secondPoint)
      }
      let thirdPoint = this.lineCollection[2]
      let xAdd = this.direction === 'x' ? Math.sin(this.firstAngle) : Math.cos(this.firstAngle)
      let yAdd = this.direction === 'x' ? Math.cos(this.firstAngle) : Math.sin(this.firstAngle)
      this.lineCollection[2] = {
        x: thirdPoint.x + xAdd * this.speed,
        y: thirdPoint.y + yAdd * this.speed,
      }
      if (thirdPoint.x > window.innerWidth || thirdPoint.y > window.innerHeight) {
        this.alpha -= 0.01
        setTimeout(() => {
          this.isStop = true
        }, 1000);
      }
    }
  }
}