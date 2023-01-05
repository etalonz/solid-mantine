import { wait } from "testing";
import { useScrollLock } from "./use-scroll-lock";

describe("@mantine/hooks/use-scroll-lock", () => {
  // Clean up dom as jest does not do this automatically
  afterEach(() => {
    document.getElementsByTagName("html")[0].innerHTML = "";
  });

  it("locks scroll on body element", async () => {
    document.body.style.overflow = "visible";
    useScrollLock(() => true);
    await wait(1000);
    expect(document.body.style.overflow).toBe("hidden");
  }, 2000);

  it("does not change overflow if called with false", async () => {
    document.body.style.overflow = "visible";
    useScrollLock();
    await wait(1000);
    expect(document.body.style.overflow).toBe("visible");
  }, 2000);
});
