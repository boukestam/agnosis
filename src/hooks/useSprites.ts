import { useEffect, useState } from 'react';

export function useSprites() {
  const [sprites, setSprites] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const spritesImage = new Image(160, 160);
    spritesImage.onload = () => {
      setSprites(spritesImage);
    };
    spritesImage.src = process.env.PUBLIC_URL + '/spritesheet.png';
  }, []);

  return sprites;
}
