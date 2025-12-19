export function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function isElectronRenderer() {
  if (typeof window === "undefined") return false;
  return typeof (window as unknown as { electron?: unknown }).electron !== "undefined";
}

export function assertNever(_value: never, message = "Unexpected value") {
  throw new Error(message);
}

