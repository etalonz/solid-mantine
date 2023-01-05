import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import { HoverCard } from "./HoverCard";

export default { title: "HoverCard" };

export function Usage() {
  return (
    <div style={{ padding: "40px" }}>
      <HoverCard>
        <HoverCard.Target>
          {(p) => <Button {...p}>Hover to reveal</Button>}
        </HoverCard.Target>

        <HoverCard.Dropdown>Hello</HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}

export function TargetWithTooltip() {
  return (
    <div style={{ padding: "40px" }}>
      <HoverCard>
        <Tooltip label="Tooltip first">
          <HoverCard.Target>
            {(p) => <Button {...p}>Tooltip first</Button>}
          </HoverCard.Target>
        </Tooltip>

        <HoverCard.Dropdown>Dropdown</HoverCard.Dropdown>
      </HoverCard>

      <HoverCard>
        <HoverCard.Target>
          {(p) => (
            <Tooltip {...p} label="Tooltip last">
              <Button ml="xl">Tooltip last</Button>
            </Tooltip>
          )}
        </HoverCard.Target>

        <HoverCard.Dropdown>Dropdown</HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
}
