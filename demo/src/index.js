import React, { Component } from "react";
import { render } from "react-dom";

import Example from "../../src";
import { fetchChunk } from "../../src/chunks";

class Demo extends Component {
  constructor(props) {
    super(props);
    fetchChunk(
      `sub-s01/ses-V01/eeg/sub-s01_ses-V01_task-faceFO_eeg.chunks/raw/${0}/${0}/${0}/${0}.buf`
    ).then(chunk => console.log(chunk.getSamplesList()));
  }
  render() {
    return (
      <div>
        <h1>react-series-data-viewer Demo</h1>
        <Example />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
