const localImagePattern = /^\/reference-assets\/([^/]+)\.webp$/;

type ImageVariant = "card" | "feature";

export function responsiveImageProps(image: string, variant: ImageVariant = "card") {
  const match = image.match(localImagePattern);
  if (!match) return { src: image };

  const stem = match[1];
  const small = `/optimized-assets/${stem}-480.webp`;
  const retina = `/optimized-assets/${stem}-832.webp`;
  const medium = `/optimized-assets/${stem}-960.webp`;

  return {
    src: variant === "feature" ? medium : small,
    srcSet: `${small} 480w, ${retina} 832w, ${medium} 960w`,
    sizes: variant === "feature"
      ? "(max-width: 767px) 100vw, (max-width: 1279px) 58vw, 960px"
      : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 480px",
  };
}
