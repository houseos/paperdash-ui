<script lang="ts">
	import type { WidgetType } from '$lib/components/widget/widget-types';
	import Widget from '$lib/components/widget/widget.svelte';
	import dayjs from 'dayjs';

	export let widgets: WidgetType[] = ['welcome', 'weather', 'srs', 'joke'];
</script>

<div class="header">
	<h1>paperdash</h1>
	<span class="time">{dayjs().format('HH:mm')}</span>
</div>
<hr />

<div class="widgets">
	{#each widgets as widget}
		<Widget {widget} />
	{/each}
</div>

<style lang="scss">
	h1 {
		color: red;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		width: 100%;
		padding: 0px 50px;

		.time {
			font-size: 50px;
		}
	}

	.widgets {
		display: grid;
		height: 100%;
		padding: 10px;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 10px;
	}
</style>
