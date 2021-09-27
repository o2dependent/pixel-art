<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let x = 10;
	let y = 10;
	let xDir = 0;
	let yDir = 0;
	let movementSpeed = 2;
	let caracterSize = 10;

	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.arc(x, y, caracterSize, 0, Math.PI * 2);
		ctx.fill();
		const newx = x + xDir * movementSpeed;
		if (!(newx > canvas.width - caracterSize || newx < caracterSize)) {
			x = newx;
		} else {
			console.log('cannot move x');
		}
		const newy = y + yDir * movementSpeed;
		if (!(newy > canvas.height - caracterSize || newy < caracterSize)) {
			y = newy;
		} else {
			console.log('cannot move y');
		}
		ctx.closePath();
		requestAnimationFrame(draw);
	};

	onMount(() => {
		ctx = canvas.getContext('2d');

		document.addEventListener('keydown', (e) => {
			console.log(e.key.toLowerCase());
			switch (e.key.toLowerCase()) {
				// > direction events
				case 'ArrowUp':
				case 'w':
					yDir = -1;
					break;
				case 'ArrowDown':
				case 's':
					yDir = 1;
					break;
				case 'ArrowLeft':
				case 'a':
					xDir = -1;
					break;
				case 'ArrowRight':
				case 'd':
					xDir = 1;
					break;
				// > movement speed
				case 'shift':
					movementSpeed = 4;
					break;
				// > attack events
				case ' ':
					console.log('space');
					break;
				default:
					yDir = 0;
					xDir = 0;
					break;
			}
		});

		document.addEventListener('keyup', (e) => {
			console.log(e.key.toLowerCase());
			switch (e.key.toLowerCase()) {
				case 's':
				case 'w':
					yDir = 0;
					break;
				case 'd':
				case 'a':
					xDir = 0;
					break;
				case 'shift':
					movementSpeed = 2;
				default:
					break;
			}
		});

		requestAnimationFrame(draw);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<canvas bind:this={canvas} width="800" height="800" id="canvas" />

<style lang="scss">
</style>
