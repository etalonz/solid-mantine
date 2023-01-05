import type {
  ComputePositionConfig,
  VirtualElement,
  Placement,
  Strategy,
  MiddlewareData,
} from "@floating-ui/dom";
import { Accessor } from "solid-js";

export type UseFloatingData = {
  x: Accessor<number | null>;
  y: Accessor<number | null>;
  placement: Accessor<Placement>;
  strategy: Accessor<Strategy>;
  middlewareData: Accessor<MiddlewareData>;
};

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> =
  UseFloatingData & {
    update: () => void;
    reference: (node: RT | null) => void;
    floating: (node: HTMLElement | null) => void;
    refs: {
      reference: Accessor<RT | null>;
      floating: Accessor<HTMLElement | null>;
    };
  };

export type UseFloatingProps<RT extends ReferenceType = ReferenceType> = Omit<
  Partial<ComputePositionConfig>,
  "platform"
> & {
  whileElementsMounted?: (
    reference: RT,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
};
