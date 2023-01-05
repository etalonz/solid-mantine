import { itSupportsSystemProps, render } from "testing";
import { Grid, GridProps } from "./Grid";
import { Col } from "./Col/Col";

const defaultProps: GridProps = {
  children: () => (
    <>
      <Grid.Col>1</Grid.Col>
      <Grid.Col>2</Grid.Col>
    </>
  ),
};

describe("@mantine/core/Grid", () => {
  itSupportsSystemProps({
    component: Grid,
    props: defaultProps,
    displayName: "@mantine/core/Grid",
    refType: HTMLDivElement,
    providerName: "Grid",
  });

  it("exposes Col as Grid.Col", () => {
    expect(Grid.Col).toBe(Col);
  });

  it("supports getting Col ref", () => {
    let ref: HTMLDivElement;
    render(() => (
      <Grid>
        <Grid.Col ref={ref} />
      </Grid>
    ));
    expect(ref instanceof HTMLDivElement).toBe(true);
  });
});
