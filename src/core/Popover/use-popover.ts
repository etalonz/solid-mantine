import { useUncontrolled } from "hooks";
import {
  shift,
  flip,
  arrow,
  offset,
  size,
  Middleware,
  inline,
} from "@floating-ui/dom";
import { FloatingPosition, useFloatingAutoUpdate } from "../Floating";
import { PopoverWidth, PopoverMiddlewares } from "./Popover.types";
import { createEffect, on, Accessor } from "solid-js";
import { useFloating } from "floating-ui";

interface UsePopoverOptions {
  offset: number;
  position: FloatingPosition;
  positionDependencies: any[];
  onPositionChange?(position: FloatingPosition): void;
  opened: Accessor<boolean>;
  defaultOpened: boolean;
  onChange(opened: boolean): void;
  onClose?(): void;
  onOpen?(): void;
  width: PopoverWidth;
  middlewares: PopoverMiddlewares;
  arrowRef: Accessor<HTMLDivElement>;
  withArrow?: boolean;
}

function getPopoverMiddlewares(options: UsePopoverOptions) {
  const middlewares: Middleware[] = [offset(options.offset)];

  if (options.middlewares.shift) {
    middlewares.push(shift());
  }

  if (options.middlewares.flip) {
    middlewares.push(flip());
  }

  if (options.middlewares.inline) {
    middlewares.push(inline());
  }

  if (options.withArrow) {
    middlewares.push(
      arrow({
        get element() {
          return options.arrowRef();
        },
      })
    );
  }

  return middlewares;
}

export function usePopover(options: UsePopoverOptions) {
  const [_opened, setOpened] = useUncontrolled({
    value: options.opened,
    defaultValue: options.defaultOpened,
    finalValue: false,
    onChange: options.onChange,
  });

  const onClose = () => {
    options.onClose?.();
    setOpened(false);
  };

  const onToggle = () => {
    console.log("ontoggle", _opened());
    if (_opened()) {
      options.onClose?.();
      setOpened(false);
    } else {
      options.onOpen?.();
      setOpened(true);
    }
  };

  const floating = useFloating({
    placement: () => options.position,
    middleware: () => [
      ...getPopoverMiddlewares(options),
      ...(options.width === "target"
        ? [
            size({
              apply({ rects }) {
                Object.assign(floating.refs.floating()?.style ?? {}, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
  });

  useFloatingAutoUpdate({
    opened: options.opened,
    positionDependencies: options.positionDependencies,
    floating,
  });

  createEffect(
    on(
      floating.placement,
      (p) => {
        options.onPositionChange?.(p);
      },
      { defer: true }
    )
  );

  return {
    floating,
    controlled: typeof options.opened() === "boolean",
    opened: _opened,
    onClose,
    onToggle,
  };
}
