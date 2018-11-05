// @flow

import { vec2 } from "gl-matrix";
import React from "react";
import { connect } from "react-redux";
import { scaleLinear } from "d3-scale";
import { DEFUALT_VIEW_BOUNDS } from "src/vector";
import ResponsiveViewer from "./ResponsiveViewer";
import DefaultOrthoCamera from "./DefaultOrthoCamera";
import Object2D from "./Object2D";
import Axis from "./Axis";
import Rectangle from "./Rectangle";
import LineChunk from "./LineChunk";
import type { ChannelMetadata, Channel, Epoch } from "src/series/store/types";

type Props = {
  domain: [number, number],
  interval: [number, number],
  seriesRange: [number, number],
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  offsetIndex: number,
  hidden: number[],
  epochs: Epoch[]
};

const SeriesRenderer = ({
  domain,
  interval,
  seriesRange,
  channels,
  channelMetadata,
  offsetIndex,
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
          if (!channelMetadata[channel.index]) {
            return null;
          }
          const subTopLeft = vec2.create();
          vec2.add(
            subTopLeft,
            topLeft,
            vec2.fromValues(0, (i * diagonal[1]) / channels.length)
          );

          const subBottomRight = vec2.create();
          vec2.add(
            subBottomRight,
            topLeft,
            vec2.fromValues(
              diagonal[0],
              ((i + 1) * diagonal[1]) / channels.length
            )
          );

          const subDiagonal = vec2.create();
          vec2.sub(subDiagonal, subBottomRight, subTopLeft);

          const axisEnd = vec2.create();
          vec2.add(axisEnd, subTopLeft, vec2.fromValues(0.1, subDiagonal[1]));

          const scales = [
            scaleLinear()
              .domain(domain)
              .range([subTopLeft[0], subBottomRight[0]]),
            scaleLinear()
              .domain(interval)
              .range([subTopLeft[0], subBottomRight[0]]),
            scaleLinear()
              .domain(channelMetadata[channel.index].seriesRange)
              .range([subTopLeft[1], subBottomRight[1]])
          ];

          return (
            <Object2D key={`${i}-${channels.length}`} position={center}>
              <Axis
                ticks={8}
                padding={2}
                domain={channelMetadata[channel.index].seriesRange}
                direction="left"
                start={subTopLeft}
                end={axisEnd}
              />
              <Object2D layer={1}>
                {channel.traces.map((trace, j) => {
                  return (
                    <Object2D key={`${j}-${channel.traces.length}`}>
                      {trace.chunks.map((chunk, k) => {
                        return (
                          <LineChunk
                            channelIndex={channel.index}
                            traceIndex={j}
                            key={`${k}-${trace.chunks.length}`}
                            chunk={chunk}
                            scales={scales}
                          />
                        );
                      })}
                    </Object2D>
                  );
                })}
              </Object2D>
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
  domain: [0, 1],
  interval: [0.25, 0.75],
  seriesRange: [-1, 2],
  channels: [],
  epochs: [],
  hidden: [],
  channelMetadata: [],
  offsetIndex: 0
};

export default connect(state => ({
  domain: state.bounds.domain,
  interval: state.bounds.interval,
  channels: state.dataset.channels,
  epochs: state.dataset.epochs,
  channelMetadata: state.dataset.channelMetadata,
  seriesRange: state.dataset.seriesRange,
  offsetIndex: state.dataset.offsetIndex
}))(SeriesRenderer);
