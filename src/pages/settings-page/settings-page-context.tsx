import { createContext } from 'react';

import { TSettingsContext } from './types';

export const SettingsContext = createContext<TSettingsContext | null>(null);
