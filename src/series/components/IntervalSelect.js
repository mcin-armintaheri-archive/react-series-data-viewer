// @flow

import React from "react";
import { OrthographicCamera } from "react-three";
import ResponsiveViewer from "./ResponsiveViewer";

type Props = {
  domain: [number, number],
  interval: [number, number]
};

const IntervalSelect = ({ domain, interval }: Props) => {
  return <ResponsiveViewer activeCamera="maincamera" />;
};

export default IntervalSelect;
