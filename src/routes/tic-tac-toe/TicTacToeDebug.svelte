<script lang="ts">
	import type { TicTacToeBoardStore } from "$lib/stores/tic-tac-toe";

    export let board: TicTacToeBoardStore['board'];
    export let turn: TicTacToeBoardStore['turn'];
    export let currentPlayer: TicTacToeBoardStore['currentPlayer'];
    export let win: TicTacToeBoardStore['win'];
    export let gameover: TicTacToeBoardStore['gameover'];
    export let selectTile: TicTacToeBoardStore['selectTile'];
    export let nextTurn: TicTacToeBoardStore['nextTurn'];
    export let reset: TicTacToeBoardStore['reset'];
</script>

<div>
	<div>
		turn: {$turn}, {$currentPlayer}'s move
	</div>
	<table>
		<tbody>
			{#each $board as row, rowIdx (`${rowIdx},${row.join('-')}`)}
				<tr>
					{#each row as cell, colIdx (`${cell}@${rowIdx},${colIdx}`)}
						<td 
							class:orange={$gameover && $win == null}
							class:green={$win?.some(([row, col]) => row === rowIdx && col === colIdx)}
						>
							<button
								on:click={() => {
									selectTile([rowIdx, colIdx]);
									nextTurn();
								}}>{cell}</button
							>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<div >
		<button on:click={reset}>reset</button>
		<div 
			class:hidden={!$gameover}
			class:green={$gameover && $win !== null}
			class:orange={$gameover && $win === null}
		>
			{$win == null ? 'Draw' : `${$currentPlayer} wins!`}, Game Over.
		</div>
	</div>
</div>

<style>
	.green {
		background-color: green;
	}
	
	.orange {
		background-color: orange;
	}

	.hidden {
		visibility: hidden;
	}
</style>
