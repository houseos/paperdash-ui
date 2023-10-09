<script lang="ts">
	import type { WidgetConfig, WidgetType } from './widget-types';
	import CalendarWidget from './widgets/calendar-widget.svelte';
	import JokeWidget from './widgets/joke-widget.svelte';
	import SrsWidget from './widgets/srs-widget.svelte';
	import WeatherWidget from './widgets/weather-widget.svelte';
	import TextWidget from './widgets/text-widget.svelte';

	const WIDGET_COMPONENTS: Partial<Record<WidgetType, any>> = {
		text: TextWidget,
		srs: SrsWidget,
		weather: WeatherWidget,
		joke: JokeWidget,
		calendar: CalendarWidget,
	};

	export let widget: WidgetType;
	export let options: any;
</script>

<div class="container">
	<svelte:component this={WIDGET_COMPONENTS[widget]} {options} />

	{#if !WIDGET_COMPONENTS[widget]}
		<p>unknown widget</p>
	{/if}
</div>

<style>
	.container {
		border: 2px solid #000;
		width: 100%;
		height: 100%;
		padding: 5px;
	}
</style>
