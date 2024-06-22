import { useRef } from "react";
import MainPage from "./components/Pages/MainPage";

// import './components/Pages/MainPage.css';

/* App */
function App() {
  const mainPageRef = useRef(undefined);
  return (<MainPage ref={mainPageRef} $data={{ wid: 'mainPageRef', refId: { current: mainPageRef } }} />)
}

export default App;
