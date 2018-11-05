// @flow

export type Chunk = {
  index: number,
  values: number[],
  downsampling: number,
  interval: [number, number],
  cutoff: number
};

export type Trace = {
  chunks: Chunk[],
  type: "line"
};

export type ChannelMetadata = {
  name: string,
  seriesRange: [number, number]
};

export type Channel = {
  index: number,
  traces: Trace[]
};

export type Epoch = {
  type: string,
  domain: [number, number],
  channels: number[] | "all"
};
