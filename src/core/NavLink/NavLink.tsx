import {
  ComponentWithRef,
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  Selectors,
  useComponentDefaultProps,
} from "styles";
import { createPolymorphicComponent } from "utils";
import { useUncontrolled } from "hooks";
import { UnstyledButton } from "../UnstyledButton";
import { ChevronIcon } from "../Accordion";
import { Collapse } from "../Collapse";
import { Text } from "../Text";
import useStyles, { NavLinkStylesParams } from "./NavLink.styles";
import { JSXElement, splitProps, children } from "solid-js";

export type NavLinkStylesNames = Selectors<typeof useStyles>;

export interface NavLinkProps
  extends DefaultProps<NavLinkStylesNames, NavLinkStylesParams> {
  /** Main link content */
  label?: JSXElement;

  /** Secondary link description */
  description?: JSXElement;

  /** Icon displayed on the left side of the label */
  icon?: JSXElement;

  /** Section displayed on the right side of the label */
  rightSection?: JSXElement;

  /** Determines whether link should have active styles */
  active?: boolean;

  /** Key of theme.colors, active link color */
  color?: MantineColor;

  /** Active link variant */
  variant?: "filled" | "light" | "subtle";

  /** If prop is set then label and description will not wrap on the next line */
  noWrap?: boolean;

  /** Child links */
  children?: JSXElement;

  /** Controlled nested items collapse state */
  opened?: boolean;

  /** Uncontrolled nested items collapse initial state */
  defaultOpened?: boolean;

  /** Called when open state changes */
  onChange?(opened: boolean): void;

  /** If set to true, right section will not rotate when collapse is opened */
  disableRightSectionRotation?: boolean;

  /** Key of theme.spacing or number to set collapsed links padding-left in px */
  childrenOffset?: MantineNumberSize;

  /** Adds disabled styles to root element */
  disabled?: boolean;
}

const defaultProps: Partial<NavLinkProps> = {
  variant: "light",
  childrenOffset: "lg",
};

export const _NavLink: ComponentWithRef<
  NavLinkProps & { onClick: (e: Event) => void },
  HTMLButtonElement
> = (props) => {
  const [local, others] = splitProps(
    useComponentDefaultProps("NavLink", defaultProps, props),
    [
      "label",
      "description",
      "icon",
      "rightSection",
      "className",
      "classNames",
      "styles",
      "unstyled",
      "active",
      "color",
      "variant",
      "noWrap",
      "children",
      "opened",
      "defaultOpened",
      "onChange",
      "disableRightSectionRotation",
      "childrenOffset",
      "disabled",
      "onClick",
    ]
  );

  const { classes, cx } = useStyles(
    {
      color: local.color,
      variant: local.variant,
      noWrap: local.noWrap,
      childrenOffset: local.childrenOffset,
      alignIcon: local.description ? "top" : "center",
    },
    {
      name: "NavLink",
      classNames: local.classNames,
      styles: local.styles,
      unstyled: local.unstyled,
    }
  );

  const [_opened, setOpened] = useUncontrolled({
    value: () => local.opened,
    defaultValue: local.defaultOpened,
    finalValue: false,
    onChange: local.onChange,
  });

  const resolvedChildren = children(() => local.children).toArray();

  const withChildren = resolvedChildren.length > 0;

  const handleClick = (event: Event) => {
    if (withChildren) {
      event.preventDefault();
      local.onClick?.(event);
      setOpened(!_opened());
    } else {
      local.onClick?.(event);
    }
  };

  return (
    <>
      <UnstyledButton
        className={cx(classes.root, local.className)}
        data-active={local.active || undefined}
        onClick={handleClick}
        unstyled={local.unstyled}
        data-expanded={_opened() || undefined}
        data-disabled={local.disabled || undefined}
        disabled={local.disabled}
        {...others}
      >
        {local.icon && <span class={classes.icon}>{local.icon}</span>}
        <span class={classes.body}>
          <Text component="span" size="sm" className={classes.label}>
            {local.label}
          </Text>
          <Text
            component="span"
            color="dimmed"
            size="xs"
            data-active={local.active || undefined}
            className={classes.description}
          >
            {local.description}
          </Text>
        </span>
        {(withChildren || local.rightSection) && (
          <span
            class={classes.rightSection}
            data-rotate={
              (_opened() && !local.disableRightSectionRotation) || undefined
            }
          >
            {withChildren
              ? local.rightSection || (
                  <ChevronIcon
                    width={14}
                    height={14}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                )
              : local.rightSection}
          </span>
        )}
      </UnstyledButton>
      <Collapse in={_opened()}>
        <div class={classes.children}>{resolvedChildren}</div>
      </Collapse>
    </>
  );
};

_NavLink.displayName = "@mantine/core/NavLink";

export const NavLink = createPolymorphicComponent<"button", NavLinkProps>(
  _NavLink
);
