import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import clsx from 'clsx';
import { BigNumber, ContractTransaction, ethers } from 'ethers';

import { getAgnosisContract, getERC20Contract } from '../blockchain/contracts';
import { calculateProof } from '../blockchain/proof';
import Button from '../components/button';
import Header from '../components/header';
import { Owl } from '../components/owl';
import { Sokoban } from '../components/sokoban';
import { useAccount, useProvider } from '../connectors';
import { Level, levels } from '../constants/levels';
import { GameState } from '../engine/state';
import { useStore } from '../store';

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

function Game() {
  const provider = useProvider();
  const account = useAccount();

  const { notifications, removeNotification, balance, setBalance, music } = useStore();

  const [level, setLevel] = useState<Level | null>(null);
  const [levelNumber, setLevelNumber] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyingStatus, setVerifyingStatus] = useState<string>('');
  const [scores, setScores] = useState<number[]>([]);

  const [sprites, setSprites] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const spritesImage = new Image(160, 160);
    spritesImage.onload = () => {
      setSprites(spritesImage);
    };
    spritesImage.src = process.env.PUBLIC_URL + '/spritesheet.png';
  }, []);

  useEffect(() => {
    if (!provider || !account) return;

    const contract = getAgnosisContract(provider);
    contract.getScores(account, levels.map(hashLevel)).then((scores: BigNumber[]) => {
      setScores(scores.map(score => score.toNumber()));
    });
  }, [provider, account, levels]);

  const onGameChange = (state: GameState) => {
    if (!provider || !level) return;

    setGameState(state);

    if (state.level.blocks.every(block => state.level.targets.some(target => block === target))) {
      while (state.steps.length < 128) state.steps.push(0);

      const input = {
        numSteps: state.steps.filter(step => step != 0).length,
        proofAddress: account,
        address: account,
        player: level.player.toString(),
        steps: state.steps.map(n => n.toString()),
        walls: level.walls.map(n => n.toString()),
        blocks: level.blocks.map(n => n.toString()),
        targets: level.targets.map(n => n.toString()),
        width: level.width.toString(),
        height: level.height.toString(),
      };

      setVerifying(true);
      setVerifyingStatus('Calculating proof...');

      calculateProof(input)
        .then(args => {
          console.log(args);
          setVerifyingStatus('Verifying solution...');

          const contract = getAgnosisContract(provider);
          return contract.verify(...args);
        })
        .then((tx: ContractTransaction) => {
          return tx.wait();
        })
        .then(() => {
          setBalance(null);
          setVerifyingStatus('Verified!');
        })
        .catch(e => {
          if (typeof e.reason === 'string' && e.reason.startsWith('execution reverted: ')) {
            setVerifyingStatus(e.reason.split(': ')[1]);
          } else {
            console.error(e);
            setVerifyingStatus(
              'There was an error while validating your solution. Please try again or contact support.',
            );
          }
        })
        .finally(() => setVerifying(false));
    }
  };

  useEffect(() => {
    if (!provider || !account || balance) return;

    const contract = getERC20Contract(provider, '0x9132Fd1c7017B135a834fd92F72B86D259C6d7eD');

    contract
      .balanceOf(account)
      .then((balance: BigNumber) => {
        setBalance(balance);
      })
      .catch(console.error);
  }, [provider, account, balance, setBalance]);

  useEffect(() => {
    if (music) {
      const songs = [
        '/music/bouncy.ogg',
        '/music/chill.ogg',
        '/music/doo-doo-doo.ogg',
        '/music/gentry-jolly.ogg',
        '/music/interlude.ogg',
        '/music/moody.ogg',
        '/music/ooky-spooky.ogg',
        '/music/sparkly.ogg',
        '/music/themey.ogg',
        '/music/zen.ogg',
      ];

      const a = new Audio(process.env.PUBLIC_URL + songs[Math.floor(Math.random() * songs.length)]);
      a.loop = true;
      a.play();

      return () => {
        a.pause();
        a.currentTime = 0;
      };
    }
  }, [music]);

  return (
    <div className="relative flex min-h-screen overflow-x-hidden pixel bg-sky-light">
      <img
        src={process.env.PUBLIC_URL + '/cloud.png'}
        alt="cloud"
        className="absolute right-[-40px] bottom-10 w-60"
      />

      <img
        src={process.env.PUBLIC_URL + '/cloud.png'}
        alt="cloud"
        className="absolute left-[-40px] top-40 w-60"
      />

      <img
        src={process.env.PUBLIC_URL + '/cloud.png'}
        alt="cloud"
        className="absolute right-40 top-80 w-60"
      />

      <div className="z-10 flex flex-col flex-1">
        <Header />

        <div className="flex flex-col items-center justify-center flex-1">
          {/* {sprites && (
            <div className="flex flex-wrap max-w-4xl">
              {[...new Array(99)].map((_, i) => (
                <Owl key={i} className="w-20 h-20" sprites={sprites} />
              ))}
            </div>
          )} */}

          {provider &&
            (level ? (
              <div>
                <div className="flex mb-4">
                  <Button onClick={() => setLevel(null)}>Back</Button>
                  <Button onClick={() => setLevel({ ...level })} className="ml-2">
                    Reset
                  </Button>

                  <div className="flex-1"></div>

                  <div className="mr-2 paper">
                    <div className="px-2 py-1 bg-ui-paper">Level {levelNumber + 1}</div>
                  </div>

                  <div className="w-32 paper">
                    <div className="px-2 py-1 bg-ui-paper">
                      Steps: {(gameState?.steps.length || 1) - 1}
                    </div>
                  </div>
                </div>
                {sprites && (
                  <Sokoban level={level} tileSize={64} onChange={onGameChange} sprites={sprites} />
                )}
              </div>
            ) : (
              <div className="max-w-xl">
                <div className="mt-8 mb-8 text-xl text-center paper">
                  <div className="px-2 py-1 bg-ui-paper">Level select</div>
                </div>
                <div className="flex flex-wrap justify-center">
                  {levels.map((level, levelIndex) => (
                    <Button
                      key={levelIndex}
                      className={clsx('m-1', scores[levelIndex] && '-hue-rotate-90 brightness-150')}
                      onClick={() => {
                        setLevel(level);
                        setLevelNumber(levelIndex);
                      }}
                    >
                      <div className="flex items-center justify-center w-4 h-8">
                        {levelIndex + 1}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {(verifying || verifyingStatus) && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="frame">
            <div className="p-4 bg-ui-frame">
              <div className="text-white">{verifyingStatus}</div>
              <div className="flex justify-center mt-4">
                {verifying && (
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white animate-spin"
                  >
                    <path
                      opacity="0.2"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}

                {!verifying && (
                  <Button
                    onClick={() => {
                      setLevel(null);
                      setVerifyingStatus('');
                    }}
                  >
                    Back
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-4 bottom-4">
        {notifications.map(notification => (
          <div
            className="px-4 py-2 mt-2 text-white bg-gray-800 rounded opacity-80"
            onClick={() => removeNotification(notification)}
          >
            {notification}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
