import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ContractTransaction } from 'ethers';

import { getAgnosisContract } from '../blockchain/contracts';
import { calculateProof } from '../blockchain/proof';
import Button from '../components/button';
import { Loader } from '../components/loader';
import { Modal } from '../components/modal';
import { Sokoban } from '../components/sokoban';
import { useAccount, useProvider } from '../connectors';
import { levels } from '../constants/levels';
import { GameState } from '../engine/state';
import { useStore } from '../store';

function getLevel(levelNumber: string | undefined) {
  return levels[parseInt(levelNumber || '1') - 1];
}

function LevelPlay() {
  const { levelNumber } = useParams();
  const navigate = useNavigate();

  const provider = useProvider();
  const account = useAccount();

  const { setBalance } = useStore();

  const [state, setState] = useState<GameState | null>(null);

  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyingStatus, setVerifyingStatus] = useState<string>('');

  const [sprites, setSprites] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    setState(new GameState(getLevel(levelNumber)));
  }, [levelNumber]);

  useEffect(() => {
    const spritesImage = new Image(160, 160);
    spritesImage.onload = () => {
      setSprites(spritesImage);
    };
    spritesImage.src = process.env.PUBLIC_URL + '/spritesheet.png';
  }, []);

  const onGameChange = (state: GameState) => {
    if (!provider || !account) return;

    setState(state.clone());

    const isFinished = state.level.blocks.every(block =>
      state.level.targets.some(target => block === target),
    );
    const level = state.originalLevel;

    if (isFinished) {
      const steps = state.steps.slice();
      while (steps.length < 128) steps.push(0);

      const input = {
        numSteps: steps.filter(step => step != 0).length.toString(),
        proofAddress: account,
        address: account,
        player: level.player.toString(),
        steps: steps.map(n => n.toString()),
        walls: level.walls.map(n => n.toString()),
        blocks: level.blocks.map(n => n.toString()),
        targets: level.targets.map(n => n.toString()),
        width: level.width.toString(),
        height: level.height.toString(),
      };

      console.log(input);

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
          setVerifyingStatus('Your solution is verified!');
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

  return (
    <div>
      <div>
        {provider && state && sprites && (
          <Sokoban
            levelNumber={parseInt(levelNumber || '1') - 1}
            tileSize={64}
            state={state}
            onBack={() => navigate('/app')}
            onReset={() => setState(new GameState(getLevel(levelNumber)))}
            onChange={onGameChange}
            sprites={sprites}
          />
        )}
      </div>

      {(verifying || verifyingStatus) && (
        <Modal>
          <div className="text-white border-text-light">{verifyingStatus}</div>
          <div className="flex justify-center mt-4">
            {verifying ? <Loader /> : <Button onClick={() => navigate('/app')}>Back</Button>}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default LevelPlay;
