// @flow

import { vec2 } from "gl-matrix";
import React from "react";
import * as THREE from "three";
import { scaleLinear } from "d3-scale";
import { DEFUALT_VIEW_BOUNDS } from "src/vector";
import ResponsiveViewer from "./ResponsiveViewer";
import DefaultOrthoCamera from "./DefaultOrthoCamera";
import Object2D from "./Object2D";
import Axis from "./Axis";
import Rectangle from "./Rectangle";

type Props = {
  domain: [number, number],
  interval: [number, number]
};

const IntervalSelect = ({ domain, interval }: Props) => {
  const topLeft = vec2.fromValues(
    DEFUALT_VIEW_BOUNDS.x[0],
    DEFUALT_VIEW_BOUNDS.y[1]
  );
  const bottomRight = vec2.fromValues(
    DEFUALT_VIEW_BOUNDS.x[1],
    DEFUALT_VIEW_BOUNDS.y[0]
  );
  const center = vec2.create();
  vec2.add(center, topLeft, bottomRight);
  vec2.scale(center, center, 1 / 2);
  const scale = scaleLinear()
    .domain(domain)
    .range(DEFUALT_VIEW_BOUNDS.x);
  const ySlice = x => ({
    p0: vec2.fromValues(x, topLeft[1]),
    p1: vec2.fromValues(x, bottomRight[1])
  });
  const BackShadowLayer = ({ interval }) => (
    <Object2D position={center} layer={1}>
      <Rectangle
        color={new THREE.Color("#aaa")}
        opacity={0.3}
        start={vec2.clone(topLeft)}
        end={ySlice(scale(interval[0])).p1}
      />
      <Rectangle
        color={new THREE.Color("#aaa")}
        opacity={0.3}
        start={ySlice(scale(interval[1])).p0}
        end={bottomRight}
      />
    </Object2D>
  );
  const AxisLayer = ({ domain }) => (
    <Object2D position={center} layer={2}>
      <Axis
        domain={domain}
        direction="bottom"
        start={topLeft}
        end={bottomRight}
      />
    </Object2D>
  );
  const InteractionLayer = () => (
    <Object2D position={center} layer={0}>
      <Rectangle start={topLeft} end={bottomRight} opacity={0} />
    </Object2D>
  );
  return (
    <ResponsiveViewer transparent activeCamera="maincamera">
      <DefaultOrthoCamera name="maincamera" />
      <BackShadowLayer interval={interval} />
      <AxisLayer domain={domain} />
      <InteractionLayer />
    </ResponsiveViewer>
  );
};

IntervalSelect.defaultProps = {
  domain: [0, 1],
  interval: [0.1, 0.9]
};

export default IntervalSelect;
