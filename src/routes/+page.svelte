<script lang="ts">
	import { WIDGET_TYPES, type WidgetConfig } from '$lib/components/widget/widget-types';
	import Widget from '$lib/components/widget/widget.svelte';
	import dayjs from 'dayjs';
	import { page } from '$app/stores';

	type RawOption = { id: string; value: string };
	type RawWidget = { id: string; options?: RawOption[] };
	let widgets: WidgetConfig[] = [];

	try {
		const rawWidgetsConfig = JSON.parse(
			$page.url.searchParams.get('widgets') ?? '[]'
		) as RawWidget[];

		rawWidgetsConfig.forEach((widget) => {
			const id = WIDGET_TYPES.find((type) => type === widget.id);
			if (!id) return;
			const options: Record<string, string> = {};
			widget.options?.forEach((option) => (options[option.id] = option.value));

			widgets.push({
				id,
				options
			});
		});
	} catch {
		widgets = [];
	}

	if (widgets.length === 0) {
		widgets = [
			{
				id: 'text',
				options: {
					text: '# Today\nA little room for the things worth remembering.'
				}
			},
			{
				id: 'weather'
			},
			{
				id: 'srs',
				options: {
					location: 24900
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

<main class="dashboard">
	<header class="header">
		<div class="brand">
			<span class="brand-mark"></span>
			<h1>paperdash</h1>
		</div>
		<div class="date">
			<span>{dayjs().format('dddd, D MMMM YYYY')}</span><strong>{dayjs().format('HH:mm')}</strong>
		</div>
	</header>
	<div class="rule">
		<span>YOUR DAY, IN VIEW</span><span class="rule-line"></span><span>NO. 01</span>
	</div>
	<section class="widgets" aria-label="Dashboard widgets">
		{#each widgets as widget, index (widget.id + index)}
			<article class="widget-slot" class:accent={index === 0}>
				<span class="slot-index">0{index + 1}</span>
				<Widget widget={widget.id} options={widget.options} />
			</article>
		{/each}
	</section>
	<footer>
		<span>MAKE SPACE FOR WHAT MATTERS</span><span>UPDATED {dayjs().format('HH:mm')}</span>
	</footer>
</main>

<style lang="scss">
	.dashboard {
		width: 100%;
		height: 100%;
		padding: 42px 54px 26px;
		display: flex;
		flex-direction: column;
	}
	.header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 17px;
	}
	.brand-mark {
		width: 18px;
		height: 42px;
		background: #c92922;
	}
	h1 {
		font:
			400 48px/1 'Playfair Display',
			serif;
		letter-spacing: -1.5px;
	}
	.date {
		display: flex;
		align-items: center;
		gap: 30px;
		font-size: 19px;
		text-transform: uppercase;
		letter-spacing: 1.1px;
	}
	.date strong {
		color: #c92922;
		font:
			400 36px/1 'Playfair Display',
			serif;
	}
	.rule {
		display: flex;
		align-items: center;
		gap: 14px;
		margin: 23px 0 20px;
		color: #78756e;
		font-size: 11px;
		letter-spacing: 2px;
	}
	.rule-line {
		flex: 1;
		height: 1px;
		background: #c9c4ba;
	}
	.widgets {
		display: grid;
		flex: 1;
		min-height: 0;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 18px;
	}
	.widget-slot {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		padding: 27px 30px 22px;
		border: 1px solid #c9c4ba;
		background: rgba(255, 255, 255, 0.34);
	}
	.widget-slot.accent {
		border-top: 4px solid #c92922;
	}
	.slot-index {
		position: absolute;
		top: 9px;
		right: 12px;
		color: #a49e93;
		font-size: 10px;
		letter-spacing: 1px;
	}
	footer {
		display: flex;
		justify-content: space-between;
		padding-top: 17px;
		color: #78756e;
		font-size: 10px;
		letter-spacing: 1.7px;
	}
	@media (max-width: 760px) {
		.dashboard {
			min-height: 100vh;
			height: auto;
			padding: 25px 20px 16px;
		}
		.brand {
			gap: 10px;
		}
		.brand-mark {
			width: 11px;
			height: 30px;
		}
		h1 {
			font-size: 34px;
		}
		.date {
			gap: 8px;
			flex-direction: column-reverse;
			align-items: flex-end;
			font-size: 10px;
		}
		.date strong {
			font-size: 25px;
		}
		.widgets {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(auto-fit, minmax(240px, auto));
		}
		.widget-slot {
			min-height: 240px;
			padding: 26px 20px 18px;
		}
	}
</style>
