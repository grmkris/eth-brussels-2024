import { ConnectWallet } from "@/components/Profile";
import { useCreateGame } from "@/hooks/games/useCreateGame";
import { useGetGames } from "@/hooks/games/useGetGames";

export const Menu = (props: {
  sidebarOpen?: boolean;
  setSidebarOpen?: (val: boolean) => void;
}) => {
  const createNewGame = useCreateGame();
  const getGames = useGetGames();

  return (
    <div
      id="sidebar"
      className={`z-20 absolute bg-gray-800 text-white w-[40vw] min-h-screen overflow-y-auto transition-transform transform ${
        props.sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ease-in-out duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="#000"
              stroke-linejoin="round"
              stroke-width="4"
            >
              <path fill="#2F88FF" d="M44 28H28V44H44V28Z" />
              <path fill="#2F88FF" d="M13 4L22 20H4L13 4Z" />
              <path
                fill="#2F88FF"
                d="M36 20C40.4183 20 44 16.4183 44 12C44 7.58172 40.4183 4 36 4C31.5817 4 28 7.58172 28 12C28 16.4183 31.5817 20 36 20Z"
              />
              <path stroke-linecap="round" d="M4 28L20 44" />
              <path stroke-linecap="round" d="M20 28L4 44" />
            </g>
          </svg>
          <h1 className="text-2xl font-semibold">
            <span className="animate-rainbow">Tic Tac Toe 4ever</span>
          </h1>
        </div>

        <ul className="flex flex-col gap-4 pt-4">
          <ConnectWallet />
          <button
            disabled={
              !getGames.data?.[getGames.data.length - 1]?.winnerId &&
              getGames.data?.length !== 0
            }
            onClick={() => {
              createNewGame.mutate();
              props.setSidebarOpen?.(false);
            }}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-purple-700 font-bold py-2 px-4 rounded-md h-10 cursor-pointer"
          >
            <p className="animate-customRainbow">Start a new game</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 animate-customRainbow"
              viewBox="0 0 24 24"
            >
              <path
                fill="animate-customRainbow"
                d="m12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
              />
            </svg>
          </button>
          <div className="flex flex-col gap-2"></div>
        </ul>
      </div>
    </div>
  );
};
