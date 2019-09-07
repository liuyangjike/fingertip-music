import { Arc } from './circle'

interface posiObj {
  x: number,
  y: number
}

interface areaData {
  w: number,
  h: number,
  xAmount: number,
  yAmount: number
}


interface UIEvent {
  changedTouched: Array<any>
}

var isTouch = ('ontouched' in document)  //检测是移动还是PC

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2


export function getPoint(event: UIEvent , canvas: HTMLCanvasElement): posiObj {
  event = event || window.event   //为了兼容
  var touchEvent = isTouch ? event.changedTouched[0]:event
  // pageX 和 pageY 分别是触点相对HTML文档左边沿的X坐标和触点相对HTML文档上边沿的Y坐标。只读属性。 
  //当存在滚动的偏移时，pageX包含了水平滚动的偏移，pageY包含了垂直滚动的偏移。
  var x = (touchEvent.pageX || touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft)
  x -= canvas.offsetLeft
  var y = (touchEvent.pageY || touchEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop)
  y -= canvas.offsetTop
  return {x, y}
}


export function calculBlock(): areaData {
  if (window.innerHeight > window.innerWidth) {
    return {
      w: window.innerWidth / 4,
      h: window.innerHeight / 8,
      xAmount: 4,
      yAmount: 8
    }
  }
  return {
    w: window.innerWidth / 8,
    h: window.innerHeight / 4,
    xAmount: 8,
    yAmount: 4
  }
}

export function getClickMusic(event: UIEvent, canvas: HTMLCanvasElement) {
  const { w, h, xAmount } = calculBlock()
  const { x, y } = getPoint(event, canvas)

  return {
    aIndex: Math.ceil(x/w) + Math.floor(y/h) * xAmount,
    w,
    h,
    x: Math.floor(x/w) * w,
    y: Math.floor(y/h) * h,
  }
}

const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
const bounce = -0.7

class Square {
  private sideLength: number
  private x: number
  private y: number
  private angle: number
  private speed: number

  constructor(x: number, y: number, angle: number, sideLength: number, i:number) {
    this.x = x
    this.y = y
    this.angle = angles[i] * Math.random() * 3
    this.speed = Math.random() * 20 + 5
    this.sideLength = sideLength
  } 
}

export function drawFireSquare(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')
  let x = centerX
  let y = centerY
  let squares: Array<any> = []
  var deg = Math.PI/180;
  for(let i = 0; i < 10; i++) {
    let square = new Square(centerX, centerY, 0, 1, i)
    squares.push(square)
  }

  let stop = false

  function drawSquare () {
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height);

    squares.forEach(square => {
      context.fillStyle = '#f07c82'
      context.rotate(45 * Math.PI / 180);
      context.fillRect(square.x, square.y, square.sideLength, square.sideLength);
      square.x += square.speed * Math.cos(deg * square.angle)
      square.y += square.speed * Math.sin(deg * square.angle)
      if (square.speed > 0) {
        square.speed -= 0.3
        square.sideLength += Math.random() * 3
      } else {
        square.speed = 0
      }
      if (square.x < 0 || square.x > canvas.width || square.y < 0 || square.y > canvas.height) {
        stop = true
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
    })
    if (stop) {
      setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 200);
      return
    }
    requestAnimationFrame(drawSquare)
  }
  drawSquare()
}

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
  private mainColor: string
  private arrived: boolean

  constructor(startX: number, startY: number) {
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
  }

  private draw() {
    context.beginPath()
    try {
      context.moveTo(this.collection[0][0], this.collection[0][1])
    } catch(e) {
      context.moveTo(this.nowLocation.x, this.nowLocation.y)
    }
    context.lineWidth = 3
    context.lineCap = 'round'
    context.lineTo(this.nowLocation.x, this.nowLocation.y)
    context.strokeStyle = `rgba(${this.mainColor}, ${this.alpha})`
    context.stroke()
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

class Animate {
  private booms: Array<any>
  private timerTarget: number
  private timeNum: number

  constructor (c: any) {
    // 定义一个数组为爆炸的集合
    this.booms = []
    // 避免每帧都进行绘制导致的过量绘制，设置阀值，到达阀值的时候再进行绘制
    this.timerTarget = 80
    this.timeNum = 200
    canvas = c
    context = canvas.getContext('2d')
    this.pushBoom()
  }

  private pushBoom() {
     // 实例化爆炸效果，随机条数的射线扩散
    for (let bi = Math.random()*10 + 20; bi > 0; bi--) {
      this.booms.push(new Boom(centerX, centerY))
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
    // this.pushBoom()


    // if (this.timeNum >= this.timerTarget) {
    //   this.pushBoom()
    //   this.timeNum = 0
    // } else {
    //   // this.timeNum ++
    // }
  }
}

export const boom = Animate


export {
  Arc
}