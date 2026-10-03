import manifest from "@/content/generated/image-manifest.json";

type ImageVariant = "card" | "feature" | "thumbnail" | "article" | "body";
type Derivative = {src:string; width:number};
type ImageAsset = {width:number; height:number; variants:Derivative[]; avifVariants?:Derivative[]; bodyVariants?:Derivative[]};
const assets = manifest as Record<string, ImageAsset>;

export function imageDimensions(image: string) {
  const asset = assets[image];
  return asset ? {width:asset.width, height:asset.height} : {};
}

function imageSizes(variant: ImageVariant) {
  // Match the article's responsive padding, 64rem container, and 15rem sidebar
  // plus 3rem grid gap. Rem units also follow the site's fluid desktop scale.
  if (variant === "body") return "(max-width: 1023px) calc(100vw - 2.5rem), min(46rem, calc(100vw - 22rem))";
  if (variant === "article") return "(max-width: 1023px) calc(100vw - 2.5rem), min(64rem, calc(100vw - 4rem))";
  if (variant === "thumbnail") return "(max-width: 639px) 84px, 112px";
  if (variant === "feature") return "(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 58vw, 760px";
  return "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 360px";
}

function srcSet(variants: Derivative[]) {
  return variants.map(item=>`${item.src} ${item.width}w`).join(", ");
}

export function responsiveAvifSourceProps(image: string, variant: ImageVariant = "card") {
  const variants = assets[image]?.avifVariants;
  return variants?.length ? {type:"image/avif", srcSet:srcSet(variants), sizes:imageSizes(variant)} : undefined;
}

export function responsiveImageProps(image: string, variant: ImageVariant = "card") {
  const asset = assets[image];
  if (!asset) return {src:image};
  const variants = variant === "body" && asset.bodyVariants ? asset.bodyVariants : asset.variants;
  const preferredWidth = variant === "thumbnail" ? 320 : variant === "card" ? 480 : 960;
  const selected = variants.find(item=>item.width >= preferredWidth) || variants.at(-1)!;
  return {
    // Keep the licensed original as the fallback for non-responsive Markdown clients.
    src: variant === "body" ? image : selected.src,
    srcSet: srcSet(variants),
    width: asset.width,
    height: asset.height,
    "data-source-image": image,
    sizes: imageSizes(variant),
  };
}
