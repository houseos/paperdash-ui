<script lang="ts">
	import type { WidgetConfig } from '$lib/components/widget/widget-types';
	import Widget from '$lib/components/widget/widget.svelte';
	import dayjs from 'dayjs';
	import { page } from '$app/stores';

	let widgets: WidgetConfig[] = [];

	try {
		const rawWidgetsConfig: any[] = JSON.parse($page.url.searchParams.get('widgets')!);

		rawWidgetsConfig.forEach((widget) => {
			const options: any = {};
			widget.options.forEach((option: any) => (options[option.id] = option.value));

			widgets.push({
				id: widget.id,
				options
			});
		});
	} catch (error) {}

	if (widgets.length === 0) {
		widgets = [
			{
				id: 'welcome',
				options: {
					username: 'User',
				}
			},
			{
				id: 'weather'
			},
			{
				id: 'srs',
				options: {
					location: 24900,
				}
			},
			{
				id: 'joke'
			}
		];
		console.log('used default config');
	}

	console.log(widgets);
</script>

<div class="header">
	<h1>paperdash</h1>
	<span class="time">{dayjs().format('HH:mm')}</span>
</div>
<hr />

<div class="widgets">
	{#each widgets as widget}
		<Widget widget={widget.id} options={widget.options} />
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
			font-size: 30px;
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
