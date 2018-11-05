// @flow

import { vec2 } from "gl-matrix";
import React from "react";
import { Mesh } from "react-three";
import * as THREE from "three";
import type { Vector2 } from "src/vector";
import Object2D from "./Object2D";

type Props = {
  start: Vector2,
  end: Vector2,
  color: THREE.Color,
  opacity: number
};

const Rectangle = ({ start, end, color, opacity, ...rest }: Props) => {
  const d = vec2.create();
  vec2.sub(d, end, start);
  const p = vec2.create();
  vec2.add(p, start, end);
  vec2.scale(p, p, 1 / 2);
  const geometry = new THREE.PlaneGeometry(Math.abs(d[0]), Math.abs(d[1]));
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    premultipliedAlpha: true,
    side: THREE.DoubleSide
  });
  return (
    <Object2D position={p}>
      <Mesh geometry={geometry} material={material} {...rest} />
    </Object2D>
  );
};

Rectangle.defaultProps = {
  color: new THREE.Color("#000"),
  opacity: 1.0
};

export default Rectangle;
