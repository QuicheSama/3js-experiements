<script lang="ts">
	import threeJsRenderer from "$lib/actions/renderer";
	import { onMount } from "svelte";
    import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

    let canvasEl: HTMLCanvasElement | null = null;
    let height: number = 0;
    let width: number = 0;
    
    onMount(() => {
        const handleResize = () => {
            height = window.innerHeight;
            width = window.innerWidth;
        }
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });

</script>

<canvas bind:this={canvasEl} height={height} width={width} use:threeJsRenderer={{height, width}}/>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        outline: none;
    }
</style>
