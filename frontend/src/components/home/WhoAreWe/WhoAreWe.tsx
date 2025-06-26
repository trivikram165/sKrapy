import Image from "next/image";
import { FC } from "react";
import s from "./WhoAreWe.module.scss";

const WhoAreWe: FC = () => {
  return (
    <div className={`${s.container} who-we-are-main`} data-aos="who-we-are">
      <div className={s.team}>
        <div
          className={s.thumnailWrapper}
          data-aos="fade-in"
          data-aos-delay="0"
          data-aos-anchor=".who-we-are-main"
        >
          <Image
            src="/images/layout/team01.jpg"
            width={1300}
            height={770}
            style={{ objectFit: "cover" }}
            alt=""
          />
        </div>
        <div className={`${s.titleWrapper} titleWrapper`}>
          {Array(4)
            .fill("WHO ARE WE")
            .map((item, i) => (
              <span className={`${s.title} title blockRevealer`} key={i}>
                {item}
              </span>
            ))}
        </div>
      </div>
      <div className="container">
        <div className={`${s.intro} who-are-we-intro`}>
          <span data-aos="fade-up" data-aos-anchor=".who-are-we-intro">
            {`We are everywhere.`}
          </span>
          <span
            data-aos="fade-up"
            data-aos-delay="50"
            data-aos-anchor=".who-are-we-intro"
          >
            We want to build a new world, with you in the middle.
            <br /> Self, Sovereign, Custodian.
          </span>
          <span
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-anchor=".who-are-we-intro"
          >
            {`Also, we speak satire, house & techno.`}
          </span>
        </div>
        <div className={s.details}>
          <div className="row">
            <div className="col-md-6">
              <p data-aos="fade-up">
                sKrapy is a tech-driven platform designed to organize India&aposs scrap collection ecosystem. It connects households, corporates, and industries with verified scrap vendors, offering a seamless and transparent process for waste disposal while promoting sustainability.
              </p>
            </div>
            <div className="col-md-6" data-aos="fade-up">
              <span className={s.quote}>
                “Recycle smartly and responsibly. We help you sell scrap effortlessly with transparent rates and eco-friendly processes.”
              </span>
              {/* <p>
                Eu viverra morbi nec enim. Amet integer lobortis vitae velit id
                tincidunt. Nulla pellentesque aliquet at volutpat. Ut tortor
                est, at blandit et pellentesque. Urna ut nulla leo vel
                suspendisse id platea id lorem.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoAreWe;
