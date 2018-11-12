// @flow

import * as R from "ramda";
import { vec2 } from "gl-matrix";
import React from "react";
import { Container, Row, Col, Input, ButtonGroup, Button } from "reactstrap";
import { connect } from "react-redux";
import { scaleLinear } from "d3-scale";
import { DEFUALT_VIEW_BOUNDS, MAX_RENDERED_EPOCHS } from "src/vector";
import ResponsiveViewer from "./ResponsiveViewer";
import DefaultOrthoCamera from "./DefaultOrthoCamera";
import Object2D from "./Object2D";
import Axis from "./Axis";
import Rectangle from "./Rectangle";
import LineChunk from "./LineChunk";
import Epoch from "./Epoch";
import { setOffsetIndex } from "src/series/store/logic/pagination";
import type {
  ChannelMetadata,
  Channel,
  Epoch as EpochType
} from "src/series/store/types";

type Props = {
  domain: [number, number],
  interval: [number, number],
  seriesRange: [number, number],
  channels: Channel[],
  channelMetadata: ChannelMetadata[],
  hidden: number[],
  epochs: EpochType[],
  offsetIndex: number,
  setOffsetIndex: number => void,
  limit: number
};

const SeriesRenderer = ({
  domain,
  interval,
  seriesRange,
  channels,
  channelMetadata,
  hidden,
  epochs,
  offsetIndex,
  setOffsetIndex,
  limit
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

  const filteredChannels = channels.filter((_, i) => !hidden.includes(i));

  const InteractionLayer = () => (
    <Object2D position={center} layer={0}>
      <Rectangle start={topLeft} end={bottomRight} opacity={0} />
    </Object2D>
  );

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

  const EpochsLayer = () => {
    const filteredEpochs = epochs.filter(
      epoch =>
        epoch.onset + epoch.duration > interval[0] && epoch.onset < interval[1]
    );
    return (
      <Object2D position={center} layer={2}>
        {filteredEpochs.length < MAX_RENDERED_EPOCHS &&
          filteredEpochs.map((epoch, i) => {
            const scales = [
              scaleLinear()
                .domain(interval)
                .range([topLeft[0], bottomRight[0]]),
              scaleLinear()
                .domain(DEFUALT_VIEW_BOUNDS.y)
                .range([topLeft[1], bottomRight[1]])
            ];

            return (
              <Epoch
                key={`${i}-${epochs.length}`}
                {...epoch}
                scales={scales}
                opacity={0.3}
              />
            );
          })}
      </Object2D>
    );
  };

  const ChannelsLayer = () => {
    return (
      <Object2D position={center} layer={3}>
        {filteredChannels.map((channel, i) => {
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
          const seriesRange = channelMetadata[channel.index].seriesRange;
          return (
            <Object2D
              key={`${channel.index}-${channels.length}`}
              position={center}
            >
              <Axis
                ticks={8}
                padding={2}
                domain={seriesRange}
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
                            chunkIndex={k}
                            key={`${k}-${trace.chunks.length}`}
                            chunk={chunk}
                            seriesRange={seriesRange}
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
    <Container fluid style={{ height: "100%" }}>
      <Row style={{ height: "100%" }}>
        <Col xs={12}>
          <Row>
            <Col xs={2} />
            <Col xs={10}>
              <Row>
                <Col xs={3}>
                  <ButtonGroup>
                    <Button onClick={() => setOffsetIndex(offsetIndex - limit)}>
                      &lt;&lt;
                    </Button>
                    <Button onClick={() => setOffsetIndex(offsetIndex - 1)}>
                      &lt;
                    </Button>
                    <Button onClick={() => setOffsetIndex(offsetIndex + 1)}>
                      &gt;
                    </Button>
                    <Button onClick={() => setOffsetIndex(offsetIndex + limit)}>
                      &gt;&gt;
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col xs={9}>
                  Showing{" "}
                  <div style={{ display: "inline-block", width: "80px" }}>
                    <Input
                      type="number"
                      value={offsetIndex}
                      onChange={e => setOffsetIndex(e.target.value)}
                    />
                  </div>{" "}
                  to {offsetIndex + limit} of {channelMetadata.length}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ height: "100%" }}>
            <Col
              xs={2}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              {filteredChannels.map(channel => (
                <div
                  key={channel.index}
                  style={{ display: "flex", margin: "auto" }}
                >
                  {channelMetadata[channel.index] &&
                    channelMetadata[channel.index].name}
                </div>
              ))}
            </Col>
            <Col xs={10}>
              <ResponsiveViewer transparent activeCamera="maincamera">
                <DefaultOrthoCamera name="maincamera" />
                <InteractionLayer />
                <XAxisLayer interval={interval} />
                <EpochsLayer />
                <ChannelsLayer />
              </ResponsiveViewer>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
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
  offsetIndex: 0,
  limit: 6
};

export default connect(
  state => ({
    domain: state.bounds.domain,
    interval: state.bounds.interval,
    channels: state.dataset.channels,
    epochs: state.dataset.epochs,
    channelMetadata: state.dataset.channelMetadata,
    seriesRange: state.dataset.seriesRange,
    offsetIndex: state.dataset.offsetIndex
  }),
  (dispatch: any => void) => ({
    setOffsetIndex: R.compose(
      dispatch,
      setOffsetIndex
    )
  })
)(SeriesRenderer);
