import { derived, get, readonly, writable } from "svelte/store";

const TileState = {
    Unclaimed: '_',
    Claimed_X: 'x',
    Claimed_O: 'o'
} as const;

const WinState = {
    Incomplete: 'INCOMPLETE',
    X_wins: 'X_WINS',
    O_wins: 'O_WINS',
    Draw: 'DRAW'
}

type TileStateType = typeof TileState[keyof typeof TileState];
type WinStateType = typeof WinState[keyof typeof WinState];

/**
 * array indices, [row, col]
 */
type TilePosition = [number, number];
const DEFAULT_SIDE_LENGTH = 3;
const newBoard = (sideLength: number): TileStateType[][] => Array(sideLength).fill('').map(() => Array(sideLength).fill(TileState.Unclaimed));

function createBoardStore() {
    const board = writable<TileStateType[][]>(newBoard(DEFAULT_SIDE_LENGTH));
    const turn = writable(0);
    const selectedTile = writable<TilePosition | null>(null);

    const currentPlayer = derived(turn, ($turn) => {
        return ($turn % 2 === 1) ? TileState.Claimed_O : TileState.Claimed_X
    });

    const validatedSelection = derived(
        [board, selectedTile], 
        ([$board, $selectedTile]) => {
            if($selectedTile == null) {
                console.error('Error: no position provided, please `selectTile` before `updateBoard`.');
                return null;
            }

            const [row, col] = $selectedTile;
            if($board[row][col] == null) {
                console.error(`Error: tile indices out of bounds - recieved [${row}, ${col}]`)
                return null;
            }
            if($board[row][col] !== TileState.Unclaimed) {
                console.error(`Error: selected tile state is ${$board[row][col]}, please select unclaimed tile.`);
                return null;
            }

            return [row, col];
        }
    );
    
    validatedSelection.subscribe((selection) => {
        if(selection == null) {
            return;
        }

        const emblem = get(currentPlayer)
        const [row, col] = selection;
        board.update(
            (board) => {
                board[row][col] = emblem;
                return board;
            }
        );
        turn.update((n) => n + 1);
    });

    return {
        board: readonly(board),
        turn: readonly(turn),
        currentPlayer: readonly(currentPlayer),
        selectTile: (position: TilePosition) => selectedTile.set(position),
        reset: () => {
            turn.set(0);
            board.set(newBoard(DEFAULT_SIDE_LENGTH));
            selectedTile.set(null);
        },
    }
}

export { TileState, WinState, createBoardStore }
export type { TileStateType, WinStateType, TilePosition };