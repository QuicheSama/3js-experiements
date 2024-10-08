import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	InstancedMesh,
	SphereGeometry,
	Object3D
} from 'three';

import type { Action } from 'svelte/action';

type RendererParams = {
	height: number;
	width: number;
	board: string[][];
	win: Array<[number, number]> | null;
	gameover: boolean;
};

const threeJsRenderer: Action<HTMLCanvasElement, RendererParams> = (canvasEl, params) => {
	const scene = new Scene();
	const camera = new PerspectiveCamera(75, params.width / params.height, 0.1, 1000);
	camera.position.z = 10;
	const renderer = new WebGLRenderer({ canvas: canvasEl });
	
	renderer.setSize(params.width, params.height);

	function animate() {
		renderer.render(scene, camera);
	}

	renderer.setAnimationLoop(animate);
	const boxGeometry = new BoxGeometry(1, 1, 1);
	const redMaterial = new MeshBasicMaterial({ color: 0xff0000 });
	const xMesh = new InstancedMesh(boxGeometry, redMaterial, 5);

	const sphereGeometry = new SphereGeometry(0.7);
	const blueMaterial = new MeshBasicMaterial({color: 0x0000ff})
	const oMesh = new InstancedMesh(sphereGeometry, blueMaterial, 5);

	const geometries = [boxGeometry, sphereGeometry]
	const materials = [redMaterial, blueMaterial];

	scene.add(xMesh);
	scene.add(oMesh);


	const renderBoard = (board: string[][]) => {
		console.table(board);
		const cursor = new Object3D();
		const xoIndices = [0, 0]
		
		board.forEach((row, rowIdx) => row.forEach((value, colIdx) => {
			cursor.position.x = 3 * colIdx - 3;
			cursor.position.y = -3 * rowIdx + 3;
			
			cursor.updateMatrix();
			if(value === 'x') {
				xMesh.setMatrixAt(xoIndices[0]++, cursor.matrix);
				console.log(cursor.position)
			}

			if(value === 'o') {
				oMesh.setMatrixAt(xoIndices[1]++, cursor.matrix)
				console.log(cursor.position)
			}
		}));

		for(let i = xoIndices[0]; i < 6; i++) {
			cursor.position.x = 0;
			cursor.position.y = 0;
			cursor.position.z = 20;
			cursor.updateMatrix();

			xMesh.setMatrixAt(i, cursor.matrix);
		}

		for(let i = xoIndices[1]; i < 6; i++) {
			cursor.position.x = 0;
			cursor.position.y = 0;
			cursor.position.z = 20;
			cursor.updateMatrix();

			oMesh.setMatrixAt(i, cursor.matrix);
		}

		xMesh.instanceMatrix.needsUpdate = true;
		xMesh.computeBoundingSphere();

		oMesh.instanceMatrix.needsUpdate = true;
		oMesh.computeBoundingSphere();
	}

	renderBoard(params.board);

	return {
		update: (updatedParams) => {
			const { width, height, board } = updatedParams;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			renderBoard(board)
		},
		destroy: () => {
			geometries.forEach(g => g.dispose());
			materials.forEach(m => m.dispose());

			renderer.dispose();
		}
	};
};

export default threeJsRenderer;
