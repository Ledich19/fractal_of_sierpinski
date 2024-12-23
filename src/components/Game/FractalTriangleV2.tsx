import { useEffect, useState, useRef, useCallback } from "react";

interface FractalTriangleV2Props {
  headerRef: React.RefObject<HTMLDivElement>;
}

const FractalTriangleV2: React.FC<FractalTriangleV2Props> = ({ headerRef }) => {
  const headerHeight = headerRef.current?.offsetHeight || 0;
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth,
    height: window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight - headerHeight,
  });

  const maxIterations = 10;
  const [iterations, setIterations] = useState(0);
  const [triangles, setTriangles] = useState<Triangle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [headerRef]);

  const drawTriangle = (
    context: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    p3: Point,
    color: string = "white"
  ) => {
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.closePath();

    context.fillStyle = color;
    context.fill();
  };

  const drawInitialTriangle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { width, height } = canvasSize;
    const size = Math.min(width, height);
    const p1: Point = { x: width / 2, y: 0 };
    const p2: Point = { x: 0, y: size };
    const p3: Point = { x: width, y: size };
    context.clearRect(0, 0, width, height);
    setTriangles([{ p1, p2, p3 }]);
    drawTriangle(context, p1, p2, p3, "white");
  }, [canvasSize]);

  useEffect(() => {
    drawInitialTriangle();
  }, [canvasSize, drawInitialTriangle]);

  const handleCanvasClick = () => {
    if (iterations < maxIterations) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height); 
      drawInitialTriangle();

      const drawFrame = () => {
        const newTriangles: Triangle[] = [];

        triangles.forEach(({ p1, p2, p3 }) => {
          const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
          const mid3 = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };
          drawTriangle(context, mid1, mid2, mid3, "black");

          newTriangles.push(
            { p1, p2: mid1, p3: mid3 },
            { p1: mid1, p2, p3: mid2 },
            { p1: mid3, p2: mid2, p3 }
          );
        });

        setTriangles((prevTriangles) => [...prevTriangles, ...newTriangles]);
      };

      drawFrame();
      setIterations((prev) => prev + 1);
    }
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
};

export default FractalTriangleV2;