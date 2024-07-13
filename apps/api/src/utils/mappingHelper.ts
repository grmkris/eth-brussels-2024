import { SelectMovesWithAddress } from "../db/movesStorage.db";

export function create2DArray(
  rows: number, cols: number
): { playerAddress: string | null }[][] {
  let array = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push({ playerAddress: null });
    }
    array.push(row);
  }
  return array;
;}


export function applyMoves(array2D: {
    playerAddress: string | null}[][],
    moves: SelectMovesWithAddress[]) 
    {
    for (let move of moves) {
      const { xCoordinate, yCoordinate, playerAddress } = move;
      if (xCoordinate >= 0 && xCoordinate < array2D.length && yCoordinate >= 0 && yCoordinate < array2D[0].length) {
        array2D[xCoordinate][yCoordinate].playerAddress = playerAddress;
      } else {
        console.error(`Move out of bounds: (${xCoordinate}, ${yCoordinate})`);
      }
    }
  }