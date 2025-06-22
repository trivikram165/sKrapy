import "antd/dist/antd.css";
import AOS from "aos";
import "aos/dist/aos.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { authAtom } from "src/_state/auth";
import MouseContextProvider from "src/context/mouse-context";
import "/styles/theme.scss";

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const queryClient = new QueryClient();

const config = createConfig(
  getDefaultConfig({
    appName: "sKrapy",
    appDescription: "Your App Description",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    chains: [mainnet, sepolia],
  }),
);


function RouteProtector({ children }: { children: JSX.Element }) {
    const auth = useRecoilValue(authAtom);
    const router = useRouter();

    useEffect(() => {
        const publicPaths = ["/", "/login", "/vendor/login", "/signup", "/forgot-password", "/vendor/forgot-password"];
        const isPublicPage = publicPaths.includes(router.pathname);

        if (auth === undefined) return;

        if (!auth?.token && !isPublicPage) {
            router.push("/login");
        } else if (auth?.token) {
            if (auth.type === "user" && router.pathname.startsWith("/vendor")) {
                router.push("/sell-scrap");
            } else if (auth.type === "vendor" && !router.pathname.startsWith("/vendor") && router.pathname !== "/") {
                router.push("/vendor/dashboard");
            }
        }
    }, [auth, router]);

    return children;
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList.add("page-loaded");
    AOS.init({ once: true, anchorPlacement: "top-center" });
    AOS.refresh();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <RecoilRoot>
            <MouseContextProvider>
              <RouteProtector>
                <Component {...pageProps} />
              </RouteProtector>
            </MouseContextProvider>
          </RecoilRoot>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;