'use client';

import { FC, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './index';

interface ReduxProviderProps {
  children: ReactNode;
}

export const ReduxStoreProvider: FC<ReduxProviderProps> = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default ReduxStoreProvider; 