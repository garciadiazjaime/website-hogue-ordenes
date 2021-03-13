<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	let orders = []

	onMount(async () => {
		const data = localStorage.getItem('schedule');

		if (data) {
			orders = JSON.parse(data)
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
			desiredRIsDate: row[9],
			desiredWantDate: row[10],
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

	async function saveHandler(event) {
		localStorage.setItem('schedule', JSON.stringify(orders));

		alert('Schedule saved')
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
<input type="submit" value="Save" on:click={saveHandler}>

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
			<td>{order.desiredRIsDate}</td>
			<td>{order.desiredWantDate}</td>
			<td>{order.code}</td>
		</tr>
	{/each}
</table>
