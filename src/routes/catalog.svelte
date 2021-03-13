<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	let rows = []
	$: parts = rows.map((row, index) => ({
		id: row[0],
		pieces: row[1],
		time: row[2],
		setup: row[3],
	}))

	onMount(async () => {
		const data = localStorage.getItem('catalog');

		if (data) {
			parts = JSON.parse(data)
		}
	});

	async function fileHandler(event) {
		const response = await readXlsxFile(event.target.files[0], { sheet: 2 })

		rows = response.slice(2)

		event.target.value = ''
	}

	async function saveHandler(event) {
		localStorage.setItem('catalog', JSON.stringify(parts));

		alert('Catalog saved')
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
	<title>Parts Catalog | Hogue</title>
</svelte:head>

<h1>Parts Catalog</h1>

<input type="file" on:change={fileHandler}>
<input type="submit" value="Save" on:click={saveHandler}>

<table>
	<tr>
		<th>#</th>
		<th>Part ID</th>
		<th>Pieces</th>
		<th>Time</th>
		<th>Setup</th>
	</tr>
	{#each parts as part, index}
		<tr>
			<td>{index+1}</td>
			<td>{part.id}</td>
			<td>{part.pieces}</td>
			<td>{part.time}</td>
			<td>{part.setup}</td>
		</tr>
	{/each}
</table>
