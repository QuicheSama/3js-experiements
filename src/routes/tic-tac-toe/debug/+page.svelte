<script lang='ts'>
	import TicTacToeDebug from "../TicTacToeDebug.svelte";
	import { createBoardStore } from "$lib/stores/tic-tac-toe";

	const gameStore = createBoardStore();
</script>

<TicTacToeDebug {...gameStore} />
