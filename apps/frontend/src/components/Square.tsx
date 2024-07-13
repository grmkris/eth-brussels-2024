import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import Image from "next/image";
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
  function uuidToNumberInRange(uuidStr: string) {
    // Remove hyphens from UUID string
    const strippedUUID = uuidStr.replace(/-/g, "");

    // Take the first 16 characters of the stripped UUID
    const first16Chars = strippedUUID.slice(0, 16);

    // Convert hexadecimal string to a number
    const hexToNumber = parseInt(first16Chars, 16);

    // Map the number to the range 1 to 99
    const numberInRange = (hexToNumber % 99) + 1;

    return numberInRange;
  }
  //
  // // Example usage:
  const exampleUUID = crypto.randomUUID();
  //   const numberInRange = uuidToNumberInRange(exampleUUID);
  //   console.log(`UUID '${exampleUUID}' converts to number in range 1 to 99: ${numberInRange}`);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`cursor-pointer rounded-md relative border-2 border-black bg-gray-800 overflow-hidden transform transition-transform duration-500 ${
        animationState === "scaling" ? "scale-150" : ""
      }`}
      onClick={handleClick}
    >
      {hasIcon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {/*<Hashicon value={`${id}`} size={size - 20} />*/}
          <Image
            width={size}
            height={size}
            src={`https://noun.pics/${uuidToNumberInRange(exampleUUID)}.jpg`}
            alt=""
          />
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
