import { createContext } from 'react';

import { TCellDayContext } from './types';

export const CellDayContext = createContext<TCellDayContext | null>(null);
