// @flow

import React, { Component } from "react";
import { render } from "react-dom";

import {
  EEGLabSeriesProvider,
  SeriesRenderer,
  IntervalSelect
} from "../../src";
import pkg from "../../package.json";

const Demo = () => {
  return (
    <div>
      <a href={pkg.repository}>
        <img
          style={{ position: "absolute", top: 0, left: 0, border: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png"
          alt="Fork me on GitHub"
        />
      </a>
      <div style={{ marginLeft: "100px" }}>
        <h1>react-series-data-viewer Demo</h1>
        <EEGLabSeriesProvider baseChunksURL="public/sub-s01/ses-V01/eeg/sub-s01_ses-V01_task-faceFO_eeg.chunks/">
          <div>
            <div style={{ height: "50px" }}>
              <IntervalSelect />
            </div>
            <div style={{ height: "800px" }}>
              <SeriesRenderer />
            </div>
          </div>
        </EEGLabSeriesProvider>
      </div>
    </div>
  );
};

const demoElement = document.querySelector("#demo");
if (demoElement) {
  render(<Demo />, demoElement);
}
