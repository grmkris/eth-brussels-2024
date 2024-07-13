"use client";

import { GameArea } from "@/components/GameArea";
import { ConnectWallet } from "@/components/Profile";

export default function Home() {
  return (
    <main className="w-[100vw] h-[100vh] bg-gray-800">
      <ConnectWallet />
      <GameArea initialGridSize={22} initialZoomLevel={5} />
    </main>
  );
}
