// @flow

import React from "react";
import type { Node } from "react";
import { Renderer, Scene } from "react-three";
import "resize-observer-polyfill/dist/ResizeObserver.global";
// $FlowFixMe
import withResizeObserverProps from "@hocs/with-resize-observer-props";

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
  const provisioned = React.Children.map(children, child =>
    React.cloneElement(child, { viewerWidth: width, viewerHeight: height })
  );
  return (
    <div ref={onRef} style={{ width: "100%", height: "100%" }}>
      <Renderer transparent width={width} height={height}>
        <Scene width={width} height={height} camera={activeCamera}>
          {provisioned}
        </Scene>
      </Renderer>
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
