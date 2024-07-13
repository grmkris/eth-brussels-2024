import React from "react";
import { PlayersOutput } from "@/schemas/playerSchemas";
import { useCreateGame } from "@/hooks/games/useCreateGame";
import { Spinner } from "@/components/Spinner";

export const WinnerModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  player?: PlayersOutput;
}) => {
  const createNewGame = useCreateGame({
    onSuccess: () => {
      props.onClose();
    },
  });
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] p-2">
        <button
          onClick={props.onClose}
          className="focus:outline-none text-black px-1 hover:opacity-60"
        >
          X
        </button>
        <div>
          <p className="text-black">Winner: {props.player?.address}</p>
          <div className="flex gap-4 items-center justify-center">
            <button className="bg-blue-500 p-3 rounded-md">Claim</button>
            <button
              onClick={() => {
                createNewGame.mutate();
              }}
              className="bg-blue-400 p-3 rounded-md min-w-[158px] mx-auto"
            >
              {createNewGame.isPending ? <Spinner /> : "Start a new game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
