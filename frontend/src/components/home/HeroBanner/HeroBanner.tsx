import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./HeroBanner.module.scss";


const HeroBanner: FC = () => {
  return (
    <div className={s.container}>
      <div className={s.items}>
        <div className={s.item}>
          <div className={`${s.imageWrapper} ${s.heading1}`}>
            <h1 className={s.headingText}>
              TURN YOUR SCRAP <br /> INTO CASH WITH <br />sKrapy
            </h1>
          </div> 
        </div>

        <div className={s.imgbuttons}>
          <div className={s.paintDrop}>
            <Image
              src="/images/layout/paint-drop-1.png"
              width={220}
              height={240}
              style={{objectFit: "contain"}}
              alt=""
            />
            <div className={s.drop}>
              <Image
                src="/images/layout/paint-drop-2.png"
                width={200}
                height={230}
                style={{objectFit: "contain"}}
                alt=""
              />
            </div>
          </div>

          <div className={s.paintDrop}>
            <Image
              src="/images/layout/paint-drop-1.png"
              width={220}
              height={240}
                style={{objectFit: "contain"}}
              alt=""
            />
            <div className={s.drop}>
              <Image
                src="/images/layout/paint-drop-2.png"
                width={200}
                height={230}
                style={{objectFit: "contain"}}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;