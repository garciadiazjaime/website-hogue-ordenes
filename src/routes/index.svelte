<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	let orders = []
	let catalog

	let startDate = new Date().toLocaleDateString()
	const shifts = [
		{
			hours: 4,
			startTime: '08:00:00 AM'
		},
		{
			hours: 6,
			startTime: '2:00:00 PM'
		},
		{
			hours: 4,
			startTime: '10:00:00 PM'
		}
	]
	let shiftStartTime = '08:00:00 AM'
	let currentShift = 0

	onMount(async () => {
		const schedule = localStorage.getItem('schedule');
		if (schedule) {
			orders = JSON.parse(schedule).map(item => ({
				...item,
				desiredRIsDate: item.desiredRIsDate ? new Date(item.desiredRIsDate): '',
				desiredWantDate: item.desiredWantDate ? new Date(item.desiredWantDate) : '',
			}))
		}

		const data = localStorage.getItem('catalog')
		if (data) {
			catalog = JSON.parse(data).reduce((accu, item) => {
				accu[item.id] = item

				return accu
			}, {})
		}
	});

	async function fileHandler(event) {
		const response = await readXlsxFile(event.target.files[0], { sheet: 3 })

		orders = response.slice(1).map((row, index) => ({
			baseId: row[1],
			partId: row[4],
			description: row[6],
			status: row[7],
			quantity: row[8],
			desiredRIsDate: '',
			desiredWantDate: '',
			code: row[11],
		}))

		event.target.value = ''
	}

	function orderHandler(event, index) {
		const position = parseInt(event.target.value) - 1

		const newOrders = [ ...orders.slice(0, index), ...orders.slice(index + 1) ]
		orders = [...newOrders.slice(0, position), orders[index], ...newOrders.slice(position)]

		event.target.value = index + 1
		document.querySelectorAll('table input')[position].focus()
	}

	function saveHandler(event) {
		localStorage.setItem('schedule', JSON.stringify(orders));

		alert('Schedule saved')
	}

	function getEndDate(startDate, duration, count) {
		
		const shift = count % 3
		const limitDate = new Date(`${startDate.toLocaleDateString()} ${shifts[shift].startTime}`)
		limitDate.setMinutes(limitDate.getMinutes() + shifts[shift].hours * 60)

		const endDate = new Date(startDate)
		endDate.setMinutes(endDate.getMinutes() + duration * 60)

		if (endDate.getTime() <= limitDate.getTime()) {
			return {
				endDate,
				shift,
			}
		}

		if (limitDate < startDate) {
			return getEndDate(startDate, duration, count + 1)
		}

		const hoursDoneOnThisShift = (limitDate - startDate) / 1000 / 60 / 60

		return getEndDate(limitDate, hoursDoneOnThisShift, count + 1)
	}

	function generateSchedule() {
		if (!catalog) {
			return alert('Import the catalog first.')
		}
		
		const firstDate = new Date(`${startDate} ${shiftStartTime}`)

		let shiftHoursConsumed = []
		let hours = 0

		orders = orders.map((order, index) => {
			const part = catalog[order.partId] || catalog['00110']

			if (!catalog[order.partId]) {
				order.missingPart = true
			}

			const duration = order.quantity / part.piecesByHour
			order.laborHours = order.quantity * part.hrsByPiece

			if (index === 0) {
				order.desiredRIsDate = new Date(firstDate)
			}  else {
				order.desiredRIsDate = new Date(orders[index - 1].desiredWantDate)
				order.desiredRIsDate.setMinutes(order.desiredRIsDate.getMinutes() + part.setup * 60)
			}
			


			const { shift, endDate } = getEndDate(order.desiredRIsDate, duration, currentShift)
			currentShift = shift

			order.desiredWantDate = endDate

			return order
		})
	}
</script>

<style>
	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
		text-align: center;
		margin: 0 auto;
		color: #868585;
	}

	table {
		width: 100%;
		margin-top: 24px;
		font-size: 1.1em;
		border-collapse: collapse;
	}

	td {
		border-bottom: 1px solid black;
		padding: 6px;
	}

	tr:nth-child(even) {background: #deeced;}
	tr:nth-child(odd) {background: #FFF}

	input {
		padding: 6px;
		font-size: 1.1em;
	}

	input[type=submit] {
		min-width: 240px;
	}

	.orders input[type=text] {
		width: 60px;
	}

	.new-day {
		border-top: #868585 solid 6px;
	}

	.no-part {
		border-left: red solid 6px;
	}
</style>

<svelte:head>
	<title>Workload Schedule | Hogue</title>
</svelte:head>

<h1>Workload Schedule</h1>

<input type="file" on:change={fileHandler}>

<table>
	<tr>
		<th>Start Date</th>
		<td><input type="text" bind:value={startDate}></td>
	</tr>
	<tr>
		<th>Shift hours</th>
		<td>
			<input type="text" bind:value={shifts[0].hours}>
			<input type="text" bind:value={shifts[1].hours}>
			<input type="text" bind:value={shifts[2].hours}>
		</td>
	</tr>
	<tr>
		<th>Start Time</th>
		<td>
			<input type="text" bind:value={shifts[0].startTime}>
			<input type="text" bind:value={shifts[1].startTime}>
			<input type="text" bind:value={shifts[2].startTime}>
		</td>
	</tr>
	<tr>
		<th></th>
		<td>
			<input type="submit" value="Generate Schedule" on:click={generateSchedule}>
			<input type="submit" value="Save" on:click={saveHandler}>
		</td>
	</tr>
</table>

<br />

<table class="orders">
	<tr>
		<th>#</th>
		<th>Base ID</th>
		<th>Part ID</th>
		<th>Part Description</th>
		<th>Status</th>
		<th>Quantity</th>
		<th>Desired Rls Date</th>
		<th>Desired Want Date</th>
		<th>Commodity Code</th>
		<th>Labour-hours</th>
	</tr>
	{#each orders as order, index}
		<tr class:new-day={order.newDay} class:no-part={order.missingPart}>
			<td><input type="text" value={index+1} on:change={event => orderHandler(event, index)}></td>
			<td>{order.baseId}</td>
			<td>{order.partId}</td>
			<td>{order.description}</td>
			<td>{order.status}</td>
			<td>{order.quantity}</td>
			<td>{order.desiredRIsDate.toLocaleString()}</td>
			<td>{order.desiredWantDate.toLocaleString()}</td>
			<td>{order.code}</td>
			<td>{order.laborHours ? order.laborHours.toFixed(2): ''}</td>
		</tr>
	{/each}
</table>
