<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	import Loading from '../components/Loading.svelte'

	let parts = []
	let showLoading = false

	onMount(async () => {
		const data = localStorage.getItem('catalog');

		if (data) {
			parts = JSON.parse(data)
		}
	});

	function isNumber(n){
    return Number(n) === n
	}

	async function fileHandler(event) {
		showLoading = true

		const sheetsTotal = await readXlsxFile(event.target.files[0], { getSheets: true }).then((sheets) => sheets)

		const promises = sheetsTotal.map(async (sheet, index) => {
			const response = await readXlsxFile(event.target.files[0], { sheet: index + 1 })

			const items = response.slice(1).map((row, index) => {
				const isValid = isNumber(row[1]) && isNumber(row[2])

				return {
					id: row[0],
					piecesByHour: row[1],
					hrsByPiece: row[2],
					setup: row[3],
					isValid,
				}
			})

			return items
		}, [])

		const result = await Promise.all(promises)

		parts = result.reduce((accu, items) => {
			if (items.length) {
				accu.push(...items)
			}

			return accu
		}, [])

		showLoading = false
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

	.invalid {
		border-left: red solid 6px;
	}
</style>

<svelte:head>
	<title>Parts Catalog | Hogue</title>
</svelte:head>

<h1>Parts Catalog</h1>

<input type="file" on:change={fileHandler}>
<input type="submit" value="Save" on:click={saveHandler}>

{#if showLoading}
	<Loading />
{/if}

<table>
	<tr>
		<th>#</th>
		<th>Part ID</th>
		<th>Pcs./Hr.</th>
		<th>Hrs. / Piece</th>
		<th>Set up time</th>
	</tr>
	{#each parts as part, index}
		<tr class:invalid={!part.isValid}>
			<td>{index+1}</td>
			<td>{part.id}</td>
			<td>{part.isValid ? part.piecesByHour.toFixed(4) : ''}</td>
			<td>{part.isValid ? part.hrsByPiece.toFixed(4) :  ''}</td>
			<td>{part.setup}</td>
		</tr>
	{/each}
</table>
