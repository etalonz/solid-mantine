import { MediaQuery } from "./MediaQuery";

export default { title: "MediaQuery" };

export function Usage() {
  return (
    <div style={{ padding: "40px" }}>
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <div style={{ height: "100px", "background-color": "red" }} />
      </MediaQuery>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <div style={{ height: "100px", "background-color": "blue" }} />
      </MediaQuery>
    </div>
  );
}

export function StylesFunction() {
  return (
    <div style={{ padding: "40px" }}>
      <MediaQuery
        smallerThan="md"
        styles={(theme) => ({ backgroundColor: theme.colors.orange[5] })}
      >
        <div style={{ height: "100px" }} />
      </MediaQuery>
      <MediaQuery
        largerThan="md"
        styles={(theme) => ({ backgroundColor: theme.colors.pink[5] })}
      >
        <div style={{ height: "100px" }} />
      </MediaQuery>
    </div>
  );
}
