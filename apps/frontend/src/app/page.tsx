"use client";
import { GameArea } from "@/components/GameArea";
import { usePlayPosition } from "../hooks/actions/usePlayPosition";

export default function Home() {
  const transfer = usePlayPosition();
  return (
    <main className="w-[100vw] h-[100vh] bg-black">
      <button
        onClick={() => {
          transfer.mutate({ position: "test" });
        }}
        className="fixed top-0 right-0 z-50 text-white"
      >
        GET SIGNATURE AND TRANSFER NATIVE
      </button>
      <GameArea initialGridSize={35} initialZoomLevel={5} />
    </main>
  );
}
