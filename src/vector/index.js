// @flow
import { vec2, glMatrix } from "gl-matrix";

export type Vector2 = glMatrix.ARRAY_TYPE;

export const ap = (f: [(any) => any, (any) => any], p: Vector2): Vector2 =>
  vec2.fromValues(f[0](p[0]), f[1](p[1]));

export const DEFUALT_VIEW_BOUNDS = {
  x: [-1.0, 1.0],
  y: [-1.0, 1.0]
};
