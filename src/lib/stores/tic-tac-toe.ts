import { derived, get, readonly, writable } from 'svelte/store';

const TileState = {
	Unclaimed: '_',
	Claimed_X: 'x',
	Claimed_O: 'o'
} as const;

type TileStateType = (typeof TileState)[keyof typeof TileState];

/**
 * array indices, [row, col]
 */
type TilePosition = [number, number];

const DEFAULT_SIDE_LENGTH = 3;

// prettier-ignore
const possibleWinningPositions: TilePosition[][] = [
    // rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    // columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    // diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
]

const newBoard = (sideLength: number): TileStateType[][] =>
	Array(sideLength)
		.fill('')
		.map(() => Array(sideLength).fill(TileState.Unclaimed));

const deepCopyArray2D = <T>(arr: T[][]) => arr.map((row) => row.slice());

function createBoardStore() {
	const board = writable<TileStateType[][]>(newBoard(DEFAULT_SIDE_LENGTH));
	const turn = writable(0);
	const selectedTile = writable<TilePosition | null>(null);
	const win = writable<TilePosition[] | null>(null);

	const currentPlayer = derived(turn, ($turn) => {
		return $turn % 2 === 1 ? TileState.Claimed_O : TileState.Claimed_X;
	});

	const gameover = derived([turn, win], ([$turn, $win]) => {
		return $turn >= 9 || $win !== null;
	});

	selectedTile.subscribe((selection) => {
		if (selection == null) {
			return;
		}

		const emblem = get(currentPlayer);
		const [row, col] = selection;
		board.update((board) => {
			const updated = deepCopyArray2D(board);
			updated[row][col] = emblem;
			return updated;
		});
	});

	board.subscribe((currentBoard) => {
		for (const positions of possibleWinningPositions) {
			if (positions.every(([row, col]) => currentBoard[row][col] === get(currentPlayer))) {
				win.set(positions);
				return;
			}
		}
	});

	return {
		board: readonly(board),
		turn: readonly(turn),
		currentPlayer: readonly(currentPlayer),
		win: readonly(win),
		gameover: readonly(gameover),
		selectTile: (position: TilePosition) => {
			if (get(gameover)) {
				console.log('Game over, please reset game store.');
				return;
			}
			if (position == null) {
				console.error('Error: no position provided, please `selectTile` before `updateBoard`.');
				return null;
			}

			const [row, col] = position;
			const currentBoard = get(board);

			if (currentBoard[row][col] == null) {
				console.error(`Error: tile indices out of bounds - recieved [${row}, ${col}]`);
				return null;
			}
			if (currentBoard[row][col] !== TileState.Unclaimed) {
				console.error(
					`Error: selected tile state is ${currentBoard[row][col]}, please select unclaimed tile.`
				);
				return null;
			}

			selectedTile.set(position);
		},
		nextTurn: () => {
			if (get(gameover)) {
				return;
			}
			turn.update((n) => n + 1);
		},
		reset: () => {
			win.set(null);
			selectedTile.set(null);
			turn.set(0);
			board.set(newBoard(DEFAULT_SIDE_LENGTH));
		}
	};
}

type TicTacToeBoardStore = ReturnType<typeof createBoardStore>;

export { createBoardStore };
export type { TilePosition, TicTacToeBoardStore };
