import { ComponentProps, createSignal } from "solid-js";
import { MANTINE_SIZES } from "styles";
import { NumberInput } from "./NumberInput";

const sizes = MANTINE_SIZES.map((size) => (
  <NumberInput defaultValue={0} label={size} size={size} mt="xl" />
));

function Controlled_(
  props: Omit<ComponentProps<typeof NumberInput>, "value" | "onChange">
) {
  const [value, setValue] = createSignal(0);
  return (
    <NumberInput value={value()} onChange={(val) => setValue(val)} {...props} />
  );
}

export default { title: "NumberInput" };

export const Sizes = () => (
  <div style={{ padding: "40px", "max-width": "400px" }}>{sizes}</div>
);

export const Controlled = () => (
  <div style={{ padding: "40px", "max-width": "400px" }}>
    <Controlled_ />
  </div>
);

export const FormatterParser = () => (
  <div style={{ padding: "40px", "max-width": "400px" }}>
    <NumberInput
      label="Price"
      defaultValue={1000}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
    />
    <NumberInput
      label="Price with cents"
      defaultValue={1000.5}
      precision={2}
      formatter={(value) => `$ ${value}`}
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
    />
    <NumberInput
      label="Percentage"
      defaultValue={0.1}
      step={0.01}
      precision={2}
      formatter={(value) => `${(parseFloat(value) * 100).toFixed(0)}%`}
      parser={(value) => String(parseFloat(value.replace("%", "")) / 100)}
    />
  </div>
);

export const StepOnHold = () => (
  <>
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <NumberInput
        label="Step on hold"
        stepHoldDelay={750}
        stepHoldInterval={100}
      />
    </div>
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <NumberInput
        label="With max value"
        min={0}
        max={10}
        stepHoldDelay={500}
        stepHoldInterval={100}
      />
    </div>
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <NumberInput
        label="Step on hold with interval function"
        stepHoldDelay={750}
        stepHoldInterval={(count) => Math.max(1000 - count * count, 0)}
      />
    </div>
    <div style={{ padding: "40px", "max-width": "400px" }}>
      <NumberInput label="Don't step on hold" />
    </div>
  </>
);
