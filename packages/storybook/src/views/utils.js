// 计算页面旋转角度
export const calculatePageRotation = (progress, direction, face) => {
  let pageRotation = 0
  if (progress > 0.5) {
    pageRotation = -(progress - 0.5) * 2 * 180
  }
  if (direction === 'left') {
    pageRotation = -pageRotation
  }
  if (face === 'back') {
    pageRotation += 180
  }
  return pageRotation
}

const easeIn = (x) => Math.pow(x, 2)
const easeOut = (x) => 1 - easeIn(1 - x)
export const easeInOut = (x) => {
  if (x < 0.5) {
    return easeIn(x * 2) / 2
  } else {
    return 0.5 + easeOut((x - 0.5) * 2) / 2
  }
}
