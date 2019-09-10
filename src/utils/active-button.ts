let context: any
let canvas: any

export class ActiveButton {
  private alpha: number
  private isStop: boolean
  private params: any
  private name: any
  private direction: number

  constructor(c: any, name: string , params: any) {  //
    this.alpha = 0.1
    this.direction = 1
    this.isStop = false
    this.params = params
    canvas = c
    context = canvas.getContext('2d')
  }

  private draw () {
    const { x, y, w, h} = this.params 
    context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
    context.fillRect(x,y,w,h)
  }

  public update (){
    this.draw()
    this.alpha += 0.03 * this.direction
    if (this.alpha > 0.35) {
      this.direction = -1
    }
    if (this.alpha < 0) {
      this.isStop = true
    }
  }
}