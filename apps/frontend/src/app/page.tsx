"use client";
import { GameArea } from "@/components/GameArea";

export default function Home() {
  return (
    <main className="w-[100vw] h-[100vh] bg-black">
      <GameArea initialGridSize={35} initialZoomLevel={5} />
    </main>
  );
}
