import userEvent from "@testing-library/user-event";
import { createEffect, createSignal, onMount, splitProps } from "solid-js";
import {
  checkAccessibility,
  itSupportsSystemProps,
  render,
  screen,
  setupMatchMediaMock,
} from "testing";
import { Step } from "./Step/Step";
import { StepCompleted } from "./StepCompleted/StepCompleted";
import { Stepper as CoreStepper, StepperProps } from "./Stepper";

const Stepper = (p) => {
  const [local, others] = splitProps(p, ["active"]);
  createEffect(() => console.log(local.active));
  return (
    <CoreStepper active={local.active} {...others}>
      <CoreStepper.Step label="0" description="0">
        test-step-content-0
      </CoreStepper.Step>

      <CoreStepper.Step label="1" description="1">
        test-step-content-1
      </CoreStepper.Step>

      <CoreStepper.Step label="2" description="2">
        test-step-content-2
      </CoreStepper.Step>

      <CoreStepper.Step label="3" description="3">
        test-step-content-3
      </CoreStepper.Step>
      <CoreStepper.Completed>test-step-completed</CoreStepper.Completed>
    </CoreStepper>
  );
};

const defaultProps: Partial<StepperProps> = { active: 1 };

describe("@mantine/core/Stepper", () => {
  setupMatchMediaMock();

  checkAccessibility([() => <Stepper {...defaultProps} />]);
  itSupportsSystemProps({
    component: Stepper,
    props: defaultProps,
    displayName: "@mantine/core/Stepper",
    refType: HTMLDivElement,
    providerName: "Stepper",
  });

  it("calls onStepClick with clicked step index", async () => {
    const spy = vi.fn();
    render(() => <Stepper {...defaultProps} onStepClick={spy} />);
    await userEvent.click(screen.getAllByRole("button")[2]);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it("renders content of active step", () => {
    render(() => {
      const [active, setActive] = createSignal(1);

      onMount(() => {
        expect(screen.getByText("test-step-content-1")).toBeInTheDocument();
        setActive(3);
        expect(screen.getByText("test-step-content-3")).toBeInTheDocument();
      });

      onMount(() => {
        setActive(4);
        expect(screen.getByText("test-step-completed")).toBeInTheDocument();
      });

      onMount(() => {
        setActive(100);
        expect(screen.getByText("test-step-completed")).toBeInTheDocument();
      });

      return <Stepper active={active()} />;
    });
  });

  it("exposes Stepper.Step and Stepper.Completed components", () => {
    expect(CoreStepper.Step).toBe(Step);
    expect(CoreStepper.Completed).toBe(StepCompleted);
  });
});
