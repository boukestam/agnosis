import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { BigNumber } from 'ethers';

import { chains } from '../blockchain/chains';
import { getERC20Contract } from '../blockchain/contracts';
import Header from '../components/header';
import { useAccount, useChainId, useProvider } from '../connectors';
import { useStore } from '../store';
import LevelPlay from './level-play';
import LevelSelect from './level-select';

function Game() {
  const provider = useProvider();
  const account = useAccount();
  const chainId = useChainId();

  const { balance, setBalance, music } = useStore();

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
        //'/music/moody.ogg',
        //'/music/ooky-spooky.ogg',
        '/music/sparkly.ogg',
        '/music/themey.ogg',
        '/music/zen.ogg',
      ];

      const randomSong = () =>
        process.env.PUBLIC_URL + songs[Math.floor(Math.random() * songs.length)];

      const a = new Audio(randomSong());
      a.onended = function () {
        a.src = randomSong();
        a.load();
        a.currentTime = 0;
        a.play();
      };
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
          {account && chainId && chainId in chains ? (
            <Routes>
              <Route index element={<LevelSelect />} />
              <Route path="/:levelNumber" element={<LevelPlay />} />
            </Routes>
          ) : (
            <div className="max-w-lg">
              <div className="frame">
                <div className="p-4 bg-ui-frame">
                  <div className="flex justify-center">
                    <img src={process.env.PUBLIC_URL + '/metamask.svg'} className="w-40" />
                  </div>
                  <div className="text-center text-white border-text">
                    {chainId && !(chainId in chains)
                      ? "Please switch MetaMask to the 'Rinkeby' network to play the game."
                      : "Connect your MetaMask wallet by clicking the 'connect' button in the top right."}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
