<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	type Options = { url: string };
	type CalendarItem = {
		name: string;
		date: Dayjs;
		future: boolean;
		past: boolean;
		today: boolean;
		soon: boolean;
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
			.map((props): CalendarItem => {
				const d = props['DTSTART'];
				const year = d.substring(0, 4);
				const month = d.substring(4, 6);
				const day = d.substring(6, 8);
				const hour = d.substring(9, 11);
				const minute = d.substring(11, 13);
				const date = dayjs(`${year}-${month}-${day} ${hour}:${minute}Z`);
				const diff = date.diff(dayjs(), 'hours');

				return {
					name: props['SUMMARY'].replace(/\[.*\]/, '') || 'unnamed',
					date,
					future: date.isAfter(dayjs(), 'day'),
					past: date.isBefore(dayjs(), 'day'),
					today: date.isSame(dayjs(), 'day'),
					soon: diff <= 24 && diff >= -1
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
		{#if !event.past}
			<div class="event" class:soon={event.soon} class:today={event.today}>
				<strong class="name">{event.name}</strong>
				<span>{event.date.format('HH:mm')}</span>
				<strong>{event.date.format('DD.MM.YYYY')}</strong>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.events {
		padding: 1rem 0.5rem;
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

		&.today {
			background: red;
			color: #fff;
		}

		&.soon {
			border: 4px solid red;
		}
	}
</style>
