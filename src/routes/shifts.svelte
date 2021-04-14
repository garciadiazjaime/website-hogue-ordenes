<script>
	import { onMount } from 'svelte';
	import { shifts as shiftsBase } from '../support/shifts'

	let shifts = []

	onMount(async () => {
		const data = localStorage.getItem('shifts');
		console.log(JSON.parse(data))

		shifts = data ? JSON.parse(data) : shiftsBase
	});

	function saveHandler() {
		localStorage.setItem('shifts', JSON.stringify(shifts));

		alert('shifts saved')
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
	<title>Shift Management | Hogue</title>
</svelte:head>

<h1>Shift Management</h1>

<input type="submit" value="Save" on:click={saveHandler}>

<table>
  <tr>
    <th>Shift</th>
    <th>Shift Hours</th>
    <th>Breaks</th>
		<th>Overtime</th>
  </tr>
	{#each shifts as shift, index}
	<tr>
		<td>{index+1}</td>
		<td>{shift.title}</td>
		<td>{shift.breaksTitle}</td>
		<td>
			<table>
				{#each shift.overtime as overtime, index}
					<tr>
						<th>{shift.days[index]}</th>
						<td><input type="text" bind:value={overtime}></td>
					</tr>
				{/each}
			</table>
		</td>
	</tr>
	{/each}
</table>
