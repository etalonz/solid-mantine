import { Textarea } from "./Textarea";

export default { title: "Textarea" };

export function Asterisk() {
  return (
    <div style={{ width: "300px", padding: "20px" }}>
      <Textarea label="With required asterisk" withAsterisk />
      <Textarea label="Just required" required />
      <Textarea label="Required asterisk off" required withAsterisk={false} />
      <Textarea
        label="Required false asterisk on"
        required={false}
        withAsterisk
      />
    </div>
  );
}
