import {
  itRendersChildren,
  itSupportsSystemProps,
  setupMatchMediaMock,
} from "testing";
import { Collapse, CollapseProps } from "./Collapse";

const defaultProps: CollapseProps = {
  in: true,
  children: <div style={{ height: "300px" }} />,
};

describe("@mantine/core/Collapse", () => {
  setupMatchMediaMock();
  itRendersChildren(Collapse, defaultProps);
  itSupportsSystemProps({
    component: Collapse,
    props: defaultProps,
    refType: HTMLDivElement,
    displayName: "@mantine/core/Collapse",
    providerName: "Collapse",
  });
});
