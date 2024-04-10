import { createContext } from 'react';

import { TCalendarCellContent } from './types';

export const TrainingsContext = createContext<TCalendarCellContent | null>(null);
