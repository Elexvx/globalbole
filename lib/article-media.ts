/**
 * Detect a matching inline body image without changing the article or its metadata.
 * Be conservative: plain links and code examples must never suppress a cover.
 * Published articles use inline Markdown images with absolute media paths.
 */
export function hasInlineBodyImage(markdown: string | undefined, image: string): boolean {
  if (!markdown || !image) return false;
  const escapedImage = image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matchingImage = new RegExp(String.raw`(?<!\\)!\[(?:\\.|[^\]\\])*\]\(\s*(?:<${escapedImage}>|${escapedImage})(?:\s+["'][^"']*["'])?\s*\)`);
  let fence = "";
  return markdown.split("\n").some(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = "";
      return false;
    }
    if (fence || /^(?: {4}|\t)/.test(line)) return false;
    return matchingImage.test(line.replace(/(`+)[\s\S]*?\1/g, ""));
  });
}
