//import Image from "next/image";
import Dashboard from "../components/dashboard/dashboard";
import "../globals.css"
import ThemeSwitcher from "../components/buttons/themeswitcher";
import {ThemeProvider} from "next-themes";

export default function Home() {




  return (
    <div>
      <main>
        <Dashboard/>
      </main>
      <footer>
          <ThemeProvider>
              <ThemeSwitcher/>
          </ThemeProvider>


          <p>All rights resnerved</p>
      </footer>
    </div>
  );
}
