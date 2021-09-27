<script lang="ts">
	import ColorDropper from '../svgs/ColorDropper.svelte';
	import FillBucket from '../svgs/FillBucket.svelte';
	import Pencil from '../svgs/Pencil.svelte';

	import { onMount } from 'svelte';
	import Modal from '../components/Modal.svelte';

	interface Tool {
		name: 'pencil' | 'select' | 'fill';
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let width: number = 800;
	let height: number = 800;
	let pixelNum: number = 16;
	let pixelArray: string[][] = new Array(pixelNum).fill(new Array(pixelNum).fill('#000000'));
	let pixelColor: string = '#ffffff';
	let isMouseDown: boolean = false;
	let tool: Tool = {
		name: 'pencil'
	};
	let isDownloadModalOpen: boolean = false;
	let img: string;

	$: {
		pixelArray = new Array(pixelNum).fill(new Array(pixelNum).fill('#000000'));
	}

	const drawCanvas = () => {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, width, height);
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
		img = canvas.toDataURL('image/png');
		isDownloadModalOpen = true;
	};

	onMount(() => {
		ctx = canvas.getContext('2d');
	});

	// ---- functions ----
	const pixelCanvasHandler = (e: MouseEvent) => {
		isMouseDown = true;
		const docListener = () => {
			isMouseDown = false;
			document.removeEventListener('mouseup', docListener);
		};
		document.addEventListener('mouseup', docListener);
	};
	const pixelMouseEnter = (y: number, x: number) => {
		if (!isMouseDown) return;
		if (tool.name === 'pencil') {
			let newArrIdx = [...pixelArray[y]];
			newArrIdx[x] = pixelColor;
			pixelArray[y] = newArrIdx;
			pixelArray = [...pixelArray];
		}
	};
	const pixelMouseDown = (y: number, x: number) => {
		if (tool.name === 'pencil') {
			// draw
			let newArrIdx = [...pixelArray[y]];
			newArrIdx[x] = pixelColor;
			pixelArray[y] = newArrIdx;
			pixelArray = [...pixelArray];
		} else if (tool.name === 'select') {
			// change color to current pixel color
			pixelColor = pixelArray[y][x];
			tool.name = 'pencil';
		} else if (tool.name === 'fill') {
			// recursively fill all pixels of the same color with current color
			const currentColor = pixelArray[y][x];
			let newArr = [...pixelArray].map((row) => [...row]);

			const fill = (y: number, x: number) => {
				if (y < 0 || y > pixelNum - 1 || x < 0 || x > pixelNum - 1) return;
				if (newArr[y][x] === pixelColor || newArr[y][x] !== currentColor) return;
				newArr[y][x] = pixelColor;
				fill(y - 1, x);
				fill(y + 1, x);
				fill(y, x - 1);
				fill(y, x + 1);
			};
			fill(y, x);
			pixelArray = [...newArr];
		}
	};
</script>

<div class="pixel-art-container">
	<canvas bind:this={canvas} {width} {height} style="display: none;" />
	<Modal bind:isOpen={isDownloadModalOpen}>
		<h4 slot="title">Download</h4>
		<div slot="content">
			<img class="download-img" src={img} alt="your art" />
			<a class="download-link" href={img} download="pixel-art.png">Download</a>
		</div>
	</Modal>
	<h1>Pixel art maker</h1>
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
		<label>Color <input bind:value={pixelColor} type="color" max="100" /></label>
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
	<div
		style="--select-color: {pixelColor}; --pixel-width: {width /
			pixelNum}px; --pixel-height: {height / pixelNum}px; width: {width}px; height: {height}px;"
		class="pixel-canvas"
		on:mousedown={pixelCanvasHandler}
	>
		{#each pixelArray as pixelXArray, y}
			<div class="row">
				{#each pixelXArray as pixel, x}
					<!-- {(console.log(y, x), '')} -->
					<div
						on:mouseenter={() => {
							pixelMouseEnter(y, x);
						}}
						on:mousedown={() => {
							pixelMouseDown(y, x);
						}}
						class="pixel"
						style="--pixel-color: {pixel};"
					/>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.tool-btn {
		background-color: white;
		border: 1px solid black;
		border-radius: 0.5rem;
		padding: 0.25rem;
		&.selected {
			filter: invert(1);
		}
	}
	.pixel-art-container {
		background-color: var(--bg);
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 1rem;
		box-shadow: 0 0.25rem 0.5rem 0.25rem #00000040;
	}
	.row {
		display: flex;
		flex-direction: row;
	}
	.pixel-canvas {
		.pixel {
			border: 2px solid var(--pixel-color);
			background-color: var(--pixel-color);
			width: var(--pixel-width);
			height: var(--pixel-height);
			&:hover {
				border-color: var(--select-color);
			}
		}
	}
	.download-img {
		width: 50vmin;
		height: 50vmin;
		@media screen and (max-width: 768px) {
			width: 90vmin;
			height: 90vmin;
		}
	}
	.download-link {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: var(--highlight);
		border-radius: 0.25rem;
		padding: 0.75rem;
		margin-top: 0.5rem;
		text-decoration: none;
		color: var(--contrast);
	}
</style>
