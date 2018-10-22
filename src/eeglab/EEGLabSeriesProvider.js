// @flow

import * as R from "ramda";
import React, { Component } from "react";
import type { Node } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";
import logger from "redux-logger";

type Props = {
  // channelsTableURL: string,
  // electrodesTableURL: string,
  baseChunksURL: string,
  children?: Node
};

export default class extends Component<Props> {
  store: any;
  constructor(props: Props) {
    super(props);
    this.store = createStore(state => state);
  }
  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}
