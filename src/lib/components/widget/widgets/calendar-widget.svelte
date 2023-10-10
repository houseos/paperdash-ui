<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	type Options = { url: string };
	type CalendarItem = {
		name: string;
		start: Dayjs;
		end?: Dayjs;
		future: boolean;
		past: boolean;
		today: boolean;
		soon: boolean;
		dateOnly?: boolean;
	};

	export let options: Options;

	function icalToDayjs(d: string) {
		const year = d.substring(0, 4);
		const month = d.substring(4, 6);
		const day = d.substring(6, 8);
		const hour = d.substring(9, 11);
		const minute = d.substring(11, 13);
		return dayjs(`${year}-${month}-${day} ${hour}:${minute}Z`);
	}

	async function loadCalendar(url: string): Promise<CalendarItem[]> {
		const ical = await fetch(url).then((r) => r.text());
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
				const dateOnly = !!props['DTSTART;VALUE=DATE'];
				let start;
				let end;

				if (dateOnly) {
					start = dayjs(props['DTSTART;VALUE=DATE']);
					if (props['DTEND;VALUE=DATE']) {
						end = dayjs(props['DTEND;VALUE=DATE']).subtract(1, 'day');
						if (start.isSame(end, 'day')) {
							end = undefined;
						}
					}
				} else {
					start = icalToDayjs(props['DTSTART']);
					if (props['DTEND']) {
						end = icalToDayjs(props['DTEND']);
					}
				}
				const diff = start.diff(dayjs(), 'hours');

				return {
					name: props['SUMMARY'].replace(/\[.*\]/, '') || 'unnamed',
					start,
					end,
					future: start.isAfter(dayjs(), 'day'),
					past: start.isBefore(dayjs(), 'day'),
					today: start.isSame(dayjs(), 'day'),
					soon: diff <= 24 && diff >= -1,
					dateOnly
				};
			});
	}

	async function readCalendars() {
		let events: CalendarItem[] = [];
		const urls = options.url.split(',');
		const calendars = await Promise.all(urls.map(async (url) => await loadCalendar(url)));
		events = calendars.flat();
		return events.sort((a, b) => a.start.unix() - b.start.unix());
	}

	let events: CalendarItem[] = [];

	onMount(async () => {
		events = await readCalendars();
		console.log(events);
	});
</script>

<h2>Kalender</h2>

<div class="events">
	{#each events as event}
		{#if !event.past}
			<div class="event" class:soon={event.soon} class:today={event.today}>
				<strong class="name">{event.name}</strong>
				{#if !event.dateOnly && !event.end}
					<span>{event.start.format('HH:mm')}</span>
				{/if}
				<strong>{event.start.format('DD.MM.YYYY')}</strong>
				{#if event.end}
					- <strong>{event.end.format('DD.MM.YYYY')}</strong>
				{/if}
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
		outline: 2px dashed #000;
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

		&.soon,
		&.today {
			outline: 4px solid red;
		}
	}
</style>
