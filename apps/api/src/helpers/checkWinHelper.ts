import { SelectMove } from "../db/movesStorage.db";

export function checkWin(playerMoves: SelectMove[]) {
    // Create sets for easy checking of moves
    const movesSet = new Set(playerMoves.map(move => `${move.xCoordinate},${move.yCoordinate}`));

    // Check for three in a row
    for (const move of playerMoves) {
        const { xCoordinate: x, yCoordinate: y } = move;

        // Check horizontal win
        if (
            movesSet.has(`${x},${y}`) &&
            movesSet.has(`${x+1},${y}`) &&
            movesSet.has(`${x+2},${y}`)
        ) {
            return true;
        }

        // Check vertical win
        if (
            movesSet.has(`${x},${y}`) &&
            movesSet.has(`${x},${y+1}`) &&
            movesSet.has(`${x},${y+2}`)
        ) {
            return true;
        }

        // Check diagonal win (top-left to bottom-right)
        if (
            movesSet.has(`${x},${y}`) &&
            movesSet.has(`${x+1},${y+1}`) &&
            movesSet.has(`${x+2},${y+2}`)
        ) {
            return true;
        }

        // Check diagonal win (top-right to bottom-left)
        if (
            movesSet.has(`${x},${y}`) &&
            movesSet.has(`${x-1},${y+1}`) &&
            movesSet.has(`${x-2},${y+2}`)
        ) {
            return true;
        }
    }

    // If no win found
    return false;
}