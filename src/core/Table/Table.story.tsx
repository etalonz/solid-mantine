import { MantineProvider } from "styles";
import { Table } from "./Table";

export default { title: "Table" };

const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

const rows = elements.map((element) => () => (
  <tr>
    <td>{element.position}</td>
    <td>{element.name}</td>
    <td>{element.symbol}</td>
    <td>{element.mass}</td>
  </tr>
));

export function Usage() {
  return (
    <MantineProvider
      inherit
      theme={{ spacing: { xs: 0, sm: 2, md: 4, lg: 8, xl: 12 } }}
    >
      <div style={{ padding: "40px" }}>
        <Table
          verticalSpacing="xl"
          horizontalSpacing="xs"
          fontSize="xl"
          striped
        >
          <thead>
            <tr>
              <th>Element position</th>
              <th>Element name</th>
              <th>Symbol</th>
              <th>Atomic mass</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </MantineProvider>
  );
}

export function WithBorder() {
  return (
    <div style={{ padding: "40px" }}>
      <Table withBorder>
        <thead>
          <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}

export function withColumnBorders() {
  return (
    <div style={{ padding: "40px" }}>
      <Table withColumnBorders>
        <thead>
          <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
