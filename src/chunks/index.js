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
          const parsed = FloatChunk.deserializeBinary(reader.result);
          resolve({
            index: parsed.getIndex(),
            cutoff: parsed.getCutoff(),
            downsampling: parsed.getDownsampling(),
            values: parsed.getSamplesList()
          });
        });
      });
    });
};
