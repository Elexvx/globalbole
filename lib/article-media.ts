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
  // Comments and inline code can span lines. Exclude them across the whole
  // body, rather than treating each line as independently rendered Markdown.
  const withoutComments = markdown.replace(/<!--[\s\S]*?(?:-->|$)/g, " ");
  const withoutBlocks = withoutComments.split("\n").map(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = "";
      return "";
    }
    if (fence || /^(?: {4}|\t)/.test(line)) return "";
    return line;
  }).join("\n");
  // A closing code delimiter must contain exactly as many backticks as its
  // opener; shorter runs may legitimately appear inside the code span.
  const withoutCode = withoutBlocks.replace(/(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g, " ");
  return matchingImage.test(withoutCode);
}
