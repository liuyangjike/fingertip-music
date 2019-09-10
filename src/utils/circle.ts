import { randomColor } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2
const easing = 0.05

let context: any
let canvas: any

export class Circle {
  private startAngle: number
  private init: number
  private endAngle: number
  private radius: number
  private color: string
  private isStop: boolean
  private name: string

  constructor(c: any, name: any) {
    this.startAngle = 4 * Math.PI * Math.random()
    this.init = this.startAngle
    this.endAngle = this.startAngle
    this.color = `rgba(${randomColor()}, 0.7)`
    this.radius = Math.random() * window.innerWidth * 1/5 + 30
    this.isStop = false
    this.name = name
    canvas = c
    context = canvas.getContext('2d')
  }

  private draw () {
    context.beginPath()
    context.fillStyle = this.color
    context.moveTo(centerX, centerY)
    context.arc(centerX, centerY, this.radius, this.startAngle, this.endAngle)
    context.closePath()
    context.fill()
  }

  public update (){
    this.draw()
    if (this.endAngle - this.startAngle + 0.2 > Math.PI * 2 ) {
      this.isStop= true
    }
    this.endAngle += (Math.PI*2 - this.endAngle + this.init) * easing
  }
}