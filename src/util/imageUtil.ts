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
