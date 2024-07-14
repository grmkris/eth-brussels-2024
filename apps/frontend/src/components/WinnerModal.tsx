import React from "react";
import { PlayersOutput } from "@/schemas/playerSchemas";

export const WinnerModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  player?: PlayersOutput;
}) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] p-4 bg-fireworks">
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="animate-rainbow font-bold text-xl">Winner</p>
          <p className="text-gray-500 pb-5">{props.player?.address}</p>
          <button
            onClick={props.onClose}
            className="bg-blue-500 p-3 rounded-md w-full"
          >
            Receive prize
          </button>
        </div>
      </div>
    </div>
  );
};
