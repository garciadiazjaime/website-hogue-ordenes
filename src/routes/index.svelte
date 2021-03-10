<script>
	import successkid from 'images/successkid.jpg';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	$: orders = rows.slice(1).map(row => ({
		baseId: row[1],
		partId: row[4],
		description: row[6],
		status: row[7],
		quantity: row[8],
		desiredRIsDate: row[9],
		desiredWantDate: row[10],
		code: row[11],
	}))

	async function fileHandler(event) {
		rows = await readXlsxFile(event.target.files[0], { sheet: 3 })
	}
</script>

<style>
	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
		text-align: center;
		margin: 0 auto;
	}

	table {
		width: 100%;
		margin-top: 24px;
		font-size: 1.1em;
	}

	td {
		border: 1px solid black;
		padding: 6px;
	}

	tr:nth-child(even) {background: #CCC}
	tr:nth-child(odd) {background: #FFF}
</style>

<svelte:head>
	<title>Programación de Producción | Hogue</title>
</svelte:head>

<h1>Programación de Producción | Hogue</h1>

<input type="file" on:change={fileHandler}>

<table>
	<tr>
		<th>Base ID</th>
		<th>Part ID</th>
		<th>Part Description</th>
		<th>Status</th>
		<th>Quantity</th>
		<th>Desired Rls Date</th>
		<th>Desired Want Date</th>
		<th>Commodity Code</th>
	</tr>
	{#each orders as order}
		<tr>
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
