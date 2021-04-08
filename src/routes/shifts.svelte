<script>
  const shifts = [
    {
      title: 'L-V 06:00-16:00',
      breaks: '10:00am A 10:30am - 02:00pm A 02:30pm'
    },
    {
      title: 'L-S 06:00-14:00',
      breaks: '09:30am A 10:00am'
    },
    {
      title: 'L-S 14:00-21:30',
      breaks: '10:00am A 10:30am'
    },
    {
      title: 'L-V 14:00-23:15',
      breaks: '05:00pm A 06:00pm'
    },
    {
      title: 'L-V 16:00-01:00',
      breaks: '08:00pm A 09:00pm'
    },
    {
      title: 'L-V 21:15-06:15',
      breaks: '01:30am A 02:00am - 04:30am A 05:00am'
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
