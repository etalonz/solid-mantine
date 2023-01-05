import { filterFalsyChildren } from "./filter-falsy-children";

describe("@mantine/core/utils/filter-falsy-children", () => {
  it("remove falsy children", () => {
    expect(
      filterFalsyChildren([undefined, null, false, "", <div />]).length
    ).toBe(1);
  });
});
