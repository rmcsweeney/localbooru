//import Image from "next/image";
import Dashboard from "../components/dashboard/dashboard";
import "../globals.css"
import ThemeSwitcher from "../components/buttons/themeswitcher";
import {ThemeProvider} from "next-themes";

export default function Home() {




  return (
          <div className={"flex-auto flex flex-col min-h-dvh"}>
              <main className={"flex-grow flex-col min-h-0.5dvh"}>
                  <Dashboard/>
              </main>
              <footer>
                  <div className={"flex items-center flex-col mt-auto"}>
                      <ThemeProvider>
                          <ThemeSwitcher/>
                      </ThemeProvider>


                      <p>All rights resnerved</p>
                  </div>
              </footer>
          </div>

  );
}
