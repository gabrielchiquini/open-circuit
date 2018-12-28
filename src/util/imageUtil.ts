export const CIRCUIT_MESH = 'assets/circuit/mesh.svg';

export function getImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = event => reject(event);
    image.src = path;
  });
}
