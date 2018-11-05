// @flow

import * as R from "ramda";
import { vec2 } from "gl-matrix";
import React from "react";
import * as THREE from "three";
import type { Chunk } from "src/series/store/types";
import Object2D from "./Object2D";
import Line from "./Line";

const LineMemo = R.memoizeWith(
  ({ interval, traceIndex, channelIndex }) =>
    `${interval[0]},${interval[1]}-${traceIndex}-${channelIndex}`,
  ({ interval, traceIndex, channelIndex, p0, values, scales, ...rest }) => {
    const scInterval = interval.map(scales[0]);

    const absPoints = values.map((value, i) =>
      vec2.fromValues(
        scInterval[0] + (i / values.length) * (scInterval[1] - scInterval[0]),
        scales[2](value)
      )
    );

    const points = absPoints.map(p => {
      const diff = vec2.create();
      vec2.sub(diff, p, p0);
      return diff;
    });

    return (
      <Line
        cacheKey={`${interval[0]},${interval[1]}-${traceIndex}-${channelIndex}`}
        points={points}
        {...rest}
      />
    );
  }
);

type Props = {
  channelIndex: number,
  traceIndex: number,
  chunk: Chunk,
  scales: [any, any, any],
  color?: THREE.Color
};

const LineChunk = ({
  channelIndex,
  traceIndex,
  chunk,
  scales,
  color,
  ...rest
}: Props) => {
  const { interval, values } = chunk;

  if (values.length === 0) {
    return <Object2D />;
  }

  const range = scales[2].range();

  const chunkLength0 = Math.abs(
    scales[0](interval[1]) - scales[0](interval[0])
  );
  const chunkLength1 = Math.abs(
    scales[1](interval[1]) - scales[1](interval[0])
  );

  const p0Global = vec2.fromValues(
    scales[0](interval[0]),
    -Math.abs(range[1] - range[0]) / 2
  );

  const p0Local = vec2.fromValues(
    scales[1](interval[0]),
    -Math.abs(range[1] - range[0]) / 2
  );

  const lineColor = color || new THREE.Color("#000");

  return (
    <Object2D
      position={p0Local}
      scale={new THREE.Vector3(chunkLength1 / chunkLength0, 1, 1)}
    >
      <LineMemo
        p0={p0Global}
        channelIndex={channelIndex}
        traceIndex={traceIndex}
        interval={interval}
        values={values}
        scales={scales}
        color={lineColor}
        {...rest}
      />
    </Object2D>
  );
};

export default LineChunk;
