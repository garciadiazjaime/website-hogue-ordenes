<script>
  const shifts = [
    {
      title: 'L-V 06:00-16:00',
      breaks: '10:00 am A 10:30am - 2:00 pm A 2:30 pm'
    },
    {
      title: 'L-S 06:00-14:00',
      breaks: '9:30 am A 10:00am'
    },
    {
      title: 'L-S 14:00-21:30',
      breaks: '10:00 am A 10:30am'
    },
    {
      title: 'L-V 14:00-23:15',
      breaks: '5:00 pm A 6:00 pm'
    },
    {
      title: 'L-V 16:00-01:00',
      breaks: '8:00 pm A 9:00 pm'
    },
    {
      title: 'L-V 21:15-06:15',
      breaks: '1:30 am A 2:00am - 4:30 am A 5:00 am'
    },
  ]
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
