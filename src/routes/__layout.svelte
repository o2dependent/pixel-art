<script>
	import '../app.scss';
</script>

<main>
	<slot />
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
