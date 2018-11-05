// @flow

import React, { Component } from "react";
import type { Node } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";
import thunk from "redux-thunk";
import fetchAjax from "src/ajax";
import { rootReducer, rootEpic } from "src/series/store";
import {
  setChannels,
  setDatasetMetadata,
  emptyChannels
} from "src/series/store/state/dataset";
import { setDomain, setInterval } from "src/series/store/state/bounds";

type Props = {
  // electrodesTableURL: string,
  // epochsTableURL: string,
  chunkDirectoryURLs: string | string[],
  limit: number,
  children?: Node
};

export default class extends Component<Props> {
  store: any;
  static defaultProps = {
    limit: 6
  };
  constructor(props: Props) {
    super(props);
    const epicMiddleware = createEpicMiddleware();

    // $FlowFixMe There is a problem with the type definitions of redux's createStore function.
    this.store = createStore(
      rootReducer,
      applyMiddleware(thunk, epicMiddleware)
    );

    epicMiddleware.run(rootEpic);

    window.EEGLabSeriesProviderStore = this.store;

    const { chunkDirectoryURLs } = props;

    const urls =
      chunkDirectoryURLs instanceof Array
        ? chunkDirectoryURLs
        : [chunkDirectoryURLs];

    const racers = urls.map(url =>
      fetchAjax(`${url}/index.json`)
        .then(res => ({ res, url }))
        // if request fails don't resolve
        .catch(error => {
          console.error(error);
          return new Promise(resolve => {});
        })
    );

    Promise.race(racers)
      .then(({ res, url }) => res.json().then(json => ({ json, url })))
      .then(({ json, url }) => {
        const { channelMetadata, shapes, timeInterval, seriesRange } = json;
        this.store.dispatch(
          setDatasetMetadata({
            chunkDirectoryURL: url,
            channelMetadata,
            shapes,
            timeInterval,
            seriesRange
          })
        );
        this.store.dispatch(setChannels(emptyChannels(this.props.limit, 1)));
        this.store.dispatch(setDomain(timeInterval));
        this.store.dispatch(setInterval(timeInterval));
      });
  }
  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}
