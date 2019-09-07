

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


const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

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
