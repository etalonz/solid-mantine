import {
  useFloating /* useDelayGroupContext, useDelayGroup*/,
} from "floating-ui";
import { flip, arrow, offset, shift, inline } from "@floating-ui/dom";
import { useId } from "hooks";
import { useTooltipGroupContext } from "./TooltipGroup/TooltipGroup.context";
import { FloatingPosition, useFloatingAutoUpdate } from "../Floating";
import { Accessor, createEffect, createMemo, createSignal, on } from "solid-js";

interface UseTooltip {
  position: Accessor<FloatingPosition>;
  closeDelay: number;
  openDelay: number;
  onPositionChange?(position: FloatingPosition): void;
  opened?: Accessor<boolean>;
  offset: number;
  arrowRef?: { current: HTMLDivElement };
  events: { hover: boolean; focus: boolean; touch: boolean };
  positionDependencies: any[];
  inline: boolean;
}

export function useTooltip(settings: UseTooltip) {
  const [uncontrolledOpened, setUncontrolledOpened] = createSignal(false);
  const controlled = createMemo(() => typeof settings.opened() === "boolean");
  const opened = createMemo(() =>
    controlled() ? settings.opened() : uncontrolledOpened()
  );
  const withinGroup = useTooltipGroupContext();
  const uid = useId();

  /*const { delay: groupDelay, currentId, setCurrentId } = useDelayGroupContext();

  const onChange = (_opened: boolean) => {
    setUncontrolledOpened(_opened);

    if (_opened) {
      setCurrentId(uid);
    }
  };*/

  const floating = useFloating({
    placement: settings.position,
    middleware: () => [
      offset(settings.offset),
      shift({ padding: 8 }),
      flip(),
      ...(settings.arrowRef.current
        ? [arrow({ element: settings.arrowRef.current })]
        : []),
      ...(settings.inline ? [inline()] : []),
    ],
  });

  /* const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: settings.events.hover,
      delay: withinGroup
        ? groupDelay
        : { open: settings.openDelay, close: settings.closeDelay },
      mouseOnly: !settings.events.touch,
    }),
    useFocus(context, { enabled: settings.events.focus, keyboardOnly: true }),
    useRole(context, { role: "tooltip" }),
    // cannot be used with controlled tooltip, page jumps
    useDismiss(context, { enabled: typeof settings.opened === undefined }),
    useDelayGroup(context, { id: uid }),
  ]);*/

  useFloatingAutoUpdate({
    opened,
    positionDependencies: settings.positionDependencies,
    floating,
  });

  createEffect(
    on(floating.placement, (p) => settings.onPositionChange?.(p), {
      defer: true,
    })
  );

  /* const isGroupPhase = createMemo(
    () => opened() && currentId && currentId !== uid
  );*/

  return createMemo(() => ({
    x: floating.x(),
    y: floating.y(),
    arrowX: floating.middlewareData().arrow?.x,
    arrowY: floating.middlewareData().arrow?.y,
    reference: floating.reference,
    floating: floating.floating,
    isGroupPhase: () => false,
    opened,
    placement: floating.placement(),
    setUncontrolledOpened,
  }));
}
