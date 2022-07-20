import React from 'react';

import { Owl } from '../components/owl';
import { useSprites } from '../hooks/useSprites';

export function Owls() {
  const sprites = useSprites();

  return (
    <>
      <div className="flex items-center p-24 bg-sky-light">
        <img src="/cloud.png" className="w-40 mr-16" />
        <div className="text-6xl text-white border-text pixel">Agnosis</div>
        <img src="/cloud.png" className="w-40 ml-16" />
      </div>

      <div className="flex flex-wrap bg-sky-light">
        {sprites &&
          new Array(200).fill(0).map((_, i) => (
            <div key={i} title={i.toString()}>
              <Owl sprites={sprites} seed={i} className="w-64" />
            </div>
          ))}
      </div>
    </>
  );
}
