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
        <h1 className="text-2xl font-semibold">Sidebar</h1>
        <ul className="p-4 flex flex-col gap-4">
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
            className="bg-blue-400"
          >
            Start a new game
          </button>
          <div className="flex flex-col gap-2"></div>
        </ul>
      </div>
    </div>
  );
};
