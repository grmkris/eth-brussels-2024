import React, { useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
export const Square = ({ id, size }: { id: number; size: number }) => {
  const [hasIcon, setHasIcon] = useState(false);
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "blue",
      }}
      className="cursor-pointer"
      onClick={() => {
        setHasIcon(!hasIcon);
      }}
    >
      {hasIcon ? <Hashicon value={`${id}`} size={size} /> : id}
    </div>
  );
};
