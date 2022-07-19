import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';
import { BigNumber, ethers } from 'ethers';

import { getAgnosisContract } from '../blockchain/contracts';
import Button from '../components/button';
import { useAccount, useProvider } from '../connectors';
import { Level, levels } from '../levels/levels';

function hashLevel(level: Level) {
  const inputs = [
    0,
    0,
    level.player,
    ...level.walls,
    ...level.blocks,
    ...level.targets,
    level.width,
    level.height,
  ].map(i => '0x' + (((i % 0x100000000) + 0x100000000) % 0x100000000).toString(16));
  const packed = ethers.utils.solidityPack(['uint256[]'], [inputs]);
  const hash = ethers.utils.keccak256(packed);
  return hash;
}

function LevelSelect() {
  const provider = useProvider();
  const account = useAccount();
  const navigate = useNavigate();

  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    if (!provider || !account) return;

    const contract = getAgnosisContract(provider);
    contract.getScores(account, levels.map(hashLevel)).then((scores: BigNumber[]) => {
      setScores(scores.map(score => score.toNumber()));
    });
  }, [provider, account]);

  return (
    <div className="max-w-lg">
      <div className="frame">
        <div className="p-4 bg-ui-frame">
          <div className="mb-8 text-2xl text-center text-white border-text">Level select</div>
          <div className="flex flex-wrap justify-center">
            {levels.map((level, levelIndex) => (
              <Button
                key={levelIndex}
                className={clsx(
                  'm-1 brightness-200 text-2xl',
                  scores[levelIndex] && '-hue-rotate-90',
                )}
                onClick={() => {
                  navigate('/app/' + (levelIndex + 1).toString());
                }}
              >
                <div className="flex items-center justify-center w-8 h-12">{levelIndex + 1}</div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelSelect;
