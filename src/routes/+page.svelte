<script lang="ts">
	import dayjs from 'dayjs';
</script>

<div class="header">
	<h1>paperdash</h1>
	<span class="time">{dayjs().format('HH:mm')}</span>
</div>
<hr />
<img src="weather.png" class="weather" />

<style lang="scss">
	h1 {
		color: red;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 50px;

		.time {
			font-size: 80px;
		}
	}

	.weather {
		width: 100%;
	}
</style>
