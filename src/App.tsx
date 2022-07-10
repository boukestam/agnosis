import React, { useEffect, useState } from 'react';

import { BigNumber, Contract, ContractTransaction } from 'ethers';

import agnosisABI from './blockchain/agnosis.json';
import erc20ABI from './blockchain/erc20.json';
import { calculateProof } from './blockchain/proof';
import Button from './components/button';
import { Game } from './components/game';
import Header from './components/header';
import { useAccount, useProvider } from './connectors';
import { Level, levels } from './constants/levels';
import { GameState } from './engine/state';
import { useStore } from './store';

function App() {
  const provider = useProvider();
  const account = useAccount();

  const { notifications, removeNotification, balance, setBalance } = useStore();

  const [level, setLevel] = useState<Level | null>(null);
  const [levelNumber, setLevelNumber] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [verifying, setVerifying] = useState(false);

  const onGameChange = (state: GameState) => {
    if (!provider || !level) return;

    setGameState(state);

    if (state.level.blocks.every(block => state.level.targets.some(target => block === target))) {
      while (state.steps.length < 128) state.steps.push(0);

      const input = {
        player: level.player.toString(),
        steps: state.steps.map(n => n.toString()),
        walls: level.walls.map(n => n.toString()),
        blocks: level.blocks.map(n => n.toString()),
        targets: level.targets.map(n => n.toString()),
        width: level.width.toString(),
        height: level.height.toString(),
      };

      setVerifying(true);

      calculateProof(input)
        .then(args => {
          const verifier = new Contract(
            '0x411b67d8D85405b3611fB54ACef617d893D58f2E',
            agnosisABI,
            provider.getSigner(),
          );

          return verifier.verify(...args);
        })
        .then((tx: ContractTransaction) => {
          return tx.wait();
        })
        .then(() => {
          setBalance(null);
          setLevel(null);
        })
        .catch(e => {
          console.error(e);
          alert(
            'There was an error while validating your solution. Please try again or contact support.',
          );
        })
        .finally(() => setVerifying(false));
    }
  };

  useEffect(() => {
    if (!provider || !account || balance) return;

    const contract = new Contract('0x9132Fd1c7017B135a834fd92F72B86D259C6d7eD', erc20ABI, provider);

    contract
      .balanceOf(account)
      .then((balance: BigNumber) => {
        setBalance(balance);
      })
      .catch(console.error);
  }, [provider, account, balance, setBalance]);

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-sky-light">
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
          {provider &&
            (level ? (
              <div>
                <div className="flex mb-4">
                  <Button onClick={() => setLevel(null)}>Back</Button>

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
                <Game level={level} tileSize={64} onChange={onGameChange} />
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
                      className="m-1"
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

      {verifying && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="frame">
            <div className="p-4 bg-ui-frame">
              <div className="text-white">Verifying solution...</div>
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

export default App;
