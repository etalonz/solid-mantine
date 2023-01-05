import { Box } from "./Box";

export default { title: "Box" };

export function SystemProps() {
  return (
    <div style={{ padding: "40px" }}>
      <Box
        bg={{
          base: "red",
          xs: "pink.5",
          sm: "#e5e5e5",
        }}
        pl={{ base: 30, md: 100, xs: 300 }}
        pt="xl"
        w={"400px"}
        h={"560px"}
      >
        Some box
      </Box>
    </div>
  );
}
