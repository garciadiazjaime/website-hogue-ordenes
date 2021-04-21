<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	import { shifts as shiftsData } from '../support/shifts'
	import WorkingTimes from '../support/working-times'

	let orders = []
	let catalog
	let holidays = []

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
	let totalLabourHours = 0
	let initialSetup = null
	const shift = [true, false, false, false]

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
		const response = await readXlsxFile(event.target.files[0], { sheet: 1 })

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

	function generateSchedule() {
		if (!catalog) {
			return alert('Import the catalog first.')
		}

		if (shift.length === 0) {
			return alert('Please select at least one shift.')
		}

		const shiftsSelected = shift.reduce((accu, item, index) => {
			if (item) {
				accu.push(index)
			}

			return accu
		}, [])

		const wt = new WorkingTimes()
		wt.setScheduleStartDate(startDate)

		shiftsSelected.map(index => wt.addShift(index))

		orders = orders.map((order, index) => {
			const part = catalog[order.partId] || catalog['11100']

			if (!catalog[order.partId]) {
				order.missingPart = true
			}

			const duration = order.quantity / part.piecesByHour
			order.duration = duration
			order.laborHours = order.quantity * part.hrsByPiece

			const { startDate, endDate }  = wt.addEvent({
				duration,
				setup: order.setup,
			})

			order.desiredRIsDate = startDate
			order.desiredWantDate = endDate
			
			return order
		})
	}

	function updateLabourHours() {
		totalLabourHours = orders.reduce((accu, item) => {
			accu += item.countHours ? item.laborHours : 0

			return accu
		}, 0)
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

	th {
		text-align: left;
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

	input[type=checkbox] {
		transform: scale(2);
	}
</style>

<svelte:head>
	<title>Production Schedule | Hogue</title>
</svelte:head>

<h1>Production Schedule</h1>

<input type="file" on:change={fileHandler}>

<table>
	<tr>
		<th>Shift</th>
		<td>
			<table>
				<tr>
					{#each shiftsData as shift, index}
					<th>#{index + 1} <br />{shift.title}</th>
					{/each}
				</tr>
				<tr>
					<td><input type="checkbox" bind:checked={shift[0]} value="1"></td>
					<td><input type="checkbox" bind:checked={shift[1]} value="2"></td>
					<td><input type="checkbox" bind:checked={shift[2]} value="3"></td>
					<td><input type="checkbox" bind:checked={shift[3]} value="4"></td>
					<td><input type="checkbox" bind:checked={shift[4]} value="5"></td>
					<td><input type="checkbox" bind:checked={shift[5]} value="6"></td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<th>Start Date</th>
		<td>
			<input type="input" bind:value={startDate}>
		</td>
	</tr>
	<tr>
		<th>Holidays</th>
		<td>
			<input type="text" bind:value={holidays[0]}>
			<input type="text" bind:value={holidays[1]}>
			<input type="text" bind:value={holidays[2]}>
		</td>
	</tr>
	<tr>
		<th>Initial Setup</th>
		<td>
			<input type="checkbox" bind:checked={initialSetup}>
		</td>
	</tr>
	<tr>
		<th>Total Labour Hours</th>
		<td>
			{totalLabourHours.toFixed(2)}
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
		<th></th>
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
		<th>Duration</th>
	</tr>
	{#each orders as order, index}
		<tr class:new-day={order.newDay} class:no-part={order.missingPart}>
			<td><input type="checkbox" bind:checked={order.countHours} on:change={updateLabourHours}></td>
			<td><input type="text" value={index+1} on:change={event => orderHandler(event, index)}></td>
			<td>{order.baseId}</td>
			<td>{order.partId}</td>
			<td>{order.description}</td>
			<td>{order.status}</td>
			<td>{order.quantity}</td>
			<td>{order.desiredRIsDate.toLocaleString()}</td>
			<td>{order.desiredWantDate.toLocaleString()}</td>
			<td>{order.code}</td>
			<td>{order.laborHours ? order.laborHours.toFixed(2) : ''}</td>
			<td>{order.duration ? order.duration.toFixed(2) : ''}</td>
		</tr>
	{/each}
</table>
