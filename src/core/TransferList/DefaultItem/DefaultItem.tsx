import { Checkbox } from "../../Checkbox";
import type {
  TransferListItemComponent,
  TransferListItemComponentProps,
} from "../types";

export const DefaultItem: TransferListItemComponent = ({
  data,
  selected,
  radius,
}: TransferListItemComponentProps) => (
  <Checkbox
    checked={selected}
    onChange={() => {}}
    label={data.label}
    tabIndex={-1}
    radius={radius}
    sx={{ pointerEvents: "none" }}
  />
);
