import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetGames } from "@/hooks/games/useGetGames";
import { useCreateMove } from "@/hooks/moves/useCreateMove";
import { CalculateUuidToNumber } from "@/utils/CalculateUuidToNumber";
import { PlayersOutput } from "@/schemas/playerSchemas";
import { usePlayPosition } from "@/hooks/actions/usePlayPosition";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const Square = ({
  size,
  row,
  column,
  player,
  isNewGame = false,
  hasIcon = false, // New prop added
  address,
  setLoading,
}: {
  size: number;
  row: number;
  column: number;
  player?: PlayersOutput;
  isNewGame?: boolean;
  hasIcon?: boolean; // New prop added
  address?: string;
  setLoading?: (loading: boolean) => void;
}) => {
  const { setShowDynamicUserProfile } = useDynamicContext();
  const [animationState, setAnimationState] = useState<
    "none" | "scaling" | "pulse"
  >("none");
  const move = useCreateMove({
    onSuccess: () => {
      // setHasIcon(true); // No need to set hasIcon in this component
      setLoading?.(false);
    },
    onError: () => {
      setLoading?.(false);
    },
  });
  const playPosition = usePlayPosition({
    onSuccess: () => {
      // setHasIcon(true); // No need to set hasIcon in this component
      setLoading?.(false);
    },
    onError: () => {
      setLoading?.(false);
    },
  });
  const getGames = useGetGames();

  useEffect(() => {
    if (isNewGame) {
      // setHasIcon(false); // No need to set hasIcon in this component
    }
  }, [isNewGame]);

  useEffect(() => {
    if (hasIcon) {
      setAnimationState("scaling");
      setTimeout(() => {
        setAnimationState("pulse");
        setTimeout(() => {
          setAnimationState("none");
        }, 1650);
      }, 0);
    }
  }, [hasIcon]);

  const handleClick = async () => {
    if (player?.id && getGames.data?.[getGames.data.length - 1].id) {
      setLoading?.(true);
      const timer = setTimeout(() => {
        const element = document.getElementById("dynamic-send-transaction");
        if (element) {
          element.style.display = "none";
        }
        setLoading?.(false);
      }, 10000);
      await playPosition.mutateAsync({
        position: `${row},${column}`,
      });
      move.mutate({
        playerId: player?.id ?? "",
        gameId: getGames.data?.[getGames.data.length - 1].id ?? "",
        yCoordinate: row,
        xCoordinate: column,
      });

      // Clean up function to clear timeout if component unmounts
      return () => clearTimeout(timer);
    } else {
      console.log(player?.id, getGames.data?.[getGames.data.length - 1].id);
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`rounded-md relative border-2 border-black bg-gray-800 overflow-hidden transform transition-transform duration-500 hover:bg-purple-800 ${
        animationState === "scaling" ? "scale-150" : ""
      } ${hasIcon ? "cursor-not-allowed" : "cursor-pointer"}`}
      aria-disabled={hasIcon}
      onClick={() => {
        if (!hasIcon) {
          handleClick();
        }
      }}
    >
      {hasIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            width={size}
            height={size}
            src={`https://noun.pics/${CalculateUuidToNumber(
              address ?? "",
            )}.jpg`}
            alt=""
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"></div>
      )}
      {animationState === "pulse" && (
        <div className="absolute inset-0 bg-yellow-800 opacity-0 animate-pulse"></div>
      )}
    </div>
  );
};
