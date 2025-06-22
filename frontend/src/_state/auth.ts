import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: 'auth-storage', 
});

interface NFTMetaData {
  id: string;
  identifier?: string;
}

export interface authInterface {
  id: string;
  username?: string;
  address?: string;
  twitterUsername?: string;
  wallet?: string;
  status?: string;
  token?: string;
  userWallet?: string;
  type?: 'user' | 'vendor';
  campaignWhitelist: string[];
  nftsOwned: NFTMetaData[];
  whitelisted?: boolean;
}

export const authAtom = atom<authInterface | null>({
  key: "auth",
  default: null,
  effects_UNSTABLE: [persistAtom],
});