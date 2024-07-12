import React from "react";

export const Square = ({
  id,
  size,
  onLoad,
}: {
  id: number;
  size: number;
  onLoad: (id: number) => void;
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "blue",
      }}
    >
      {id}
    </div>
  );
};
