"use client";
import { GameArea } from "@/components/GameArea";

export default function Home() {
  return (
    <main className="w-[100vw] h-[100vh] bg-gray-800">
      <GameArea initialGridSize={10} initialZoomLevel={5} />
    </main>
  );
}
