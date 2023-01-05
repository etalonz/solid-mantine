import {
  checkAccessibility,
  itHandlesBooleanState,
  itSupportsSystemProps,
  itConnectsLabelAndInput,
  itSupportsWrapperProps,
  itSupportsFocusEvents,
  render,
  screen,
} from "testing";
import { IconCrown } from "solid-tabler-icons";
import { Switch, SwitchProps } from "./Switch";

const defaultProps: SwitchProps = {
  label: "test-label",
};

describe("@mantine/core/Switch", () => {
  checkAccessibility([
    () => <Switch aria-label="Switch without label" />,
    () => <Switch label="With label" />,
  ]);
  itHandlesBooleanState(Switch, defaultProps);
  itConnectsLabelAndInput(Switch, defaultProps);
  itSupportsWrapperProps(Switch, defaultProps);
  itSupportsFocusEvents(Switch, defaultProps, "input");
  itSupportsSystemProps({
    component: Switch,
    props: defaultProps,
    displayName: "@mantine/core/Switch",
    refType: HTMLInputElement,
    othersSelector: "input",
    providerName: "Switch",
  });

  it("render thumb icon", () => {
    const { container } = render(() => (
      <Switch thumbIcon={<IconCrown class="thumb-crown" />} />
    ));
    expect(container.querySelectorAll(".thumb-crown")).toHaveLength(1);
  });

  it("render onLabel and offLabel if provided", () => {
    const { container: unChecked } = render(() => (
      <Switch offLabel={<span class="offLabel">Off</span>} />
    ));
    const { container: checked } = render(() => (
      <Switch checked onLabel={<span class="onLabel">On</span>} />
    ));

    expect(checked.querySelectorAll(".onLabel")).toHaveLength(1);
    expect(unChecked.querySelectorAll(".offLabel")).toHaveLength(1);
  });

  it("sets disabled attribute on input based on disabled prop", () => {
    render(() => <Switch disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
