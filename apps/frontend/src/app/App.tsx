"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dynamic from "@/components/Dynamic";

export const App = (props: { children: React.ReactNode }) => {
  return (
    <Dynamic>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </Dynamic>
  );
};
