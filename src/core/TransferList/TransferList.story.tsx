import { createSignal } from "solid-js";
import { TransferList, TransferListData, TransferListProps } from "./index";

function Wrapper({
  count = 1000,
  ...props
}: Partial<TransferListProps> & { count?: number }) {
  const [data, setData] = createSignal<TransferListData>([
    Array.from(Array(count), (_, i) => ({
      value: i.toString(),
      label: i.toString(),
    })),
    [],
  ]);
  return <TransferList value={data()} onChange={setData} {...props} />;
}

export default { title: "TransferList" };

export const LargeDataSet = () => (
  <div style={{ padding: "40" }}>
    <Wrapper count={500} limit={100} />
  </div>
);

export const ShowTransferAllFalse = () => (
  <div style={{ padding: "40" }}>
    <Wrapper count={10} showTransferAll={false} />
  </div>
);
