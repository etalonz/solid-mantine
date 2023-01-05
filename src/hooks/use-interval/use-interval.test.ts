import { useInterval } from "./use-interval";

const defaultTimeout = 2000;

const callback = vi.fn();

const setupTimer = (timeout: number = defaultTimeout) => ({
  timeout,
  advanceTimerToNextTick: () => vi.advanceTimersByTime(timeout),
});

describe("@mantine/hooks/use-interval", () => {
  vi.useFakeTimers();
  vi.spyOn(global, "setInterval");
  vi.spyOn(global, "clearInterval");

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it("initialize", () => {
    const { start, stop, toggle, active } = useInterval(
      callback,
      defaultTimeout
    );

    expect(typeof active()).toBe("boolean");
    expect(typeof start).toBe("function");
    expect(typeof stop).toBe("function");
    expect(typeof toggle).toBe("function");
  });

  it("callback should NOT fire before calling start function", () => {
    const { advanceTimerToNextTick } = setupTimer();
    useInterval(callback, defaultTimeout);
    advanceTimerToNextTick();
    expect(callback).not.toHaveBeenCalled();
    expect(setInterval).not.toHaveBeenCalled();
    expect(clearInterval).not.toHaveBeenCalled();
  });

  it("should run after timeout exceeded", () => {
    const { advanceTimerToNextTick } = setupTimer();
    const interval = useInterval(callback, defaultTimeout);

    advanceTimerToNextTick();
    expect(callback).not.toHaveBeenCalled();
    expect(interval.active()).toBe(false);

    interval.start();

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      defaultTimeout
    );

    expect(interval.active()).toBe(true);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(2);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should stop after stop fn call", () => {
    const { advanceTimerToNextTick } = setupTimer();

    const interval = useInterval(callback, defaultTimeout);

    advanceTimerToNextTick();
    expect(callback).not.toHaveBeenCalled();
    expect(interval.active()).toBe(false);

    interval.start();

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      defaultTimeout
    );

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(interval.active()).toBe(true);

    interval.stop();

    expect(clearInterval).toHaveBeenCalled();

    expect(interval.active()).toBe(false);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should toggle between active states", () => {
    const { advanceTimerToNextTick } = setupTimer();

    const interval = useInterval(callback, defaultTimeout);
    advanceTimerToNextTick();
    expect(callback).not.toHaveBeenCalled();
    expect(interval.active()).toBe(false);

    interval.toggle();

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      defaultTimeout
    );

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(interval.active()).toBe(true);

    interval.toggle();

    expect(clearInterval).toHaveBeenCalled();

    expect(interval.active()).toBe(false);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(1);

    interval.toggle();

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      defaultTimeout
    );

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(2);

    advanceTimerToNextTick();
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
