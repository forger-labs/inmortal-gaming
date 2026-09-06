export function getR2ImageUrl(
  imageKey: string | undefined | null,
  baseUrl?: string,
): string {
  if (!imageKey) return "";
  const trimmed = imageKey.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  const customBase =
    baseUrl ||
    (typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_R2_URL ||
        process.env?.NEXT_PUBLIC_R2_PUBLIC_URL
      : "");

  if (customBase) {
    return `${customBase.replace(/\/$/, "")}/${trimmed}`;
  }

  return `/${trimmed}`;
}
