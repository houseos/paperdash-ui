<script lang="ts">
	type Options = {
		username: string;
		text: string;
	};

	export let options: Options;
</script>

<p>
	<strong>Moin, willkommen bei {options.username}!</strong>
	<br />
	{options.text}
</p>
