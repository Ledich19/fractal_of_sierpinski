import React, { useState, useRef, useEffect } from "react";

interface FractalTriangleV1Props {}

const FractalTriangleV1: React.FC<FractalTriangleV1Props> = () => {
  const [canvasSize, setCanvasSize] = useState(() => {
    const size = Math.min(window.innerWidth, window.innerHeight);
    return { width: size, height: size };
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPoint = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    context.beginPath();
    context.fillStyle = "white";
    context.fillRect(x, y, 1, 1);
    context.closePath();
  };

  const generateChaosFractal = (
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number
  ) => {
    const size = canvasSize.width;
    const attractors = [
      { x: size / 2, y: 0 },
      { x: 0, y: size },
      { x: size, y: size },
    ];

    let currentPoint = { x: startX, y: startY };

    let iterations = 0;
    const maxIterations = 50000;

    const drawFrame = () => {
      const activeAttractor = attractors[Math.floor(Math.random() * 3)];
      const newX = (currentPoint.x + activeAttractor.x) / 2;
      const newY = (currentPoint.y + activeAttractor.y) / 2;
      currentPoint = { x: newX, y: newY };
      drawPoint(context, currentPoint.x, currentPoint.y);

      iterations++;

      if (iterations < maxIterations) {
        requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    context.clearRect(0, 0, canvas.width, canvas.height);
    generateChaosFractal(context, x, y);
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight);
      setCanvasSize({ width: size, height: size });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    generateChaosFractal(context, canvasSize.width / 2, canvasSize.height / 2);
  }, [canvasSize]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
    ></canvas>
  );
};

export default FractalTriangleV1;
