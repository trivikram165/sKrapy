/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FC, useContext } from "react";
import { AppConstant } from "src/constant/AppConstant";
import { MouseContext } from "src/context/mouse-context";
import s from "./Footer.module.scss";

const Footer: FC = () => {
  const { cursorChangeHandler } = useContext(MouseContext);
  return (
    <div className={s.container}>
      <div className="container">
        <div className={`row ${s.row}`}>
          <div className="col-md-4 order-md-2">
            <div className={s.brand}>
              <img src="/images/logo-full.png" alt="sKrapy Logo" />
            </div>
          </div>

          <div className="col-md-4 order-md-3">
            <div className={s.socials}>
              {/* This part is using standard <a> tags for external links, which is fine. No changes needed here. */}
              {AppConstant.socials.map((item, i) => (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  key={i}
                  onMouseEnter={() => cursorChangeHandler("hovered")}
                  onMouseLeave={() => cursorChangeHandler("")}
                >
                  <i className={item.fontIcon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="col-md-4 order-md-1">
            <div className={s.links}>
              {/* --- THIS IS THE CORRECTED BLOCK --- */}
              {AppConstant.footer.links.map((item, i) => (
                <Link
                  href={item.href}
                  key={i}
                  target="_blank"
                  rel="noreferrer"
                  className={s.link}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;