import React, { useState, useRef, useEffect } from "react";
import { Square } from "@/components/Square";

export const GameArea = ({
  initialGridSize,
  initialZoomLevel,
}: {
  initialGridSize: number;
  initialZoomLevel: number;
}) => {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const [panning, setPanning] = useState(false); // State to track panning mode
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const initialSize = 400;
  const minSquareSize = 50;

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if ((event.metaKey || event.ctrlKey) && !panning) {
        event.preventDefault(); // Prevent default behavior
        setPanning(true);
        setPanStart({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (panning && panStart) {
        const deltaX = event.clientX - panStart.x;
        const deltaY = event.clientY - panStart.y;

        if (gameAreaRef.current) {
          gameAreaRef.current.scrollLeft -= deltaX;
          gameAreaRef.current.scrollTop -= deltaY;
        }

        setPanStart({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      if (panning) {
        setPanning(false);
        setPanStart(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [panning, panStart]);

  const handleZoomChange = (deltaY: number) => {
    const zoomChange = deltaY > 0 ? -1 : 1; // deltaY > 0 means scroll down (zoom out), deltaY < 0 means scroll up (zoom in)
    setZoomLevel((prevZoomLevel) => Math.max(1, prevZoomLevel + zoomChange));
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey) {
      handleZoomChange(event.deltaY);
    }
  };
  const dynamicSize = Math.max(minSquareSize, initialSize / zoomLevel);

  return (
    <div
      ref={gameAreaRef}
      onWheel={handleWheel}
      style={{
        overflow: "auto",
        height: "100vh",
        cursor: panning ? "move" : "auto",
      }}
    >
      <div
        className="p-0 m-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${dynamicSize}px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <Square key={i} id={i} size={dynamicSize} />
        ))}
      </div>
    </div>
  );
};
