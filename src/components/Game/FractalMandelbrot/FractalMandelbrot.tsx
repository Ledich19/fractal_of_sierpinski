import { useEffect, useRef, useState } from "react";
import vertexShaderSource from './vertexShader.glsl';
import fragmentShaderSource from './fragmentShader.glsl';

const FractalMandelbrot: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [offsetX, setOffsetX] = useState(-2);
  const [offsetY, setOffsetY] = useState(-2);
  const [dragging, setDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const createShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return undefined;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    const shaderProgram = gl.createProgram();
    if (!shaderProgram || !vertexShader || !fragmentShader) return undefined;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(shaderProgram));
    }
    gl.useProgram(shaderProgram);

    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    const zoomLocation = gl.getUniformLocation(shaderProgram, "u_zoom");
    const offsetXLocation = gl.getUniformLocation(shaderProgram, "u_offsetX");
    const offsetYLocation = gl.getUniformLocation(shaderProgram, "u_offsetY");

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    const render = () => {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(zoomLocation, zoom);
      gl.uniform1f(offsetXLocation, offsetX);
      gl.uniform1f(offsetYLocation, offsetY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = 1.05;
      if (event.deltaY < 0) {
        setZoom(prevZoom => Math.max(prevZoom / zoomFactor, 1e-15));
      } else {
        setZoom(prevZoom => Math.min(prevZoom * zoomFactor, 1e10));
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setDragging(true);
      setStartDrag({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (dragging) {
        const deltaX = event.clientX - startDrag.x;
        const deltaY = event.clientY - startDrag.y;
        const zoomFactor = 4.0 * zoom;
        setOffsetX(prevOffsetX => prevOffsetX - deltaX * zoomFactor / canvas.width);
        setOffsetY(prevOffsetY => prevOffsetY + deltaY * zoomFactor / canvas.height);
        setStartDrag({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        setStartDrag({ x: distance, y: 0 });
      } else if (event.touches.length === 1) {
        const touch = event.touches[0];
        setStartDrag({ x: touch.clientX, y: touch.clientY });
        setDragging(true);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const zoomFactor = 1.05;
        const deltaZoom = distance > startDrag.x ? zoomFactor : 1 / zoomFactor;
        setZoom(prevZoom => Math.max(Math.min(prevZoom * deltaZoom, 1e10), 1e-15));
        setStartDrag({ x: distance, y: 0 });
      } else if (event.touches.length === 1 && dragging) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - startDrag.x;
        const deltaY = touch.clientY - startDrag.y;
        const zoomFactor = 4.0 * zoom;
        setOffsetX(prevOffsetX => prevOffsetX - deltaX * zoomFactor / canvas.width);
        setOffsetY(prevOffsetY => prevOffsetY + deltaY * zoomFactor / canvas.height);
        setStartDrag({ x: touch.clientX, y: touch.clientY });
      }
    };

    const handleTouchEnd = () => {
      setDragging(false);
    };

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);

      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [zoom, offsetX, offsetY, dragging, startDrag]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ touchAction: "none" }}
    ></canvas>
  );
};

export default FractalMandelbrot;
