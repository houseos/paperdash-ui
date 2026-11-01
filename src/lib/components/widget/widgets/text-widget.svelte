<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';
	import { marked } from 'marked';

	type Options = {
		text: string;
	};

	export let options: Options;
</script>

{@html DOMPurify.sanitize(String(marked.parse(options.text || '', { async: false })))}

<style>
</style>
