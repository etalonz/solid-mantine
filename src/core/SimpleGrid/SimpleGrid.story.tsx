import { SimpleGrid } from "./SimpleGrid";

export default { title: "SimpleGrid" };

export const WithMaxWidth = () => (
  <>
    <div style={{ "background-color": "gray" }}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 680, cols: 1, spacing: "xs" },
          { maxWidth: 980, cols: 2 },
        ]}
      >
        <div style={{ "background-color": "red" }}>first</div>
        <div style={{ "background-color": "red" }}>second</div>
        <div style={{ "background-color": "red" }}>third</div>
      </SimpleGrid>
    </div>
  </>
);
export const WithMinWidth = () => (
  <>
    <div style={{ "background-color": "gray" }}>
      <SimpleGrid
        cols={1}
        breakpoints={[
          { minWidth: 680, cols: 2, spacing: "xs" },
          { minWidth: 980, cols: 3 },
        ]}
      >
        <div style={{ "background-color": "blue" }}>first</div>
        <div style={{ "background-color": "blue" }}>second</div>
        <div style={{ "background-color": "blue" }}>third</div>
      </SimpleGrid>
    </div>
  </>
);
