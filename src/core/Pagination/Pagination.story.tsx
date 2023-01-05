import { createSignal } from "solid-js";
import { Pagination } from "./Pagination";

export default { title: "Pagination" };

export function Controlled() {
  const [value, setValue] = createSignal(2);
  return (
    <>
      Current page: {value()}
      <Pagination total={20} page={value()} onChange={setValue} />
    </>
  );
}
