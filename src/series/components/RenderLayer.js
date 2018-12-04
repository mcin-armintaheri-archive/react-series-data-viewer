// @flow

import React from "react";
import type { Node } from "react";
import Object2D from "./Object2D";

export type Props = {
  svg?: boolean,
  three?: boolean,
  children?: Node
};

const RenderLayer = ({ children }: Props) => {
  return children;
};

RenderLayer.defaultProps = {};

export default RenderLayer;
