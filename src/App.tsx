import { useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import FractalTriangleV1 from "./components/Game/FractalTriangleV1";
import FractalTriangleV2 from "./components/Game/FractalTriangleV2";
const tg = window.Telegram.WebApp;

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
      };
    };
  }
}

function App() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<FractalTriangleV1 headerRef={headerRef} />} />
        <Route path="/v1" element={<FractalTriangleV1 headerRef={headerRef} />} />
        <Route path="/v2" element={<FractalTriangleV2 headerRef={headerRef} />} />
      </Routes>
      <Header ref={headerRef} />
    </>
  );
}

export default App;
