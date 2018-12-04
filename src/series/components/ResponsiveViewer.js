// @flow

import React from "react";
import type { Node } from "react";
import { Renderer, Scene } from "react-three";
import "resize-observer-polyfill/dist/ResizeObserver.global";
// $FlowFixMe
import withResizeObserverProps from "@hocs/with-resize-observer-props";
import Object2D from "./Object2D";

type Props = {
  onRef?: any,
  containerWidth: number,
  containerHeight: number,
  transparent: boolean,
  activeCamera?: string,
  children: Node
};

const ResponsiveViewer = ({
  onRef,
  containerWidth,
  containerHeight,
  activeCamera,
  transparent,
  children
}: Props) => {
  const width = containerWidth;
  const height = containerHeight - 4;

  const provision = layer =>
    React.Children.map(layer.props.children, child =>
      React.cloneElement(child, { viewerWidth: width, viewerHeight: height })
    );

  const layers = React.Children.toArray(children);
  const svgLayers = layers.filter(layer => layer.props.svg).map(provision);
  const threeLayers = layers.filter(layer => layer.props.three).map(provision);

  return (
    <div ref={onRef} style={{ width: "100%", height: "100%" }}>
      <Renderer
        style={{ position: "absolute" }}
        transparent
        width={width}
        height={height}
      >
        {threeLayers.length > 0 && (
          <Scene
            pointerEvents={["onMouseDown", "onMouseMove", "onMouseUp"]}
            width={width}
            height={height}
            camera={activeCamera}
          >
            {threeLayers}
          </Scene>
        )}
      </Renderer>
      <svg
        style={{ position: "absolute", pointerEvents: "none" }}
        width={width}
        height={height}
      >
        {svgLayers}
      </svg>
    </div>
  );
};

ResponsiveViewer.defaultProps = {
  containerWidth: 400,
  containerHeight: 300,
  transparent: false
};

export default withResizeObserverProps(({ width, height }) => ({
  containerWidth: width,
  containerHeight: height
}))(ResponsiveViewer);
