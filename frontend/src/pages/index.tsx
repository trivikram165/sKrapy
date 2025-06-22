import { DontMint, PageLoader } from "@components/common";
import {
  ContactUs,
  HeroBanner,
  OurWork,
  SocialConnect,
  WhoAreWe,
} from "@components/home";
import { Footer, Header, Layout } from "@components/ui";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { AppConstant } from "../constant/AppConstant";

const Home: NextPage = () => {
  const audioRef = useRef<any>(null);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const audioControl = () => {
    if (!audioRef.current) {
      return;
    }
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const shouldShowLoader = !isClient || !isPageLoaded;

  return (
    <Layout>
      <>
        <audio ref={audioRef} id="audio" src="/bgMusic.mp3"></audio>
      </>
      <Head>
        <title>sKrapy</title>
        <meta name="description" content={AppConstant.meta.description} />
      </Head>
      <Header audioControl={audioControl} />
      {shouldShowLoader && (
        <PageLoader
          onLoaded={() => setIsPageLoaded(true)}
          audioRef={audioRef}
          audioControl={() => {
            audioControl();
          }}
        />
      )}
      <HeroBanner />
      <DontMint />
      <OurWork />
      <WhoAreWe />
      <SocialConnect />
      <ContactUs />
      <Footer />
    </Layout>
  );
};

export default Home;