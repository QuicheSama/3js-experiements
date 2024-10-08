<script lang="ts">
	import threeJsRenderer from '$lib/actions/renderer';
	import { onMount } from 'svelte';
	import { createBoardStore } from '$lib/stores/tic-tac-toe';
	import TicTacToeDebug from './TicTacToeDebug.svelte';
	let height: number = 500;
	let width: number = 500;
	const gameStore = createBoardStore();
	const { board, win, gameover } = gameStore;
	onMount(() => {
		// const handleResize = () => {
		// 	height = window.innerHeight;
		// 	width = window.innerWidth;
		// };
		// handleResize();

		// window.addEventListener('resize', handleResize);
		// return () => {
		// 	window.removeEventListener('resize', handleResize);
		// };
	});
</script>

<div>
	<TicTacToeDebug {...gameStore}/>
	<canvas {height} {width} use:threeJsRenderer={{ height, width, board: $board, win: $win, gameover: $gameover }} />	
</div>

<style>
	/* canvas {
		position: fixed;
		top: 0;
		left: 0;
		outline: none;
	} */
</style>
