import {
  type FC, type ReactNode, useEffect, useMemo, useState,
} from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayToaster, type Toaster } from '@blueprintjs/core';
import { ToasterProviderContext } from 'hooks/ToasterProvider/useToasterProvider';

interface ToasterProviderProps {
  children: ReactNode;
}

const initToaster = async (): Promise<Toaster> => OverlayToaster.createAsync(
  { position: 'top-right', className: 'overlay-toaster' },
  {
    domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster),
  },
);

export const ToasterProvider: FC<ToasterProviderProps> = ({ children }) => {
  const [toaster, setToaster] = useState<Toaster | null>(null);

  useEffect(() => {
    initToaster()
      .then((currentToaster) => {
        setToaster(currentToaster);
      })
      .catch(() => {});
  }, []);

  const stateValue = useMemo(
    () => ({
      toaster,
    }),
    [toaster],
  );

  if (!stateValue.toaster) {
    return null;
  }

  return <ToasterProviderContext.Provider value={stateValue}>{children}</ToasterProviderContext.Provider>;
};
