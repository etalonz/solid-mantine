export function toPx(value: number | undefined | null): string {
  if (value === undefined || value === null || typeof value !== "number")
    return "";
  return `${value}px`;
}
