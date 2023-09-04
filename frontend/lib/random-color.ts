export function getRandomRgbaColor(opacity: number) {
  let r = Math.floor(Math.random() * 256); // Random between 0-255
  let g = Math.floor(Math.random() * 256); // Random between 0-255
  let b = Math.floor(Math.random() * 256); // Random between 0-255
  return "rgb(" + r + "," + g + "," + b + "," + opacity + ")";
}

export function changeOpacityFromRgba(rgba: string, opacity: number) {
  let newRgba = rgba.replace(/[^,]+(?=\))/, opacity.toString());
  return newRgba;
}
