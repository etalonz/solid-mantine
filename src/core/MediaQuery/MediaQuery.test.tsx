import { Box } from "../Box";
import { itSupportsClassName } from "testing";
import { MediaQuery } from "./MediaQuery";

describe("@mantine/core/MediaQuery", () => {
  itSupportsClassName(
    (p) => (
      <MediaQuery styles={{ fontWeight: 700 }} {...p}>
        <Box component="span">test-children</Box>
      </MediaQuery>
    ),
    {}
  );

  it("has correct displayName", () => {
    expect(MediaQuery.displayName).toStrictEqual("@mantine/core/MediaQuery");
  });
});
