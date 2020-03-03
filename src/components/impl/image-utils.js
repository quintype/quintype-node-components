export const USED_PARAMS = ["imageCDN", "defaultWidth", "widths", "imgParams", "slug", "metadata", "aspectRatio", "reactTag", "eager", "imageCDNFormat"];

// Add the following CSS somewhere: img.qt-image { width: 100%; object-fit: cover; }
export function hashString(string) {
  if (!string)
    return 0;

  var hash = 0, i;
  for (i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
