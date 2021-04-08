<script>
  import { shifts } from '../support/shifts'
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
</style>

<svelte:head>
	<title>Shift Management | Hogue</title>
</svelte:head>

<h1>Shift Management</h1>

<table>
  <tr>
    <th>Shift</th>
    <th>Shift Hours</th>
    <th>Breaks</th>
  </tr>
  {#each shifts as shift, index}
  <tr>
    <td>{index+1}</td>
    <td>{shift.title}</td>
    <td>{shift.breaks}</td>
  </tr>
  {/each}
</table>
