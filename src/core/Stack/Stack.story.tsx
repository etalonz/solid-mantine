import { Stack } from "./Stack";

function Item() {
  return <div style={{ "background-color": "silver" }}>child</div>;
}

export default { title: "Stack" };

export const Usage = () => (
  <div style={{ padding: "40px" }}>
    <Stack align="flex-start" sx={{ height: 400, backgroundColor: "#eee" }}>
      <Item />
      <Item />
      <Item />
    </Stack>
  </div>
);
