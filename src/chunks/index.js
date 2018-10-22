// @flow
import { FloatChunk } from "../../src/protocol-buffers/chunk_pb";

export const fetchChunk = (url: string): Promise<FloatChunk> => {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      return new Promise(resolve => {
        reader.addEventListener("loadend", () => {
          resolve(FloatChunk.deserializeBinary(reader.result));
        });
      });
    });
};
