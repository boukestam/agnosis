export function hsvToRgb(h: number, s: number, v: number) {
  h *= 360;
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache: { [key: string]: HTMLCanvasElement } = {};

export function swapColors(image: HTMLImageElement, seed: number, clipX: number, clipY: number) {
  const key = seed + ',' + clipX + ',' + clipY;
  if (key in cache) return cache[key];

  const random = mulberry32(seed);

  const editCanvas = document.createElement('canvas');
  editCanvas.width = 24;
  editCanvas.height = 25;

  const editCtx = editCanvas.getContext('2d') as CanvasRenderingContext2D;
  editCtx.drawImage(image, clipX, clipY, 16, 16, 4, 5, 16, 16);

  if (random() < 0.2) {
    editCtx.drawImage(image, Math.floor(random() * 3) * 24, 0, 24, 16, 0, -2, 24, 16);
  }

  if (random() < 0.2) {
    editCtx.drawImage(image, Math.floor(random() * 2) * 16, 16, 16, 16, 4, 5, 16, 16);
  }

  if (random() < 0.9) {
    const owlDark = [143, 64, 0];
    const owl = [183, 123, 58];
    const owlLight = [216, 193, 180];
    const owlFeet = [255, 179, 1];
    const colors = [owlDark, owl, owlLight, owlFeet];

    const hue = random();
    const randomBrightness = random() * 0.95;
    const brightness = 1 - Math.pow(randomBrightness, 7);
    const saturation = 1 - random() * 0.2;
    let replaceColors = [
      hsvToRgb(hue, saturation, brightness - 0.3),
      hsvToRgb(hue, saturation - 0.3, brightness - 0.15),
      hsvToRgb(hue, saturation - 0.8, brightness),
      hsvToRgb(random() * (60 / 360), 1, 1),
    ];
    if (random() < 0.1) replaceColors = [...replaceColors.slice(0, 3).reverse(), replaceColors[3]];

    const imageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
    const newImageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
    for (let c = 0; c < colors.length; c++) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (
          imageData.data[i] === colors[c][0] &&
          imageData.data[i + 1] === colors[c][1] &&
          imageData.data[i + 2] === colors[c][2]
        ) {
          newImageData.data[i] = replaceColors[c][0];
          newImageData.data[i + 1] = replaceColors[c][1];
          newImageData.data[i + 2] = replaceColors[c][2];
        }
      }
    }

    editCtx.putImageData(newImageData, 0, 0);
  }

  cache[key] = editCanvas;

  return editCanvas;
}
