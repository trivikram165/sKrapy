import { DontSendText } from "@components/ui/SVGElements";
import { gsap } from "gsap";
import { FC, useContext, useEffect, useRef, useState } from "react";
import Particles from "react-tsparticles";
import { MouseContext } from "src/context/mouse-context";
import s from "./PageLoader.module.scss";



interface Props {
  onLoaded?: any;
  audioRef?: any;
  audioControl?: any;
}

const PageLoader: FC<Props> = ({ onLoaded, audioRef, audioControl }) => {
  const [loading, setLoading] = useState(0);
  const { cursorChangeHandler } = useContext(MouseContext);
  let timer: number | null | undefined = null;

  const commonRef: any = useRef({});

  useEffect(() => {
    gsap.fromTo(
      commonRef.current["defaultScreen"],
      { opacity: 0 },
      { opacity: 1, scale: 1 }
    );
    return () => {
      if (!timer) return;
      window.clearInterval(timer);
    };
  }, []);

  const startTimer = () => {
    timer = window.setInterval(() => {
      setLoading((prevState) => {
        if (prevState >= 100) return prevState;
        return prevState + 1;
      });
    }, 18);
  };

  useEffect(() => {
    if (!loading) return;
    if (loading === 100) {
      setTimeout(() => {
        document.body.classList.add("page-loaded");
        onLoaded();
      }, 1400);
    }
  }, [loading]);

  const onAction = () => {
    setLoading(1);
    initAnimation();
    startTimer();
    audioControl();
};


  const welcomeMessage = () => {
    const message = "Sell your scrap effortlessly with  ";
    return message.split("").map((item, i) => (
      <span key={i}>{item}</span>
    ));
  };

  const initAnimation = () => {
    const tl = gsap.timeline();
    tl.from(commonRef.current["welcomeMessage"].children, {
      duration: 0.8,
      opacity: 0,
      scale: 0,
      y: 80,
      rotationX: 180,
      transformOrigin: "0% 50% -50",
      ease: "back",
      stagger: 0.01,
    })
    tl.fromTo(
      commonRef.current["brandText"],
      { opacity: 0, y: 20 }, // Start 20px below
      { opacity: 1, y: 7, ease: "back", duration: 0.8 }, // Animate to natural position
      "-=.5"
    );
  };

  return (
    <div className={`${s.container} ${loading === 100 ? s.loaded : ""}`}>
      <div
        className={`${s.defaultScreen} ${loading !== 0 ? s.loaded : ""}`}
        ref={(el: any) => (commonRef.current["defaultScreen"] = el)}
      >
        <div className={`${s.bgText} ${s.mobile} mobile-only`} />
        {loading === 0 ? (
          <>
            <Particles
              options={{
                particles: {
                  number: { value: 50 },
                  color: { value: "#a9ff1c" },
                  size: { value: 3 },
                  move: { enable: true, speed: 2, direction: "none" },
                },
                interactivity: {
                  events: {
                    onClick: { enable: true, mode: "push" },
                  },
                },
              }}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
            <div
              onClick={() => {
                onAction();
                audioControl();
              }}
              className={`p-btn ${s.startAction}`}
              onMouseEnter={() => cursorChangeHandler("hovered")}
              onMouseLeave={() => cursorChangeHandler("")}
            >
              <span>Sell</span> Your Scrap
            </div>
          </>
        ) : null}
      </div>

      <div className={`${s.loadingScreen} ${loading > 1 ? s.loaded : ""}`}>
        <div className={s.intro}>
          <span
            className={s.message}
            ref={(el: any) => (commonRef.current["welcomeMessage"] = el)}
          >
            {welcomeMessage()}
          </span>{" "}
          <h1
            className={`${s.logo} ${s.text}`}
            ref={(el: any) => (commonRef.current["brandText"] = el)}
          >
            sKrapy
          </h1>
        </div>
        <div className={`${s.progress} ${loading > 2 ? s.loaded : ""}`} />
        <span className={s.progressPercent}>{loading}%</span>
      </div>
    </div>
  );
};

export default PageLoader;