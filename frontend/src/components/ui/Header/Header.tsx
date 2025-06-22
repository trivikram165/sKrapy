/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FC } from "react";
import s from "./Header.module.scss";

interface Props {
  audioRef?: any;
  audioControl?: any;
}

const Header: FC<Props> = ({ audioRef, audioControl }) => {
  return (
    <div className={s.container}>
      <div className="container">
        <div className={s.content}>
          <Link href="/" onClick={audioControl}>
            <div
              onClick={() => {
                audioControl();
                console.log("Here");
              }}
            >
              <h1 className={s.logo}>sKrapy</h1>
            </div>
          </Link>
          <div className={s.topRightButtons}>
            <Link href="/login">
              <button className={s.authButton}>Login</button>
            </Link>
            <Link href="/signup">
              <button className={s.authButton}>Sign Up</button>
            </Link>
          </div>
          <div>{/* <FollowUsCampaign /> */}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;