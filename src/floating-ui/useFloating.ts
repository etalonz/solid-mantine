import {
  computePosition,
  Middleware,
  Placement,
  Strategy,
} from "@floating-ui/dom";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  on,
} from "solid-js";
import type {
  UseFloatingProps,
  UseFloatingReturn,
  UseFloatingData,
  ReferenceType,
} from "./types";
import { deepEqual } from "./utils/deepEqual";

export function useFloating<RT extends ReferenceType = ReferenceType>(
  props: {
    placement?: Accessor<Placement>;
    middleware?: Accessor<Middleware[]>;
    strategy?: Strategy;
  } = {}
): UseFloatingReturn<RT> {
  const p = mergeProps(
    { middleware: () => [], placement: () => "bottom", strategy: "absolute" },
    props
  );

  const [data, setData] = createSignal({
    // Setting these to `null` will allow the consumer to determine if
    // `computePosition()` has run yet
    x: null,
    y: null,
    strategy: p.strategy,
    placement: p.placement(),
    middlewareData: {},
  });

  const [latestMiddleware, setLatestMiddleware] = createSignal(p.middleware());

  createEffect(
    on(p.middleware, () => {
      if (!deepEqual(latestMiddleware(), p.middleware())) {
        setLatestMiddleware(p.middleware());
      }
    })
  );

  let reference: RT = null;
  let floating: HTMLElement = null;

  const update = () => {
    if (!reference || !floating) {
      return;
    }
    computePosition(reference, floating, {
      middleware: latestMiddleware(),
      placement: p.placement(),
      strategy: p.strategy,
    }).then((d) => {
      if (!deepEqual(data(), d)) {
        setData(d);
      }
    });
  };

  return {
    x: () => data().x,
    y: () => data().y,
    strategy: () => data().strategy,
    middlewareData: () => data().middlewareData,
    placement: () => data().placement,
    update,
    refs: { floating: () => floating, reference: () => reference },
    reference: (e) => {
      reference = e;
    },
    floating: (e) => {
      floating = e;
    },
  };
}
