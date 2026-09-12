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

  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/${trimmed}`;
  }

  return `/${trimmed}`;
}
