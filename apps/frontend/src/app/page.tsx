"use client";
import { GameArea } from "@/components/GameArea";
import { usePlayPosition } from "../hooks/actions/usePlayPosition";

export default function Home() {
  const transfer = usePlayPosition();
  return (
    <main className="w-[100vw] h-[100vh] bg-black">
      <GameArea initialGridSize={35} initialZoomLevel={5} />
    </main>
  );
}
