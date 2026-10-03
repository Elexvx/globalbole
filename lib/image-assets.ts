import manifest from "@/content/generated/image-manifest.json";

type ImageVariant = "card" | "feature" | "thumbnail" | "article";
type ImageAsset = {width:number; height:number; variants:{src:string; width:number}[]};
const assets = manifest as Record<string, ImageAsset>;

export function imageDimensions(image: string) {
  const asset = assets[image];
  return asset ? {width:asset.width, height:asset.height} : {};
}

export function responsiveImageProps(image: string, variant: ImageVariant = "card") {
  const asset = assets[image];
  if (!asset) return {src:image};
  const preferredWidth = variant === "thumbnail" ? 320 : variant === "card" ? 480 : 960;
  const selected = asset.variants.find(item=>item.width >= preferredWidth) || asset.variants.at(-1)!;
  return {
    src: selected.src,
    srcSet: asset.variants.map(item=>`${item.src} ${item.width}w`).join(", "),
    width: asset.width,
    height: asset.height,
    "data-source-image": image,
    sizes: variant === "thumbnail" ? "(max-width: 639px) 84px, 112px" :
      variant === "article" ? "(max-width: 1023px) calc(100vw - 40px), 1024px" :
      variant === "feature" ? "(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 58vw, 760px" :
      "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 360px",
  };
}
