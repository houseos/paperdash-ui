<script lang="ts">
	import type { WidgetType } from './widget-types';
	import JokeWidget from './widgets/joke-widget.svelte';
	import SrsWidget from './widgets/srs-widget.svelte';
	import WeatherWidget from './widgets/weather-widget.svelte';
	import WelcomeWidget from './widgets/welcome-widget.svelte';

	export let widget: WidgetType;
</script>

<div class="container">
	{#if widget == 'welcome'}
		<WelcomeWidget />
	{:else if widget == 'srs'}
		<SrsWidget />
	{:else if widget == 'weather'}
		<WeatherWidget />
	{:else if widget == 'joke'}
		<JokeWidget />
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
