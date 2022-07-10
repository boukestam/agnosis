export function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function hsvToRgb(h: number, s: number, v: number) {
  h *= 360;
  const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

export function swapColors(image: HTMLImageElement) {
  const editCanvas = document.createElement('canvas');
  editCanvas.width = image.width;
  editCanvas.height = image.height;

  const editCtx = editCanvas.getContext('2d') as CanvasRenderingContext2D;
  editCtx.drawImage(image, 0, 0);

  const owlDark = [143, 64, 0];
  const owl = [183, 123, 58];
  const owlLight = [216, 193, 180];
  const owlFeet = [255, 179, 1];
  const colors = [owlDark, owl, owlLight, owlFeet];

  const hue = Math.random();
  const randomBrightness = Math.random() * 0.95;
  const brightness = 1 - Math.pow(randomBrightness, 3);
  const saturation = 1 - Math.random() * 0.2;
  let replaceColors = [
    hsvToRgb(hue, saturation, brightness - 0.3),
    hsvToRgb(hue, saturation - 0.3, brightness - 0.15),
    hsvToRgb(hue, saturation - 0.8, brightness),
    hsvToRgb(Math.random() * (40 / 360), 1, 1),
  ];
  if (Math.random() > 0.75)
    replaceColors = [...replaceColors.slice(0, 3).reverse(), replaceColors[3]];

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

  return editCanvas.toDataURL();
}
