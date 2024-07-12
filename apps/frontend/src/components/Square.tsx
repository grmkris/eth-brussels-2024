import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
export const Square = ({ id, size }: { id: number; size: number }) => {
  const [hasIcon, setHasIcon] = useState(false);
  const [animationState, setAnimationState] = useState<
    "none" | "scaling" | "pulse"
  >("none");

  useEffect(() => {
    if (hasIcon) {
      setAnimationState("scaling");
      setTimeout(() => {
        setAnimationState("pulse");
        setTimeout(() => {
          setAnimationState("none");
        }, 1650);
      }, 0);
    }
  }, [hasIcon]);

  const handleClick = () => {
    setHasIcon(!hasIcon);
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`cursor-pointer relative border border-primary-100 overflow-hidden transform transition-transform duration-500 ${
        animationState === "scaling" ? "scale-150" : ""
      }`}
      onClick={handleClick}
    >
      {hasIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Hashicon value={`${id}`} size={size - 20} />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"></div>
      )}
      {animationState === "pulse" && (
        <div className="absolute inset-0 bg-yellow-500 opacity-0 animate-pulse"></div>
      )}
    </div>
  );
};
