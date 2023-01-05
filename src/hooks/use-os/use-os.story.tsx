import { useOs } from "./use-os";

const Demo = () => {
  const os = useOs();

  return (
    <>
      Your os is <b>{os}</b>
    </>
  );
};

export default { title: "Hooks/use-os" };
export const Usage = () => (
  <div style={{ padding: "40px" }}>
    <Demo />
  </div>
);
