/* @refresh reload */
import { render } from "solid-js/web";
import { DevtoolsOverlay } from "@solid-devtools/overlay";

import App from "./App";

render(
  () => (
    <>
      <App />
      <DevtoolsOverlay />
    </>
  ),
  document.getElementById("root") as HTMLElement
);
