//import Image from "next/image";
import Dashboard from "../components/dashboard/dashboard";
import ThemeSwitcher from "../components/buttons/themeswitcher";

export default function Home() {




  return (
          <div className={"flex-auto flex flex-col min-h-dvh"}>
              <main className={"flex-grow flex-col min-h-0.5dvh"}>
                  <Dashboard/>
              </main>
              <footer>
                  <div className={"flex items-center flex-col mt-auto"}>
                      <ThemeSwitcher/>


                      <p>All rights resnerved</p>
                  </div>
              </footer>
          </div>

  );
}
