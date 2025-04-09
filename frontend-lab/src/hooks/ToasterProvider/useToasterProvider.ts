import { createContext, useContext } from 'react';
import { Toaster } from '@blueprintjs/core';

interface ToasterContextState {
  toaster: Toaster | null;
}

export const ToasterProviderContext = createContext<ToasterContextState | null>(null);

export const useToasterContext = (): ToasterContextState => {
  const data = useContext<ToasterContextState | null>(ToasterProviderContext);

  if (!data) {
    throw new Error('Can not `useToasterContext` outside of the `ToasterProvider`');
  }

  return data;
};
