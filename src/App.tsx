/* Standard packages */
import { useRef } from "react";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

/* custom packages */
import MainPage from "./components/Pages/MainPage";
import { AppProvider } from "./components/Provider/AppProvider";

/* App */
function App() {
  const mainPageRef = useRef<any>(undefined);
  return (
    <MantineProvider>
      <AppProvider>
        <MainPage ref={mainPageRef} $data={{ wid: 'mainPageRef' }} />
      </AppProvider>
    </MantineProvider>
  );
};
export default App;