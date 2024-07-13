"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dynamic from "@/components/Dynamic";
import { useState } from "react";
import { ConnectWallet } from "@/components/Profile";
import { usePlayPosition } from "../hooks/actions/usePlayPosition";

export const App = (props: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSidebarOpen(!sidebarOpen);
  };

  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      sidebarOpen &&
      !document.getElementById("sidebar")?.contains(e.target as Node) &&
      !document.getElementById("open-sidebar")?.contains(e.target as Node)
    ) {
      setSidebarOpen(false);
    }
  };
  return (
    <Dynamic>
      <div className="w-fit fixed inset-0 z-10" onClick={handleClickOutside}>
        <div className="h-screen flex overflow-hidden bg-gray-200">
          <div
            id="sidebar"
            className={`z-20 absolute bg-gray-800 text-white w-[40vw] min-h-screen overflow-y-auto transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ease-in-out duration-300`}
          >
            <div className="p-4">
              <h1 className="text-2xl font-semibold">Sidebar</h1>
              <ul className="mt-4">
                <ConnectWallet />
              </ul>
            </div>
          </div>

          <div className="shadow w-fit fixed top-0 left-0 z-10">
            <button
              className="text-gray-500 hover:text-gray-600"
              id="open-sidebar"
              onClick={handleSidebarToggle}
            >
              <svg
                className="w-6 h-6"
                fill="#fff"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          {sidebarOpen && <div className="fixed inset-0 z-10" />}
          <div className={sidebarOpen ? "opacity-90" : ""}>
            {props.children}
          </div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </Dynamic>
  );
};
