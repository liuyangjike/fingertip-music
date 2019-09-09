import { randBetween } from './tools'

const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
let normal = {
  x: window.innerWidth /2,
  y: window.innerHeight /2
}
let canvas:any
let width: number, height:number
let ctx:any
let balls: Array<any> = []

width= window.innerWidth
height = window.innerHeight

class Ball {
  private x: number
  private y: number
  private vx: number
  private vy: number
  private angle: number
  private multiplier: number
  private color: string
  private r: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = Math.PI * 2 * Math.random();
    this.multiplier = randBetween(8, 14);
    
    this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
    this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
    this.r = randBetween(8, 12) + 3 * Math.random();
    this.color = colours[Math.floor(Math.random() * colours.length)];
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.r -= 0.1
    this.vx *= 0.97
    this.vy *= 0.97
  }
}

export class FireBall {
  private balls: Array<any>
  private isStop: boolean


  constructor(c: any, name: any) {
    canvas = c
    ctx = canvas.getContext('2d')
    this.balls = []
    this.isStop = false
    this.pushBalls(randBetween(10, 20), normal.x, normal.y)
  }

  pushBalls(count = 1, x:number, y: number) {
    for (let i = 0; i < count; i++) {
      this.balls.push(new Ball(x, y));
    }
  }

  removeBall() {
    for (let i = 0; i < this.balls.length; i++) {
      let b = this.balls[i];
      if (
        b.x + b.r < 0 ||
        b.x - b.r > width ||
        b.y + b.r < 0 ||
        b.y - b.r > height ||
        b.r < 0
      ) {
        this.balls.splice(i, 1);
      }
    }
  }
  
  public run () {
    for (let i = 0; i < this.balls.length; i++) {
      let b = this.balls[i];
      if (b.r < 0) continue;
      b.draw()
      b.update()
    }
    if (!this.balls.length) {
      this.isStop = true
      return
    }
    this.removeBall()
  }
}