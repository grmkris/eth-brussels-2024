"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dynamic from "@/components/Dynamic";
import { useState } from "react";
import { Menu } from "@/components/Menu";

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
          <Menu sidebarOpen={sidebarOpen} />

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
