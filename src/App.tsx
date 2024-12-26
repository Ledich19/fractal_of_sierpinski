import { useEffect } from "react";
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

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <>
      <Header  />
      <Routes>
        <Route index element={<FractalTriangleV1  />} />
        <Route path="/v1" element={<FractalTriangleV1  />} />
        <Route path="/v2" element={<FractalTriangleV2  />} />
      </Routes>
    </>
  );
}

export default App;
