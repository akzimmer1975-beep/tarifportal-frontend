const EXPERT_STORAGE_KEY = "tarifportal_expert_mode";

export function getExpertPin(): string {
  return process.env.NEXT_PUBLIC_EXPERT_PIN || "1234";
}

export function isExpertEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(EXPERT_STORAGE_KEY) === "true";
}

export function enableExpertMode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EXPERT_STORAGE_KEY, "true");
}

export function disableExpertMode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(EXPERT_STORAGE_KEY);
}

export function validateExpertPin(pin: string): boolean {
  return pin.trim() === getExpertPin().trim();
}