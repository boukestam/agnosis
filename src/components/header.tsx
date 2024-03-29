import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ethers } from 'ethers';

import { chains } from '../blockchain/chains';
import { metaMask, useAccounts, useChainId, useIsActivating, useIsActive } from '../connectors';
import { useStore } from '../store';
import { formatAddress } from '../utils/formatAddress';
import Button from './button';
import { Tag } from './tag';

function Header() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const navigate = useNavigate();

  const { balance, music, setMusic } = useStore();

  useEffect(() => {
    metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
    });
  }, []);

  return (
    <div className="flex items-center justify-end px-4 py-2">
      <div className="flex items-center font-bold cursor-pointer" onClick={() => navigate('/')}>
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="logo" className="h-12 mr-1" />
        <span className="text-xl text-white border-text">Agnosis</span>
        <Tag className="ml-2">Alpha</Tag>
      </div>

      <div className="flex-1"></div>

      {isActive && accounts && chainId ? (
        <div className="flex">
          <Button className="mr-4" onClick={() => setMusic(!music)}>
            Toggle music
          </Button>

          <Button className="mr-4">
            <div className="flex items-center">
              <img src={process.env.PUBLIC_URL + '/coin.png'} className="w-6 h-6" />
              <div className="ml-2">{balance ? ethers.utils.formatEther(balance) : '...'}</div>
            </div>
          </Button>

          <Button className="mr-4">{chains[chainId] || 'Wrong network'}</Button>

          <Button>{formatAddress(accounts[0])}</Button>
        </div>
      ) : isActivating ? (
        'Connecting...'
      ) : (
        <Button onClick={() => metaMask.activate()}>Connect</Button>
      )}
    </div>
  );
}

export default Header;
