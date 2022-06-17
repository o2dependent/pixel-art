<script lang="ts">
	import ColorDropper from '../svgs/ColorDropper.svelte';
	import FillBucket from '../svgs/FillBucket.svelte';
	import Pencil from '../svgs/Pencil.svelte';

	import { onMount } from 'svelte';

	interface Tool {
		name: 'pencil' | 'select' | 'fill';
		color: string;
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let width: number = 800;
	let height: number = 800;
	let pixelNum: number = 32;
	let pixelArray: string[][] = new Array(pixelNum).fill(new Array(pixelNum).fill('#000000'));
	let isMouseDown: boolean = false;
	let tool: Tool = {
		name: 'pencil',
		color: '#ffffff'
	};

	$: {
		pixelArray = new Array(pixelNum).fill(new Array(pixelNum).fill('#000000'));
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		const drawCanvas = () => {
			// > Draw a grid of rectangles
			for (let i = 0; i < pixelNum; i++) {
				for (let j = 0; j < pixelNum; j++) {
					ctx.fillStyle = pixelArray[j][i];
					ctx.fillRect(
						i * (width / pixelNum),
						j * (height / pixelNum),
						width / pixelNum,
						height / pixelNum
					);
				}
			}
			requestAnimationFrame(drawCanvas);
		};
		requestAnimationFrame(drawCanvas);

		const pixelMouseDown = (y: number, x: number) => {
			if (tool.name === 'pencil') {
				// draw
				let newArrIdx = [...pixelArray[y]];
				newArrIdx[x] = tool.color;
				pixelArray[y] = newArrIdx;
				pixelArray = [...pixelArray];
			} else if (tool.name === 'select') {
				// change color to current pixel color
				tool.color = pixelArray[y][x];
				tool.name = 'pencil';
			} else if (tool.name === 'fill') {
				// recursively fill all pixels of the same color with current color
				const currentColor = pixelArray[y][x];
				let newArr = [...pixelArray].map((row) => [...row]);

				const fill = (y: number, x: number) => {
					if (y < 0 || y > pixelNum - 1 || x < 0 || x > pixelNum - 1) return;
					if (newArr[y][x] === tool.color || newArr[y][x] !== currentColor) return;
					newArr[y][x] = tool.color;
					fill(y - 1, x);
					fill(y + 1, x);
					fill(y, x - 1);
					fill(y, x + 1);
				};
				fill(y, x);
				pixelArray = [...newArr];
			}
		};

		// > Add event listeners
		canvas.addEventListener('mousedown', (e: MouseEvent) => {
			isMouseDown = true;
			const docListener = () => {
				isMouseDown = false;
				document.removeEventListener('mouseup', docListener);
			};
			document.addEventListener('mouseup', docListener);
		});

		canvas.addEventListener('mousemove', (e: MouseEvent) => {
			if (isMouseDown) {
				const x = Math.floor(e.offsetX / (width / pixelNum));
				const y = Math.floor(e.offsetY / (height / pixelNum));
				pixelMouseDown(y, x);
			}
		});

		canvas.addEventListener('mouseleave', (e: MouseEvent) => {
			isMouseDown = false;
		});

		canvas.addEventListener('mouseenter', (e: MouseEvent) => {
			isMouseDown = false;
		});

		canvas.addEventListener('mouseup', (e: MouseEvent) => {
			isMouseDown = false;
		});

		canvas.addEventListener('mouseout', (e: MouseEvent) => {
			isMouseDown = false;
		});
	});
</script>

<div>
	<label for="pixelNum"
		>Size
		<select name="pixelNum" id="pixelNum" bind:value={pixelNum}>
			<option value={16}>16x16</option>
			<option value={32}>32x32</option>
			<option value={64}>64x64</option>
		</select>
	</label>
	<label>Width <input bind:value={width} type="number" /></label>
	<label>Height <input bind:value={height} type="number" /></label>
	<label>Color <input bind:value={tool.color} type="color" max="100" /></label>
	<button
		class="tool-btn {tool.name === 'pencil' ? 'selected' : ''}"
		on:click={() => (tool.name = 'pencil')}><Pencil /></button
	>
	<button
		class="tool-btn {tool.name === 'select' ? 'selected' : ''}"
		on:click={() => (tool.name = 'select')}><ColorDropper /></button
	>
	<button
		class="tool-btn {tool.name === 'fill' ? 'selected' : ''}"
		on:click={() => (tool.name = 'fill')}><FillBucket /></button
	>
	<button on:click={() => drawCanvas()}>Draw canvas</button>
</div>
<canvas bind:this={canvas} {width} {height} />
