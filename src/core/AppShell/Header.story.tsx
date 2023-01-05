import { Header } from "./Header/Header";

const content = Array(30)
  .fill(0)
  .map(() => (
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus officiis
      labore alias nam, voluptate aperiam non quidem consequuntur enim unde
      corrupti quaerat possimus facilis. Ipsa quos alias doloremque at veniam?
    </p>
  ));

export default { title: "AppShell/Header" };

export const HeaderBase = () => (
  <>
    <Header height={50}>Just a header</Header>
    <div>{content}</div>
  </>
);

export const HeaderFixed = () => (
  <>
    <Header height={50} fixed position={{ top: 0, left: 0, right: 0 }}>
      Just a header
    </Header>
    <div style={{ "padding-top": "50px" }}>{content}</div>
  </>
);

export const HeaderFixedWithoutBorder = () => (
  <>
    <Header height={50} withBorder={false} fixed>
      Just a header
    </Header>
    <div>{content}</div>
  </>
);
