import { Contract, ethers } from 'ethers';

import agnosisABI from './agnosis.json';
import erc20ABI from './erc20.json';

export function getAgnosisContract(provider: ethers.providers.Web3Provider) {
  return new Contract(
    '0x479dBd453e60668482AEa89D8bdba96318c5Fc6B',
    agnosisABI,
    provider.getSigner(),
  );
}

export function getERC20Contract(provider: ethers.providers.Web3Provider, address: string) {
  return new Contract(address, erc20ABI, provider);
}
