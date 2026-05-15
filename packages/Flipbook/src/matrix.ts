function identity(): number[] {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}

function multiply(a: number[], b: number[]): number[] {
  const product = new Array(16)
  for (let i = 0; i < 4; i++) {
    const ai = a[i]
    const ai4 = a[i + 4]
    const ai8 = a[i + 8]
    const ai12 = a[i + 12]
    for (let j = 0; j < 4; j++) {
      const k = j * 4
      product[i + k] =
        ai * b[k] + ai4 * b[k + 1] + ai8 * b[k + 2] + ai12 * b[k + 3]
    }
  }
  return product
}

function perspective(distance: number): number[] {
  const matrix = identity()
  if (typeof distance === 'number' && isFinite(distance) && distance !== 0) {
    matrix[11] = -1 / distance
  }
  return matrix
}

function rotateY(angle: number): number[] {
  const matrix = identity()
  if (typeof angle === 'number' && isFinite(angle)) {
    const theta = (Math.PI / 180) * angle
    const c = Math.cos(theta)
    const s = Math.sin(theta)
    matrix[0] = c
    matrix[2] = -s
    matrix[8] = s
    matrix[10] = c
  }
  return matrix
}

function translate3d(x: number, y: number, z: number): number[] {
  const matrix = identity()
  matrix[12] = typeof x === 'number' && isFinite(x) ? x : 0
  matrix[13] = typeof y === 'number' && isFinite(y) ? y : 0
  matrix[14] = typeof z === 'number' && isFinite(z) ? z : 0
  return matrix
}

function toString(source: number[]): string {
  return 'matrix3d(' + source.join(', ') + ')'
}

export default class Matrix {
  private m: number[]

  constructor(arg?: number[]) {
    if (arg && Array.isArray(arg) && arg.length === 16) {
      this.m = arg.map((v) =>
        typeof v === 'number' && isFinite(v) ? v : 0
      )
    } else {
      this.m = identity()
    }
  }

  public clone(): Matrix {
    return new Matrix(this.m)
  }

  public multiply(m: number[]): void {
    if (Array.isArray(m) && m.length === 16) {
      this.m = multiply(this.m, m)
    }
  }

  public perspective(d: number): void {
    this.multiply(perspective(d))
  }

  public transformX(x: number): number {
    const denominator = x * this.m[3] + this.m[15]
    if (denominator === 0) {
      return x * this.m[0] + this.m[12]
    }
    return (x * this.m[0] + this.m[12]) / denominator
  }

  public translate(x: number, y: number = 0): void {
    this.multiply(translate3d(x, y, 0))
  }

  public translate3d(x: number, y: number, z: number): void {
    this.multiply(translate3d(x, y, z))
  }

  public rotateY(deg: number): void {
    this.multiply(rotateY(deg))
  }

  public toString(): string {
    return toString(this.m)
  }
}
