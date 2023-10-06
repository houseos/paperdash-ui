<script lang="ts">
	import type { Dayjs } from 'dayjs';
	import dayjs from 'dayjs';
	import 'dayjs/locale/de';

	dayjs.locale('de');

	import weekOfYear from 'dayjs/plugin/weekOfYear';
	dayjs.extend(weekOfYear);
	import isoWeek from 'dayjs/plugin/isoWeek';
	dayjs.extend(isoWeek);

	type Options = {
		location: number;
	};

	export let options: Options;

	const day = getInitialDay();

	type SrsRestaurantMenu = {
		id: number;
		name: string;
		show: boolean;
	};

	type SrsRestaurant = {
		id: number;
		name: string;
		menus: SrsRestaurantMenu[];
	};

	type SrsMenu = {
		id: number;
		name: string;
		restaurantId: number;
		days: SrsMenuDay[];
	};

	type SrsMenuDay = {
		date: Date;
		categories: SrsMenuCategory[];
	};

	type SrsMenuCategory = {
		id: number;
		name: string;
		products: SrsMenuProduct[];
	};

	type SrsMenuProduct = {
		id: number;
		name: string;
		price: SrsMenuProductPrice;
	};

	type SrsMenuProductPrice = {
		internal: number;
		external: number;
		discount: number;
	};

	function getInitialDay(): Dayjs {
		let date = dayjs();
		if (date.hour() >= 15) {
			date = date.add(1, 'day');
		}
		if (isWeekend(date)) {
			date = date.add(1, 'week').startOf('week');
		}
		return date;
	}

	function isWeekend(date: Dayjs): boolean {
		return date.isoWeekday() > 5;
	}

	async function getMenus(location: number): Promise<SrsMenu[]> {
		return fetch(`https://api.srs.l5w.de/restaurants/${location}`)
			.then((res) => res.json())
			.then((restaurant: SrsRestaurant) =>
				restaurant.menus
					.filter((menu) => menu.show)
					.filter((menu) => menu.name !== 'Beilagen')
					.map((menu) =>
						fetch(`https://api.srs.l5w.de/menus/${menu.id}/${day.year()}/${day.week()}`).then(
							(res) => res.json()
						)
					)
			)
			.then((p) => Promise.all(p));
	}

	function isHighlighted(product: SrsMenuProduct) {
		if (product.name.includes('Currywurst')) {
			return true;
		}
		return false;
	}
</script>

<div class="day">Kantine | {day.format('dddd, DD.MM.YYYY')}</div>
<hr />
{#await getMenus(options.location) then menus}
	{#each menus as menu}
		<div class="items">
			{#each menu.days[day.isoWeekday() - 1].categories as category}
				{@const item = category.products[0]}
				{@const name = item.name.split('\n').map((s) => s.trim())}
				<div class="item" class:highlighted={isHighlighted(item)}>
					<div class="title">
						<span class="name">{name[0]}</span>
						<span class="price">
							{item.price?.discount?.toFixed(2)}€|{item.price?.internal?.toFixed(2)}€
						</span>
					</div>
					<span class="desc">{name.slice(1).join(', ')}</span>
				</div>
			{/each}
		</div>
	{/each}
{/await}

<style lang="scss">
	.day {
		font-size: 2rem;
	}
	.items {
		display: flex;
		flex-direction: column;
		font-size: 1rem;
		padding: 1rem 0;
	}

	.item {
		padding: 0.2rem 1rem;

		.name {
			font-size: 1.5rem;
			font-weight: bold;
		}

		.price {
			font-family: monospace;
			font-weight: bold;
		}

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&.highlighted {
			background: red;
			color: white;
		}
	}
</style>
