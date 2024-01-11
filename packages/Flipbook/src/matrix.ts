import {
  identity,
  multiply,
  perspective,
  translate,
  translate3d,
  rotateY,
  toString
} from 'rematrix'

import type { Matrix3D } from 'rematrix'

export default class Matrix {
  private m: Matrix3D

  constructor(arg?: Matrix3D) {
    if (arg) {
      this.m = [...arg]
    } else {
      this.m = identity()
    }
  }

  public clone(): Matrix {
    return new Matrix(this.m)
  }

  public multiply(m: Matrix3D): void {
    this.m = multiply(this.m, m)
  }

  public perspective(d: number): void {
    this.multiply(perspective(d))
  }

  public transformX(x: number): number {
    return (x * this.m[0] + this.m[12]) / (x * this.m[3] + this.m[15])
  }

  public translate(x: number, y?: number): void {
    this.multiply(translate(x, y))
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
