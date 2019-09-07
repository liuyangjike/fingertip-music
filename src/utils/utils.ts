
export function randomColor(){
  // 返回一个0-255的数值，三个随机组合为一起可定位一种rgb颜色
  let num = 3
  let color = []
  while(num--){
      color.push(Math.floor(Math.random()*254+1))
  }
  return color.join(', ')
}