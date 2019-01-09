export function getImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = event => reject(event);
    image.src = path;
  });
}

export function scaleHeight(image: HTMLImageElement, newHeight: number) {
  const proportion = image.width / image.height;
  const newWidth = newHeight * proportion;
  image.height = newHeight;
  image.width = newWidth;
}

export function scaleWidth(image: HTMLImageElement, newWidth: number) {
  const proportion = image.height / image.width;
  const newHeight = newWidth * proportion;
  image.height = newHeight;
  image.width = newWidth;
}
