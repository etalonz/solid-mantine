import { itSupportsClassName } from "./it-supports-classname";
import { itSupportsStyle } from "./it-supports-style";
import { itSupportsOthers } from "./it-supports-others";
import { itSupportsSx } from "./it-supports-sx";
import { itSupportsMargins } from "./it-supports-margins";
import { itSupportsPaddings } from "./it-supports-paddings";
import { itSupportsRef } from "./it-supports-ref";
import { itSupportsProviderDefaultProps } from "./it-supports-provider-default-props";
import { Component } from "solid-js";

interface Options<T> {
  component: Component<T>;
  props: T;
  providerName?: string;
  displayName?: string;
  othersSelector?: string;
  excludeOthers?: boolean;
  excludePadding?: boolean;
  refType?: any;
}

export function itSupportsSystemProps<T>(options: Options<T>) {
  const shouldExcludeOthers = options.excludeOthers || false;
  const shouldExcludePaddings = options.excludePadding || false;
  options.refType &&
    itSupportsRef(options.component, options.props, options.refType);
  options.providerName &&
    itSupportsProviderDefaultProps(
      options.component,
      options.props,
      options.providerName,
      options.othersSelector
    );
  !shouldExcludeOthers &&
    itSupportsOthers(options.component, options.props, options.othersSelector);
  itSupportsClassName(options.component, options.props);
  itSupportsMargins(options.component, options.props);
  !shouldExcludePaddings &&
    itSupportsPaddings(options.component, options.props);
  itSupportsStyle(options.component, options.props);
  itSupportsSx(options.component, options.props);
}
