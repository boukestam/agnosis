import React, { createContext, useContext, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

export interface ImportedContract {
  name: string;
  address: string;
  abi: string;
  chainId: number;
}

interface Store {
  contracts: ImportedContract[];
  addContract: (contract: ImportedContract) => void;
  removeContract: (contract: ImportedContract) => void;

  selectedContract: ImportedContract | null;
  setSelectedContract: (contract: ImportedContract | null) => void;

  notifications: string[];
  addNotification: (notification: string) => void;
  removeNotification: (notification: string) => void;

  balance: BigNumber | null;
  setBalance: (balance: BigNumber | null) => void;

  music: boolean;
  setMusic: (music: boolean) => void;
}

export const StoreContext = createContext<Store>({} as Store);

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<ImportedContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<ImportedContract | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [balance, setBalance] = useState<BigNumber | null>(null);
  const [music, setMusic] = useState<boolean>(false);

  useEffect(() => {
    const storedContracts = localStorage.getItem('contracts');
    if (storedContracts) {
      setContracts(JSON.parse(storedContracts));
    }
  }, []);

  function saveContracts(contracts: ImportedContract[]) {
    localStorage.setItem('contracts', JSON.stringify(contracts));
  }

  function addContract(contract: ImportedContract) {
    const copy = [...contracts, contract];
    setContracts(copy);

    saveContracts(copy);
  }

  function removeContract(contract: ImportedContract) {
    const copy = [...contracts];
    copy.splice(copy.indexOf(contract), 1);
    setContracts(copy);

    saveContracts(copy);
  }

  function addNotification(notification: string) {
    const copy = [...notifications, notification];
    setNotifications(copy);

    setTimeout(() => {
      setNotifications(notifications.filter(n => n !== notification));
    }, 5000);
  }

  function removeNotification(notification: string) {
    setNotifications(notifications.filter(n => n !== notification));
  }

  const store = {
    contracts,
    addContract,
    removeContract,

    selectedContract,
    setSelectedContract,

    notifications,
    addNotification,
    removeNotification,

    balance,
    setBalance,

    music,
    setMusic,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

// Here we create a custom hook that allows us to consume
// the todo context
function useStore() {
  return useContext(StoreContext);
}

export { StoreProvider, useStore };
