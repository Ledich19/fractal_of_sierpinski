import React, { useEffect, useState, useRef } from "react";


interface FractalTriangleV1Props {
  headerRef: React.RefObject<HTMLDivElement>;
}

const FractalTriangleV1: React.FC<FractalTriangleV1Props> = ({ headerRef }) => {
  const headerHeight = headerRef.current?.offsetHeight || 0;
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height:
      window.innerHeight > window.innerWidth
        ? window.innerWidth
        : window.innerHeight - headerHeight,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const width = window.innerWidth;
      const height = window.innerHeight - headerHeight;
      setCanvasSize({ width, height });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [headerRef]);

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
    const size = Math.min(canvasSize.width , canvasSize.height);
    const attractors = [
      { x: canvasSize.width / 2, y: 0 }, 
      { x: 0, y: size  },
      { x: canvasSize.width, y: size  },
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

    canvasSize.width = window.innerWidth;
    canvasSize.height =
      window.innerHeight > window.innerWidth
        ? window.innerWidth
        : window.innerHeight - headerHeight;



    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    context.clearRect(0, 0, canvas.width, canvas.height);
    generateChaosFractal(context, x / canvas.width, y / canvas.height);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ width: "100%", height: "100%" }}
    ></canvas>
  );
}

export default FractalTriangleV1;
