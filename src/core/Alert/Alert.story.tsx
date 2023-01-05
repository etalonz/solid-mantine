import { Alert } from "./Alert";

export default { title: "Alert" };

export function Variants() {
  return (
    <div style={{ "max-width": "500px", margin: "auto", padding: "40px" }}>
      <Alert title="Bummer!" color="red" variant="light" withCloseButton>
        Something terrible happened! You made a mistake and there is no going
        back, your data was lost forever!
      </Alert>
      <Alert
        withCloseButton
        title="Bummer!"
        color="red"
        variant="filled"
        mt="xl"
      >
        Something terrible happened! You made a mistake and there is no going
        back, your data was lost forever!
      </Alert>
      <Alert
        withCloseButton
        title="Something terrible happened! You made a mistake and there is no going back, your data was lost forever!"
        color="red"
        variant="outline"
        mt="xl"
      >
        Something terrible happened! You made a mistake and there is no going
        back, your data was lost forever!
      </Alert>
    </div>
  );
}
