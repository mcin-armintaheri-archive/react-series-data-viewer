// @flow

import React from "react";
import { scaleLinear } from "d3-scale";
import {} from "@vx/vx";

type Props = {
  direction: "bottom" | "right" | "top" | "left",
  domain: [number, number],
  range: [number, number],
  ticks: number,
  padding: number,
  format: number => string
};

const Axis = ({ direction, domain, range, ticks, padding, format }: Props) => {
  return null;
};

Axis.defaultProps = {
  direction: "bottom",
  domain: [0, 1],
  ticks: 10,
  padding: 0,
  format: tick => `${tick}`
};

export default Axis;
