import React, { useEffect } from 'react';

import { ethers } from 'ethers';

import { metaMask, useAccounts, useChainId, useIsActivating, useIsActive } from '../connectors';
import { useStore } from '../store';
import { formatAddress } from '../utils/formatAddress';
import Button from './button';

function Header() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();

  const { balance } = useStore();

  useEffect(() => {
    metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
    });
  }, []);

  return (
    <div className="flex items-center justify-end p-2">
      <div className="flex items-center px-4 text-2xl font-bold text-white border-text">
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="logo" className="h-12 mr-4" />
        Agnosis
      </div>

      <div className="flex-1"></div>

      {isActive && accounts && chainId ? (
        <div className="flex">
          <Button className="mr-4">
            <div className="flex items-center">
              <img src={process.env.PUBLIC_URL + '/coin.png'} className="w-6 h-6" />
              <div className="ml-2">{balance ? ethers.utils.formatEther(balance) : '...'}</div>
            </div>
          </Button>
          <Button>{'Polygon'}</Button>

          <Button className="ml-4">{formatAddress(accounts[0])}</Button>
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
