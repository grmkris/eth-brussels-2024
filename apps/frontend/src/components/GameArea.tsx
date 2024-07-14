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
    <>
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
              (index) => index.row === row && index.column === column
            );
            return (
              <Square
                setLoading={setIsLoading}
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

      {isLoading && (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-sm bg-white/30 flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </>
  );
};
