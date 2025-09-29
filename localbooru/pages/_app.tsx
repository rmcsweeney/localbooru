import type { AppProps } from "next/app";
import "../globals.css";
import { ThemeProvider } from "next-themes";
import {useSearchParams} from "next/navigation";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Component {...pageProps} key={useSearchParams().toString()} />
    </ThemeProvider>
  );
}