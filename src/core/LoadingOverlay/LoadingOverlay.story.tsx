import { createSignal } from "solid-js";
import { MantineProvider, DEFAULT_THEME } from "styles";
import { Button } from "../Button/Button";
import { Group } from "../Group/Group";
import { LoadingOverlay } from "./LoadingOverlay";

function LoadingOverlayDemo(props?: any) {
  const [visible, setVisible] = createSignal(true);

  return (
    <div style={{ width: "400px", padding: "20px" }}>
      <div style={{ width: "400px", position: "relative" }}>
        <LoadingOverlay visible={visible} {...props} />
        <div style={{ height: "400px" }}>content</div>
      </div>

      <Group position="center" style={{ "margin-top": "30px" }}>
        <Button onClick={() => setVisible((v) => !v)}>Toggle overlay</Button>
      </Group>
    </div>
  );
}

const customLoader = (
  <svg
    width="54"
    height="54"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={DEFAULT_THEME.colors.blue[6]}
  >
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="2">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

export default { title: "LoadingOverlay" };

export const GeneralUsage = () => <LoadingOverlayDemo />;
export const CustomLoaderProps = () => (
  <MantineProvider theme={{ loader: "bars" }}>
    <LoadingOverlayDemo loaderProps={{ size: "lg", color: "grape" }} />
  </MantineProvider>
);
export const CustomOverlayProps = () => (
  <LoadingOverlayDemo overlayOpacity={0.6} overlayColor="red" />
);
export const CustomLoader = () => <LoadingOverlayDemo loader={customLoader} />;
