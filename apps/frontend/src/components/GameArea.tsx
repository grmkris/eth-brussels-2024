import React, { useState, useRef, useEffect } from "react";
import { Square } from "@/components/Square";
import { useGetPlayer } from "@/hooks/player/useGetPlayer";
import { useGetGames } from "@/hooks/games/useGetGames";
import { WinnerModal } from "@/components/WinnerModal";
import { useGetGame } from "@/hooks/games/useGetGame";

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
  const player = useGetPlayer();
  const getGames = useGetGames();
  const getGame = useGetGame({
    id: getGames.data?.[getGames.data.length - 1]?.id ?? "",
  });
  const [isOpen, setIsOpen] = useState(
    !!getGames.data?.[getGames.data.length - 1]?.winnerId,
  );

  useEffect(() => {
    setIsOpen(!!getGames.data?.[getGames.data.length - 1]?.winnerId);
  }, [getGames.data?.[getGames.data.length - 1]?.winnerId]);

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

  let indices: { row: number; column: number }[] = [];

  if (getGame.data && getGame.data?.map?.length !== 0) {
    for (let i = 0; i < getGame.data?.map?.length!; i++) {
      for (let j = 0; j < getGame.data?.map?.[i]!.length!; j++) {
        if (getGame.data?.map?.[i]?.[j].playerAddress !== null) {
          indices.push({ column: i, row: j });
        }
      }
    }
  }

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
      <WinnerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        player={player.data}
      />
      <div
        className="p-0 m-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${dynamicSize}px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const row = Math.floor(i / gridSize);
          const column = i % gridSize;
          const hasIcon = indices.some(
            (index) => index.row === row && index.column === column,
          );
          return (
            <Square
              isNewGame={!getGames.data?.[getGames.data.length - 1]?.winnerId}
              player={player.data}
              key={i}
              size={dynamicSize}
              row={row}
              column={column}
              hasIcon={hasIcon}
            />
          );
        })}
      </div>
    </div>
  );
};
