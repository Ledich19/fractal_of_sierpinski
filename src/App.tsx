import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import FractalTriangleV1 from "./components/Game/FractalTriangleV1";
import FractalTriangleV2 from "./components/Game/FractalTriangleV2";
import FractalMandelbrot from "./components/Game/FractalMandelbrot/FractalMandelbrot";
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
        <Route path="sierpinski_1" element={<FractalTriangleV1  />} />
        <Route path="sierpinski_2" element={<FractalTriangleV2  />} />
        <Route path="mandelbrot" element={<FractalMandelbrot />} />
      </Routes>
    </>
  );
}

export default App;
