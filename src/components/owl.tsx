import React, { useEffect, useState } from 'react';

import { swapColors } from '../utils/color';

export function Owl({ sprites, className }: { sprites: HTMLImageElement; className?: string }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const data = swapColors(sprites, Math.floor(Math.random() * 10000), 0, 32);
    const newImage = new Image();
    newImage.src = data.toDataURL();
    setImage(newImage);
  }, [sprites]);

  return image ? <img src={image.src} className={className} /> : <div className={className}></div>;
}
