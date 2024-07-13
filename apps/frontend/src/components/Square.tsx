import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import Image from "next/image";
import {useGetGames} from "@/hooks/games/useGetGames";
import {useGetPlayer} from "@/hooks/player/useGetPlayer";
import {useCreateMove} from "@/hooks/moves/useCreateMove";
import { CalculateUuidToNumber } from "@/utils/CalculateUuidToNumber";
import { PlayersOutput } from "@/schemas/playerSchemas";
export const Square = ({
  id,
  size,
  row,
  column,
  player,
}: {
  id: number;
  size: number;
  row: number;
  column: number;
  player?: PlayersOutput;
}) => {
  const [hasIcon, setHasIcon] = useState(false);
  const [animationState, setAnimationState] = useState<
    "none" | "scaling" | "pulse"
  >("none");
  const { refetch } = useGetPlayer();
  const move = useCreateMove({
    onSuccess: () => {
      refetch();
      console.log("SUCCESS");
    },
  });
  const getGames = useGetGames();

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

  const handleClick = () => {
    setHasIcon(true);
    console.log(player?.id, getGames.data?.[getGames.data.length - 1].id);
    if (
      player?.id &&
      getGames.data?.[getGames.data.length - 1].id &&
      row &&
      column
    ) {
      move.mutate({
        playerId: player?.id ?? "",
        gameId: getGames.data?.[getGames.data.length - 1].id ?? "",
        yCoordinate: row,
        xCoordinate: column,
      });
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
      className={`cursor-pointer rounded-md relative border-2 border-black bg-gray-800 overflow-hidden transform transition-transform duration-500 ${
        animationState === "scaling" ? "scale-150" : ""
      }`}
      onClick={handleClick}
    >
      {hasIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            width={size}
            height={size}
            src={`https://noun.pics/${CalculateUuidToNumber(
              player?.id ?? "",
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
