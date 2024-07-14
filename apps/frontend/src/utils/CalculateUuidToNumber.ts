export const CalculateUuidToNumber = (address: string) => {
  const strippedAddress = address.replace(/^0x/, "");
  const first16Chars = strippedAddress.slice(0, 16);
  const hexToNumber = parseInt(first16Chars, 16);
  const numberInRange = (hexToNumber % 99) + 1;
  
  return numberInRange;
};
