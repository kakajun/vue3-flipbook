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
