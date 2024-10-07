<script lang="ts">
    import { createBoardStore } from "$lib/stores/tic-tac-toe";

    const { board, turn, currentPlayer, win, selectTile, nextTurn, reset } = createBoardStore();

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
                        <td class:green={$win?.some(([row, col]) => (row === rowIdx && col === colIdx))}>
                            <button 
                                on:click={
                                    () => {
                                        selectTile([rowIdx, colIdx]);
                                        nextTurn();
                                    }
                                }
                            >{cell}</button>
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
    <div class:green={$win !== null}>
        <button on:click={reset}>reset</button> {$win == null ? '' : `${$currentPlayer} wins!`}
    </div>    
</div>

<style>
    .green {
        background-color: green;
    }
</style>
