import { useScrollLock } from "./use-scroll-lock";

const lorem =
  "Because and pointing threw system for read. That or spot. What stairs nor perfected lead to buttons to here. The in there I attention would left right look such may through they the seven. People, into probably must suppliers, something phase by the every there up rendering it logged although.";

export function Usage() {
  const [scrollLocked, setScrollLocked] = useScrollLock();

  const items = Array(10)
    .fill(0)
    .map((_, index) => <p>{lorem}</p>);

  return (
    <div style={{ padding: "20px" }}>
      {items}
      <button type="button" onClick={() => setScrollLocked((c) => !c)}>
        {scrollLocked ? "Unlock scroll" : "Lock scroll"}
      </button>
      {items}
    </div>
  );
}

export default { title: "Hooks/use-scroll-lock" };
