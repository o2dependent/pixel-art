<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clickOutside } from '../actions/clickOutside';
	import CloseIcon from '../svgs/CloseIcon.svelte';
	export let isOpen: boolean = false;
</script>

{#if isOpen}
	<div class="modal">
		<div transition:fade={{ duration: 400 }} class="bg" />
		<div
			transition:fade={{ duration: 300 }}
			use:clickOutside={() => {
				isOpen = false;
			}}
			class="body"
		>
			<div class="header">
				<slot name="title" />
				<button title="Close" class="close" on:click={() => (isOpen = false)}><CloseIcon /></button>
			</div>
			<hr />
			<div class="content">
				<slot name="content" />
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(2px);
			z-index: -1;
		}

		.body {
			width: 100%;
			max-width: fit-content;

			margin: 0.5rem;
			max-height: 100%;
			border-radius: 0.5rem;
			border: 1px solid var(--border-color);
			background-color: var(--bg-accent);
			display: grid;
			grid-template-rows: auto auto auto;
			gap: 0.5rem;
			padding: 1rem;

			.header {
				font-size: var(--font-size-5);
				font-weight: 500;
				display: flex;
				justify-content: space-between;

				button {
					border: none;
					background: none;
					cursor: pointer;
				}
			}

			.content {
			}
		}
	}

	hr {
		border: none;
		border-bottom: 1px solid var(--border-color);
	}
</style>
