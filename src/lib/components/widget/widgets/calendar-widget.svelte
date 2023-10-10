<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	type Options = { url: string };
	type CalendarItem = {
		name: string;
		date: Dayjs;
	};

	export let options: Options;

	async function loadCalendar(): Promise<CalendarItem[]> {
		const ical = await fetch(options.url).then((r) => r.text());
		console.log(ical);

		return ical
			.split('BEGIN:VEVENT')
			.slice(1)
			.map((e) => e.split('\n'))
			.map((lines) => {
				const properties: Record<string, string> = {};
				lines.forEach((line) => {
					const key = line.split(':')[0];
					const value = line.substring(key.length + 1);
					properties[key] = value;
				});
				return properties;
			})
			.map((props) => {
				const d = props['DTSTART'];
				const year = d.substring(0, 4);
				const month = d.substring(4, 6);
				const day = d.substring(6, 8);
				const hour = d.substring(9, 11);
				const minute = d.substring(11, 13);
				console.log(`${year}-${month}-${day} ${hour}:${minute}Z`);

				return {
					name: props['SUMMARY'].replace(/\[.*\]/, '') || 'unnamed',
					date: dayjs(`${year}-${month}-${day} ${hour}:${minute}Z`)
				};
			})
			.sort((a, b) => a.date.unix() - b.date.unix());
	}

	let events: CalendarItem[] = [];

	onMount(async () => {
		events = await loadCalendar();
		console.log(events);
	});
</script>

<h2>Kalender</h2>

<div class="events">
	{#each events as event}
		<div class="event">
			<strong class="name">{event.name}</strong>
			<span>{event.date.format('HH:mm')}</span>
			<strong>{event.date.format('DD.MM.YYYY')}</strong>
		</div>
	{/each}
</div>

<style lang="scss">
	.events {
		padding: 1rem .5rem;
		gap: 1rem;
		display: flex;
		flex-direction: column;
	}

	.event {
		border: 2px dashed #000;
		padding: 0.5em 1em;
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		width: 100%;

		.name {
			width: 100%;
		}
	}
</style>
