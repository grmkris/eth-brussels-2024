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
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const initialSize = 400;
  const minSquareSize = 50;

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if ((event.metaKey || event.ctrlKey) && !panning) {
        event.preventDefault();
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

  const handleZoomChange = (deltaY: number, mouseX: number, mouseY: number) => {
    const zoomChange = deltaY > 0 ? -1 : 1;
    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = Math.max(1, prevZoomLevel + zoomChange);

      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const offsetX = mouseX - rect.left;
        const offsetY = mouseY - rect.top;

        const prevDynamicSize = Math.max(
          minSquareSize,
          initialSize / prevZoomLevel,
        );
        const newDynamicSize = Math.max(
          minSquareSize,
          initialSize / newZoomLevel,
        );

        const scrollLeft =
          gameAreaRef.current.scrollLeft +
          (offsetX * (newDynamicSize - prevDynamicSize)) / newDynamicSize;
        const scrollTop =
          gameAreaRef.current.scrollTop +
          (offsetY * (newDynamicSize - prevDynamicSize)) / newDynamicSize;

        gameAreaRef.current.scrollLeft = scrollLeft;
        gameAreaRef.current.scrollTop = scrollTop;
      }

      return newZoomLevel;
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey) {
      handleZoomChange(event.deltaY, event.clientX, event.clientY);
    }
  };

  const dynamicSize = Math.max(minSquareSize, initialSize / zoomLevel);

  return (
    <div
      ref={gameAreaRef}
      onWheel={handleWheel}
      className="scrollable-sm"
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