// @flow

import { vec2 } from "gl-matrix";
import React from "react";
import { scaleLinear } from "d3-scale";
import { DEFUALT_VIEW_BOUNDS } from "src/vector";
import ResponsiveViewer from "./ResponsiveViewer";
import DefaultOrthoCamera from "./DefaultOrthoCamera";
import Object2D from "./Object2D";
import Axis from "./Axis";
import Rectangle from "./Rectangle";
import type { Channel, Epoch } from "src/series/store/types";

import { withProps } from "recompose";

type Props = {
  interval: [number, number],
  seriesRange: [number, number],
  channels: Channel[],
  hidden: number[],
  epochs: Epoch[]
};

const SeriesRenderer = ({
  interval,
  seriesRange,
  channels,
  hidden,
  epochs
}: Props) => {
  const topLeft = vec2.fromValues(
    DEFUALT_VIEW_BOUNDS.x[0],
    DEFUALT_VIEW_BOUNDS.y[1]
  );

  const bottomRight = vec2.fromValues(
    DEFUALT_VIEW_BOUNDS.x[1],
    DEFUALT_VIEW_BOUNDS.y[0]
  );

  const diagonal = vec2.create();
  vec2.sub(diagonal, bottomRight, topLeft);

  const center = vec2.create();
  vec2.add(center, topLeft, bottomRight);
  vec2.scale(center, center, 1 / 2);

  const scale = scaleLinear()
    .domain(interval)
    .range(DEFUALT_VIEW_BOUNDS.x);

  const XAxisLayer = ({ interval }) => {
    const start0 = topLeft;

    const end0 = vec2.create();
    vec2.add(end0, topLeft, vec2.fromValues(diagonal[0], -0.1));

    const start1 = vec2.create();
    vec2.add(start1, bottomRight, vec2.fromValues(-diagonal[0], 0.1));

    const end1 = bottomRight;

    return (
      <Object2D position={center} layer={1}>
        <Axis domain={interval} direction="top" start={start0} end={end0} />
        <Axis domain={interval} direction="bottom" start={start1} end={end1} />
      </Object2D>
    );
  };

  const InteractionLayer = () => (
    <Object2D position={center} layer={0}>
      <Rectangle start={topLeft} end={bottomRight} opacity={0} />
    </Object2D>
  );

  const ChannelsLayer = () => {
    const filtered = channels.filter((_, i) => !hidden.includes(i));
    return (
      <Object2D position={center} layer={2}>
        {filtered.map((channel, i) => {
          const subTopLeft = vec2.create();
          vec2.add(
            subTopLeft,
            topLeft,
            vec2.fromValues(0, (i * diagonal[1]) / channels.length)
          );

          const subBottomright = vec2.create();
          vec2.add(
            subBottomright,
            topLeft,
            vec2.fromValues(
              diagonal[0],
              ((i + 1) * diagonal[1]) / channels.length
            )
          );

          const subDiagonal = vec2.create();
          vec2.sub(subDiagonal, subBottomright, subTopLeft);

          const axisEnd = vec2.create();
          vec2.add(axisEnd, subTopLeft, vec2.fromValues(0.04, subDiagonal[1]));

          return (
            <Object2D key={`${i}-${channels.length}`} position={center}>
              <Axis
                ticks={5}
                domain={seriesRange}
                direction="left"
                start={subTopLeft}
                end={axisEnd}
              />
            </Object2D>
          );
        })}
      </Object2D>
    );
  };
  return channels.length > 0 ? (
    <ResponsiveViewer transparent activeCamera="maincamera">
      <DefaultOrthoCamera name="maincamera" />
      <XAxisLayer interval={interval} />
      <ChannelsLayer />
      <InteractionLayer />
    </ResponsiveViewer>
  ) : (
    <div style={{ width: "100%", height: "100%" }}>
      <h4>Nothing To Display</h4>
    </div>
  );
};

SeriesRenderer.defaultProps = {
  interval: [0.25, 0.75],
  seriesRange: [0, 1],
  channels: [],
  hidden: [],
  epochs: []
};

const makeChunk = (interval, len) => ({
  values: Array(len).fill(Math.random()),
  interval
});

const makeTrace = () => ({
  chunks: [makeChunk([0.25, 0.5], 1000), makeChunk([0.5, 0.75], 1000)],
  type: "line"
});

const makeChannel = name => ({
  name: `${name}`,
  traces: [makeTrace(), makeTrace()]
});

export default withProps({
  channels: [makeChannel(1), makeChannel(2), makeChannel(3)]
})(SeriesRenderer);
