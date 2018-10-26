// @flow

import React from "react";
import { Line as THREELine } from "react-three";
import * as THREE from "three";
import type { Vector2 } from "src/vector";

type Props = {
  points: Vector2[],
  linewidth: number,
  color: THREE.Color
};

const Line = ({ points, linewidth, color }: Props) => {
  const geometry = new THREE.Geometry();
  geometry.vertices = points.map(p => new THREE.Vector3(p[0], p[1], 0));
  const material = new THREE.LineBasicMaterial({ color, linewidth });
  return <THREELine geometry={geometry} material={material} />;
};

Line.defaultProps = {
  color: new THREE.Color("#000"),
  linewidth: 1
};

export default Line;
