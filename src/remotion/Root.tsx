import React from "react";
import { Composition } from "remotion";
import Globe from "./Globe";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Globe"
        component={Globe}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
