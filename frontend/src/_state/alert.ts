import { atom } from "recoil";

interface Alert {
  type: "success" | "error" | "info";
  message: string;
}

const alertAtom = atom<Alert | null>({
  key: "alert",
  default: null,
});

export { alertAtom };