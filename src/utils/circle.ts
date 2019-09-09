import { randomColor } from './tools'

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2
const easing = 0.05



export class Arc {
  private startAngle: number
  private init: number
  private endAngle: number
  private x: number
  private y: number
  private speed: number
  private radius: number
  private color: string
  private isAdd: boolean
  private canvas: any
  private context: any
  private isStop: boolean
  private name: string



  constructor(c: any, name: any) {
    this.startAngle = 4 * Math.PI * Math.random()
    this.init = this.startAngle
    this.endAngle = this.startAngle
    this.color = `rgba(${randomColor()}, 0.7)`
    this.x = centerX
    this.y = centerY
    this.speed = 0.1 + Math.random() * 0.1
    this.radius = Math.random() * window.innerWidth * 1/5 + 30
    this.isAdd = true
    this.isStop = false
    this.canvas = c
    this.name = name
    this.context = this.canvas.getContext('2d')
  }

  private draw () {
    this.context.beginPath()
    this.context.fillStyle = this.color
    this.context.moveTo(this.x, this.y)
    this.context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle)
    this.context.closePath()
    this.context.fill()
  }

  public run (){
    this.draw()
    if (this.endAngle - this.startAngle + 0.2 > Math.PI * 2 ) {
      this.isStop= true
    }
    this.endAngle += (Math.PI*2 - this.endAngle + this.init) * easing
  }
}