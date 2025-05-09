import { User } from '@/types/userTypes';

import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);
