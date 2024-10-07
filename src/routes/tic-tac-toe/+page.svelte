<script lang="ts">
    import { createBoardStore } from "$lib/stores/tic-tac-toe";

    const { board, turn, currentPlayer, selectTile } = createBoardStore();

</script>

<div>
    <div>
        turn: {$turn}, {$currentPlayer}'s move
    </div>
    <table>
        <tbody>
            {#each $board as row, rowIdx}
                <tr>
                    {#each row as cell, colIdx}
                        <td>
                            <button on:click={() => selectTile([rowIdx, colIdx])}>{cell}</button>
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>    
</div>
