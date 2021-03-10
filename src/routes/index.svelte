<script>
	import successkid from 'images/successkid.jpg';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	$: orders = rows.map((row, index) => ({
		baseId: row[1],
		partId: row[4],
		description: row[6],
		status: row[7],
		quantity: row[8],
		desiredRIsDate: row[9],
		desiredWantDate: row[10],
		code: row[11],
		index,
	}))

	async function fileHandler(event) {
		const response = await readXlsxFile(event.target.files[0], { sheet: 3 })
		rows = response.slice(1)

		event.target.value = ''
	}

	function orderHandler(event, index) {
		const position = parseInt(event.target.value)

		const newRows = [ ...rows.slice(0, index), ...rows.slice(index + 1) ]
		rows = [...newRows.slice(0, position-1), rows[index], ...newRows.slice(position-1)]

		event.target.value = index + 1
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
</style>

<svelte:head>
	<title>Programación de Producción | Hogue</title>
</svelte:head>

<h1>Programación de Producción</h1>

<input type="file" on:change={fileHandler}>

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
