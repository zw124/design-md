import { Composition } from "remotion";
import { WebsiteShowcase } from "./website-showcase";

export function RemotionRoot() {
  return (
    <Composition
      id="WebsiteShowcase"
      component={WebsiteShowcase}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
