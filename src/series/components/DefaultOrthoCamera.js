// @flow
import React from "react";
import { OrthographicCamera } from "react-three";
import * as THREE from "three";
import { DEFUALT_VIEW_BOUNDS } from "src/vector";

type Props = { name: string };

const DefaultOrthoCamera = ({ name, ...rest }: Props) => {
  const cameraProps = {
    left: DEFUALT_VIEW_BOUNDS.x[0],
    right: DEFUALT_VIEW_BOUNDS.x[1],
    bottom: DEFUALT_VIEW_BOUNDS.y[0],
    top: DEFUALT_VIEW_BOUNDS.y[1],
    near: 0.01,
    far: 10000,
    lookat: new THREE.Vector3(0, 0, -1)
  };
  return <OrthographicCamera name={name} {...cameraProps} {...rest} />;
};

DefaultOrthoCamera.defaultProps = {
  name: "maincamera"
};

export default DefaultOrthoCamera;
