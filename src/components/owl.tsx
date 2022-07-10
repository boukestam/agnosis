import React, { useEffect, useState } from 'react';

import { swapColors } from '../utils/color';

export function Owl({ className }: { className?: string }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const src = swapColors(img);
      const newImage = new Image();
      newImage.src = src;
      setImage(newImage);
    };
    img.src = process.env.PUBLIC_URL + '/owl.png';
  }, []);

  return image ? <img src={image.src} className={className} /> : <div className={className}></div>;
}
