//import Image from "next/image";
import Dashboard from "../components/dashboard/dashboard";
import "../globals.css"
import ThemeSwitcher from "../components/buttons/themeswitcher";
import {ThemeProvider} from "next-themes";

export default function Home() {




  return (
      <div className={"min-h-screen flex flex-col"}>
          <div className={"flex-auto"}>
              <main>
                  <Dashboard/>
              </main>
              <footer className={"align-baseline justify-content-center"}>
                  <ThemeProvider>
                      <ThemeSwitcher/>
                  </ThemeProvider>


                  <p>All rights resnerved</p>
              </footer>
          </div>
      </div>

  );
}
