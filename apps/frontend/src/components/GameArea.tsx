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
  ); // State to store pan start position
  const gameAreaRef = useRef<HTMLDivElement>(null); // Reference to the game area div
  const initialSize = 400; // Adjust this based on your preference
  const minSquareSize = 50; // Minimum size for each square

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
      event.preventDefault(); // Prevent default scrolling behavior when Command/Ctrl key is pressed
      handleZoomChange(event.deltaY);
    }
  };

  // Calculate dynamic size based on zoom level with minimum size constraint
  const dynamicSize = Math.max(minSquareSize, initialSize / zoomLevel);

  const loadSquare = (id: number) => {
    // Logic to load a square
  };

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
          gap: "8px",
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <Square
            key={i}
            id={i}
            size={dynamicSize}
            onLoad={() => loadSquare(i)}
          />
        ))}
      </div>
    </div>
  );
};
