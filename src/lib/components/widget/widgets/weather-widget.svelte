<script lang="ts">
	import { onMount } from 'svelte';

	type Options = {
		cityid: number;
		apikey: string;
	};

	export let options: Options;

	onMount(() => {
		let win = window as any;

		win.myWidgetParam ? win.myWidgetParam : (win.myWidgetParam = []);
		win.myWidgetParam.push({
			id: 21,
			cityid: options.cityid,
			appid: options.apikey,
			units: 'metric',
			containerid: 'openweathermap-widget-21'
		});
		var script = document.createElement('script');
		script.async = true;
		script.charset = 'utf-8';
		script.src =
			'//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode?.insertBefore(script, s);
	});
</script>

<div id="openweathermap-widget-21" />

<style>
	img {
		max-width: 100%;
	}

	:global(.widget-left) {
		box-shadow: none !important;
	}

	:global(.widget-left__graphic) {
		transform: scaleX(0.9) !important;
		transform-origin: left !important;
	}

	:global(.widget-left) {
		width: 600px !important;
	}

	:global(.widget-left__body) {
		width: 100% !important;
	}

	:global(.widget-left-menu__layout) {
		width: 100% !important;
	}

	:global(.calendar) {
		width: 400px !important;
	}
</style>
