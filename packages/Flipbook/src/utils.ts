import Matrix from './matrix'
// 计算页面旋转角度
export const calculatePageRotation = (
  progress: number,
  direction: string,
  face: string
): number => {
  let pageRotation: number = 0
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

const easeIn = (x: number): number => Math.pow(x, 2)
const easeOut = (x: number): number => 1 - easeIn(1 - x)
export const easeInOut = (x: number): number => {
  if (x < 0.5) {
    return easeIn(x * 2) / 2
  } else {
    return 0.5 + easeOut((x - 0.5) * 2) / 2
  }
}

// // 计算页面X坐标和原点位置
export const calculatePageXAndOrigin = (
  face: string,
  direction: string,
  xMargin: number,
  displayedPages: number,
  forwardDirection: string,
  pageWidth: number,
  viewWidth: number
) => {
  let pageX = xMargin
  let originRight = false
  if (displayedPages === 1) {
    if (forwardDirection === 'right') {
      if (face === 'back') {
        originRight = true
        pageX = xMargin - pageWidth
      }
    } else {
      if (direction === 'left') {
        if (face === 'back') {
          pageX = pageWidth - xMargin
        } else {
          originRight = true
        }
      } else {
        if (face === 'front') {
          pageX = pageWidth - xMargin
        } else {
          originRight = true
        }
      }
    }
  } else {
    if (direction === 'left') {
      if (face === 'back') {
        pageX = viewWidth / 2
      } else {
        originRight = true
      }
    } else {
      if (face === 'front') {
        pageX = viewWidth / 2
      } else {
        originRight = true
      }
    }
  }
  return {
    pageX,
    originRight
  }
}

// 计算页面矩阵
export const calculatePageMatrix = (
  pageX: number,
  originRight: boolean,
  pageRotation: number,
  viewWidth: number,
  perspective: number,
  yMargin: number,
  pageWidth: number
) => {
  const pageMatrix = new Matrix()
  pageMatrix.translate(viewWidth / 2)
  pageMatrix.perspective(perspective)
  pageMatrix.translate(-viewWidth / 2)
  pageMatrix.translate(pageX, yMargin)

  if (pageRotation) {
    if (originRight) {
      pageMatrix.translate(pageWidth)
    }
    pageMatrix.rotateY(pageRotation)
    if (originRight) {
      pageMatrix.translate(-pageWidth)
    }
  }

  return pageMatrix
}

export const calculateThetaAndRadius = (progress: number, pageWidth: number) => {
  let theta
  if (progress < 0.5) theta = progress * 2 * Math.PI
  else theta = (1 - (progress - 0.5) * 2) * Math.PI
  if (theta == 0) theta = 1e-9

  const radius = pageWidth / theta

  return {
    theta,
    radius
  }
}

export const calculateRotate = (theta: number, dRadian: number, originRight: boolean) => {
  return originRight
    ? (-theta / Math.PI) * 180 + (dRadian / 2 / Math.PI) * 180
    : (dRadian / 2 / Math.PI) * 180
}

export const computeLighting = (
  rot: number,
  dRotate: number,
  ambient: number,
  gloss: number
): string => {
  const gradients = []
  const lightingPoints = [-0.5, -0.25, 0, 0.25, 0.5]
  if (ambient < 1) {
    const blackness = 1 - ambient
    const diffuse = lightingPoints.map(
      (d) => (1 - Math.cos(((rot - dRotate * d) / 180) * Math.PI)) * blackness
    )
    gradients.push(
      `linear-gradient(to right, rgba(0, 0, 0, ${diffuse[0]}), rgba(0, 0, 0, ${diffuse[1]}) 25%, rgba(0, 0, 0, ${diffuse[2]}) 50%, rgba(0, 0, 0, ${diffuse[3]}) 75%, rgba(0, 0, 0, ${diffuse[4]}))`
    )
  }

  if (gloss > 0) {
    const DEG = 30
    const POW = 200
    const specular = lightingPoints.map((d) =>
      Math.max(
        Math.cos(((rot + DEG - dRotate * d) / 180) * Math.PI) ** POW,
        Math.cos(((rot - DEG - dRotate * d) / 180) * Math.PI) ** POW
      )
    )
    gradients.push(
      `linear-gradient(to right, rgba(255, 255, 255, ${specular[0] * gloss}), rgba(255, 255, 255, ${
        specular[1] * gloss
      }) 25%, rgba(255, 255, 255, ${specular[2] * gloss}) 50%, rgba(255, 255, 255, ${
        specular[3] * gloss
      }) 75%, rgba(255, 255, 255, ${specular[4] * gloss}))`
    )
  }

  return gradients.join(',')
}

export const calculateXAndZ = (rad: number, radius: number, originRight: boolean, face: string,pageWidth:number) => {
  let x = Math.sin(rad) * radius
  if (originRight) {
    x = pageWidth - x
  }
  let z = (1 - Math.cos(rad)) * radius
  if (face === 'back') {
    z = -z
  }

  return { x, z }
}
