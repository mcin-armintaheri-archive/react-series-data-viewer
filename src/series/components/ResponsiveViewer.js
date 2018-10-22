// @flow

import React from "react";
import type { Node } from "react";
import { Renderer, Scene } from "react-three";

type Props = {
  width: number,
  height: number,
  activeCamera: string,
  children?: Node
};

const ResponsiveViewer = ({ width, height, activeCamera, children }: Props) => {
  const provisioned = React.Children.map(children, child =>
    React.cloneElement(child, { viewerWidth: width, viewerHeight: height })
  );
  return (
    <Renderer width={width} height={height}>
      <Scene width={width} height={height} camera={activeCamera}>
        {provisioned}
      </Scene>
    </Renderer>
  );
};

ResponsiveViewer.defaultProps = {
  width: 400,
  height: 300
};

export default ResponsiveViewer;
