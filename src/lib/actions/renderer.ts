import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';


import type { Action } from "svelte/action";

type RendererParams = {
    height: number;
    width: number
}

const threeJsRenderer: Action<HTMLCanvasElement, RendererParams> = (canvasEl, params) => {  
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, params.width/params.height, 0.1, 1000);
    camera.position.z = 5;
    const renderer  = new WebGLRenderer({canvas: canvasEl});

    renderer.setSize(params.width, params.height);

    function animate() {
        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({color: 0xff0000});
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    return {
        update: (updatedParams) => {
            const { width, height } = updatedParams;

            camera.aspect = width/height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        },
        destroy: () => {
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        }
    }
}

export default threeJsRenderer;