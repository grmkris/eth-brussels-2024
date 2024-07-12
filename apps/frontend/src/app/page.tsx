"use client";

import { GameArea } from "@/components/GameArea";
import { ConnectWallet } from "@/components/Profile";

export default function Home() {
  return (
    <main className="w-[100vw] h-[100vh] bg-gray-700">
      <ConnectWallet />
      <GameArea initialGridSize={10} initialZoomLevel={5} />
    </main>
  );
}
