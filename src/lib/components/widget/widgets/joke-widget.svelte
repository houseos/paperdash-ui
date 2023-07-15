<script lang="ts">
	type Options = {};

	export let options: Options;

	function loadJoke(): Promise<string> {
		return fetch('https://v2.jokeapi.dev/joke/Programming?format=txt').then((res) => res.text());
	}
</script>

{#await loadJoke() then joke}
	<p>{joke}</p>
{/await}

<style>
	p {
		white-space: pre-wrap;
	}
</style>
