
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
  changedTouches: Array<any>
}


function getPoint(event: UIEvent , canvas: HTMLCanvasElement): posiObj {
  event = event || window.event   //为了兼容
  // console.log("TCL: event", isTouch);
  var touchEvent = event.changedTouches ? event.changedTouches[0]:event
  // pageX 和 pageY 分别是触点相对HTML文档左边沿的X坐标和触点相对HTML文档上边沿的Y坐标。只读属性。 
  //当存在滚动的偏移时，pageX包含了水平滚动的偏移，pageY包含了垂直滚动的偏移。
  var x = (touchEvent.pageX || touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft)
  x -= canvas.offsetLeft
  var y = (touchEvent.pageY || touchEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop)
  y -= canvas.offsetTop
  return {x, y}
}


function calculBlock(): areaData {
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



export function randomColor(){
  // 返回一个0-255的数值，三个随机组合为一起可定位一种rgb颜色
  let num = 3
  let color = []
  while(num--){
      color.push(Math.floor(Math.random()*254+1))
  }
  return color.join(', ')
}



export function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max-min)) + min;
}


export function throttle(func: any, delay: number) {
  var prev = Date.now();
  return function() {
      var context = this;
      var args = arguments;
      var now = Date.now();
      if (now - prev >= delay) {
          func.apply(context, args);
          prev = Date.now();
      }
  }
}