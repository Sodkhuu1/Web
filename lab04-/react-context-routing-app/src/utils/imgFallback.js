export const FALLBACK_IMG = "https://picsum.photos/seed/place-fallback/600/400";

export function onImageError(e) {
  const img = e?.target;
  if (!img) return;
  const failedSrc = img?.currentSrc || img?.src;
  // Avoid infinite loop if fallback also fails
  if (img.dataset.fallbackApplied === "true") return;
  // Log for diagnostics in DevTools
  // Note: Many hosts block hotlinking (403) or require specific headers.
  // If you see these logs, consider changing the source domain.
  // eslint-disable-next-line no-console
  console.warn("Image failed to load, switching to fallback:", failedSrc);
  img.dataset.fallbackApplied = "true";
  img.src = FALLBACK_IMG;
}


