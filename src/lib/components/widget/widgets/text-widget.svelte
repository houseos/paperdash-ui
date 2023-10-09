<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';

	type Options = {
		text: string;
	};

	export let options: Options;
</script>

<p>
	<SvelteMarkdown source={options.text || ''} />
</p>

<style>
</style>