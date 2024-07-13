export const CalculateUuidToNumber = (uuid: string) => {
  const strippedUUID = uuid.replace(/-/g, "");
  const first16Chars = strippedUUID.slice(0, 16);
  const hexToNumber = parseInt(first16Chars, 16);
  const numberInRange = (hexToNumber % 99) + 1;
  return numberInRange;
};
