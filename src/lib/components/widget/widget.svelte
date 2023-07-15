<script lang="ts">
	import type { WidgetConfig, WidgetType } from './widget-types';
	import JokeWidget from './widgets/joke-widget.svelte';
	import SrsWidget from './widgets/srs-widget.svelte';
	import WeatherWidget from './widgets/weather-widget.svelte';
	import WelcomeWidget from './widgets/welcome-widget.svelte';

	export let widget: WidgetType;
	export let options: any;
</script>

<div class="container">
	{#if widget == 'welcome'}
		<WelcomeWidget {options} />
	{:else if widget == 'srs'}
		<SrsWidget {options} />
	{:else if widget == 'weather'}
		<WeatherWidget {options} />
	{:else if widget == 'joke'}
		<JokeWidget {options} />
	{:else}
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
