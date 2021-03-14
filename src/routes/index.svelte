<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	let orders = []
	let catalog

	let startDate = new Date().toLocaleDateString()
	let hoursPerDay = 8
	let shiftStartTime = new Date().toLocaleTimeString()

	onMount(async () => {
		let data = localStorage.getItem('schedule');

		if (data) {
			orders = JSON.parse(data)
		}

		data = localStorage.getItem('catalog')
		if (data) {
			catalog = JSON.parse(data)
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

	function generateSchedule() {
		if (!startDate || !hoursPerDay || !shiftStartTime) {
			return alert('Plese fill in all the inputs.')
		}

		if (!catalog) {
			return alert('Import the catalog first.')
		}

		console.log(catalog)

		orders = orders.map((order, index) => {
			const part = catalog[0]
			const duration = part.pieces * part.time
			console.log(`[${index+1}] pieces: ${part.pieces}, time: ${part.time}, duration: ${duration}, setup: ${part.setup}`)

			if (index === 0) {
				order.desiredRIsDate = new Date(`${startDate} ${shiftStartTime}`)

				order.desiredWantDate = new Date(order.desiredRIsDate)
				order.desiredWantDate.setMinutes(order.desiredWantDate.getMinutes() + duration * 60)

			} 
			else {
				order.desiredRIsDate = new Date(orders[index - 1].desiredWantDate)
				order.desiredRIsDate.setMinutes(order.desiredRIsDate.getMinutes() + part.setup * 60)

				order.desiredWantDate = new Date(order.desiredRIsDate)
				order.desiredWantDate.setMinutes(order.desiredWantDate.getMinutes() + duration * 60)
			}

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
		<th>Hours per Day</th>
		<td><input type="text" bind:value={hoursPerDay}></td>
	</tr>
	<tr>
		<th>Shift Start Time</th>
		<td><input type="text" bind:value={shiftStartTime}></td>
	</tr>
	<tr>
		<th></th>
		<td>
			<input type="submit" value="Generate Schedule" on:click={generateSchedule}>
			<input type="submit" value="Save" on:click={saveHandler}>
		</td>
	</tr>
</table>

<table>
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
	</tr>
	{#each orders as order, index}
		<tr>
			<td><input type="text" value={index+1} on:change={event => orderHandler(event, index)}></td>
			<td>{order.baseId}</td>
			<td>{order.partId}</td>
			<td>{order.description}</td>
			<td>{order.status}</td>
			<td>{order.quantity}</td>
			<td>{order.desiredRIsDate.toLocaleString()}</td>
			<td>{order.desiredWantDate.toLocaleString()}</td>
			<td>{order.code}</td>
		</tr>
	{/each}
</table>
