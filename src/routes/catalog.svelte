<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	let parts = []

	onMount(async () => {
		const data = localStorage.getItem('catalog');

		if (data) {
			parts = JSON.parse(data)
		}
	});

	async function fileHandler(event) {
		const response = await readXlsxFile(event.target.files[0], { sheet: 1 })

		parts = response.slice(1).map((row, index) => ({
			id: row[0],
			piecesByHour: row[1],
			hrsByPiece: row[2],
			setup: row[3],
		}))

		event.target.value = ''
	}

	function saveHandler(event) {
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
		<th>Pcs./Hr.</th>
		<th>Hrs. / Piece</th>
		<th>Set up time</th>
	</tr>
	{#each parts as part, index}
		<tr>
			<td>{index+1}</td>
			<td>{part.id}</td>
			<td>{part.piecesByHour}</td>
			<td>{part.hrsByPiece.toFixed(4)}</td>
			<td>{part.setup}</td>
		</tr>
	{/each}
</table>
