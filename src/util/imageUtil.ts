import IDimension from "./IDimension";

export function getImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = event => reject(event);
    image.src = path;
  });
}

export function scaleHigherDimension(image: HTMLImageElement, newDimension: IDimension) {
  const higherKey: keyof IDimension = image.height > image.width ? 'height' : 'width';
  const lowerKey: keyof IDimension = image.height > image.width ? 'width' : 'height';
  const proportion = image[lowerKey] / image[higherKey];
  const newLower = newDimension[higherKey] * proportion;
  image[higherKey] = newDimension[higherKey];
  image[lowerKey] = newLower;
}
