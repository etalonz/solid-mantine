import { Accessor, createEffect, on, onCleanup } from "solid-js";
import { autoUpdate } from "@floating-ui/dom";
import { UseFloatingReturn } from "floating-ui/types";

interface Payload {
  opened: Accessor<boolean>;
  floating: UseFloatingReturn;
  positionDependencies: any[];
}

export function useFloatingAutoUpdate({
  opened,
  floating,
  positionDependencies,
}: Payload) {
  let cleanup: any;

  onCleanup(() => {
    if (cleanup) cleanup();
  });

  createEffect(
    on(
      opened,
      () => {
        if (floating.refs.reference() && floating.refs.floating()) {
          cleanup = autoUpdate(
            floating.refs.reference(),
            floating.refs.floating(),
            floating.update
          );
        } else {
          cleanup = undefined;
        }
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      () => positionDependencies,
      () => {
        floating.update();
      },
      { defer: true }
    )
  );
}
