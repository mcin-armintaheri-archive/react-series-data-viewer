// @flow

export type Chunk = {
  values: number[],
  interval: [number, number]
};

export type Trace = {
  chunks: Chunk[],
  type: "line"
};

export type Channel = {
  name: string,
  traces: Trace[]
};

export type Epoch = {
  type: string,
  domain: [number, number],
  channels: number[] | "all"
};
