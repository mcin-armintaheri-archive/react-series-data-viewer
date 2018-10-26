// @flow

import { mat2, vec2 } from "gl-matrix";
import React from "react";
import { Mesh } from "react-three";
import { scaleLinear } from "d3-scale";
import * as THREE from "three";
import type { Vector2 } from "src/vector";
import Object2D from "./Object2D";
import Line from "./Line";
// $FlowFixMe
import fontData from "src/fonts/helvetiker_regular.typeface.json";

const makeScale = (domain, b0) =>
  scaleLinear()
    .domain(domain)
    .range([0, vec2.length(b0)]);

const makeConnection = (domain, o0, o1, x0, x1, y0, y1) => {
  const origin = vec2.fromValues(o0, o1);
  const b0 = vec2.create();
  vec2.sub(b0, vec2.fromValues(x0, x1), origin);
  const b1 = vec2.create();
  vec2.sub(b1, vec2.fromValues(y0, y1), origin);
  const scale = makeScale(domain, b0);
  const dimensions = vec2.fromValues(vec2.length(b0), vec2.length(b1));
  vec2.normalize(b0, b0);
  vec2.normalize(b1, b1);
  return {
    origin,
    scale,
    dimensions,
    basis: mat2.fromValues(b0[0], b0[1], b1[0], b1[1])
  };
};

const affineConnection = (direction, domain, start, end) => {
  switch (direction) {
    case "bottom": {
      return makeConnection(
        domain,
        start[0],
        end[1],
        end[0],
        end[1],
        start[0],
        start[1]
      );
    }
    case "left": {
      return makeConnection(
        domain,
        start[0],
        end[1],
        start[0],
        start[1],
        end[0],
        end[1]
      );
    }
    case "top": {
      return makeConnection(
        domain,
        start[0],
        start[1],
        end[0],
        start[1],
        start[0],
        end[1]
      );
    }
    case "right": {
      return makeConnection(
        domain,
        end[0],
        end[1],
        end[0],
        start[1],
        start[0],
        end[1]
      );
    }
    default: {
      throw new Error(`"${direction}" is not a valid axis direction`);
    }
  }
};

const textMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color("#000"),
  side: THREE.DoubleSide
});

const font = new THREE.FontLoader().parse(fontData);

type Props = {
  direction: "bottom" | "right" | "top" | "left",
  domain: [number, number],
  ticks: number,
  padding: number,
  format: number => string,
  start: Vector2,
  end: Vector2
};

const Axis = ({
  direction,
  domain,
  ticks,
  padding,
  format,
  start,
  end
}: Props) => {
  const { origin, scale, dimensions, basis } = affineConnection(
    direction,
    domain,
    start,
    end
  );

  const left = vec2.fromValues(1, 0);
  vec2.transformMat2(left, left, basis);
  const up = vec2.fromValues(0, 1);
  vec2.transformMat2(up, up, basis);

  const Tick = ({ text = null, size, p0, normal }) => {
    const p1 = vec2.create();
    vec2.scale(p1, normal, size / 2);
    vec2.add(p1, p0, p1);
    const p2 = vec2.create();
    vec2.scale(p2, normal, size / 2);
    vec2.add(p2, p0, p2);
    // TODO: Fix text rendering performance issues
    const textGeometry =
      false &&
      new THREE.TextGeometry("a", {
        size: size * 0.45,
        font,
        height: 1
      });
    return (
      <Object2D>
        {false && (
          <Mesh position={p2} geometry={textGeometry} material={textMaterial} />
        )}
        <Line points={[p0, p1]} />
      </Object2D>
    );
  };
  const AxisLine = ({ origin, basis, tangent }) => {
    const end = vec2.clone(left);
    vec2.scale(end, end, dimensions[0]);
    vec2.add(end, end, origin);
    return <Line points={[origin, end]} />;
  };
  let scaleTicks = scale.ticks(ticks).slice(padding, ticks - padding + 1);
  return (
    <Object2D>
      <AxisLine origin={origin} basis={basis} tangent={left} />
      {scaleTicks.map((tick, i) => {
        const step = vec2.create();
        vec2.scale(step, left, scale(tick));

        const p0 = vec2.create();
        vec2.add(p0, origin, step);

        return (
          <Tick
            key={`${i}-${ticks}`}
            text={format(tick)}
            size={dimensions[1]}
            p0={p0}
            normal={up}
          />
        );
      })}
    </Object2D>
  );
};

Axis.defaultProps = {
  direction: "bottom",
  domain: [0, 1],
  ticks: 10,
  padding: 1,
  format: tick => `${tick}`
};

export default Axis;
