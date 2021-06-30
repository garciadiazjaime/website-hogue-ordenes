<script>
	import { onMount } from 'svelte';
	import readXlsxFile from 'read-excel-file'

	import { shifts as shiftsData } from '../support/shifts'
	import WorkingTimes from '../support/working-times'
	import { exportCSVFile, csvJSON } from '../support/csv'

	let orders = []
	let catalog

	let startDate
	let totalLabourHours = 0
	let initialSetup = null
	const shift = [true, false, false, false, false, false]

	let activeTab = 0

	onMount(async () => {
		loadSchedule(activeTab)

		const data = localStorage.getItem('catalog')
		if (data) {
			catalog = JSON.parse(data).reduce((accu, item) => {
				accu[item.id] = item

				return accu
			}, {})
		}
	});

	function cellsMapper(row) {
		return {
			baseId: row[1],
			partId: row[4],
			description: row[6],
			status: row[7],
			quantity: row[8],
			desiredRIsDate: '',
			desiredWantDate: '',
			code: row[11],
		}
	}

	async function readXLSX(event) {
		const skipHeaders = true
		const response = await readXlsxFile(event.target.files[0], { sheet: 1 })

		return response.slice(skipHeaders && 1).map(cellsMapper)
	}

	async function readCSV(event) {
		return new Promise(resolve => {
			const reader = new FileReader();
			
			reader.onload = function () {
				const data = csvJSON(reader.result)
				resolve(data.map(cellsMapper));
			};
			
			reader.readAsBinaryString(event.target.files[0]);
		})
	}

	function loadSchedule(index) {
		const schedule = localStorage.getItem(`schedule_${index}`);
		orders = []

		if (schedule) {
			orders = JSON.parse(schedule).map(item => ({
				...item,
				desiredRIsDate: item.desiredRIsDate ? new Date(item.desiredRIsDate): '',
				desiredWantDate: item.desiredWantDate ? new Date(item.desiredWantDate) : '',
			}))
		}
	}

	async function fileHandler(event) {
		const [, extension] = event.target.files[0].name.split('.')

		const reader = extension === 'csv' ? readCSV : readXLSX
		orders = await reader(event)

		event.target.value = ''
	}

	function orderHandler(event, index) {
		const position = parseInt(event.target.value) - 1

		const temp = orders[position]
		orders[position] = orders[index]
		orders[index] = temp

		event.target.value = index + 1
		document.querySelectorAll('table.orders input[type="text"]')[position].focus()
	}

	function saveHandler(event) {
		localStorage.setItem(`schedule_${activeTab}`, JSON.stringify(orders));

		alert('Schedule saved')
	}

	function exportHandler() {
		exportCSVFile(orders, activeTab)
	}

	function tabHandler(event, index) {
		activeTab = index
		loadSchedule(activeTab)
	}

	function generateSchedule() {
		if (!catalog) {
			return alert('Import the catalog first.')
		}

		if (shift.length === 0) {
			return alert('Please select at least one shift.')
		}

		if (!startDate) {
			return alert('Please set a Start Date')
		}

		const shiftsSelected = shift.reduce((accu, item, index) => {
			if (item) {
				accu.push(index)
			}

			return accu
		}, [])

		if (!shiftsSelected.length) {
			return alert('Please select at least one shift')
		}

		const wt = new WorkingTimes()
		const [year, month, day] = startDate.split('-')
    const adjustedDate = `${month}/${day}/${year}`
		wt.setScheduleStartDate(adjustedDate)

		shiftsSelected.map(index => wt.addShift(index))
		const response = wt.setWorkingTimes()
		if (!response) {
			return
		}

		orders = orders.map((order, index) => {
			const part = catalog[order.partId] || {}

			if (!part || !part.piecesByHour) {
				order.missingPart = true
				part.piecesByHour = Infinity
			}

			const overtime = Number.isInteger(parseInt(order.overtime)) ? order.overtime : 0
			const duration = (order.quantity / part.piecesByHour) - overtime
			order.duration = duration > 0 ? duration : 0
			order.laborHours = order.quantity * part.hrsByPiece

			const setup = index > 0 || initialSetup ? part.setup : 0

			const { startDate, endDate }  = wt.addEvent({
				duration,
				setup,
			})

			order.desiredRIsDate = startDate
			order.desiredWantDate = endDate
			order.setup = setup
			
			return order
		})
	}

	function updateLabourHours() {
		totalLabourHours = orders.reduce((accu, item) => {
			accu += item.countHours ? item.laborHours : 0

			return accu
		}, 0)
	}
</script>

<style>
	h1 {
		font-size: 2.4em;
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

	input[type=submit] {
		min-width: 240px;
	}

	.orders input[type=text] {
		width: 60px;
	}

	.new-day {
		border-top: #868585 solid 6px;
	}

	.no-part {
		border-left: red solid 6px;
	}

	input[type=checkbox] {
		transform: scale(2);
	}

	ul.tabs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		width: 100%;
		overflow-x: scroll;
	}

	ul.tabs li{
		padding: 12px 24px;
		border: 1px solid #deeced;
		text-align: center;
	}

	ul.tabs li:hover{
		cursor: pointer;
	}

	ul.tabs li.active {
		background-color: #deeced;
	}

	.controls {
		margin-bottom: 20px
	}

	.controls > div{
		display: flex;
		border-bottom: 1px solid #deeced;
	}

	.controls > div:last-child {
		border: none;
	}

	.controls span {
		display: block;
	}

	.controls p{
		text-align: center;
		flex: 1;
	}

	.hidden {
		display: none;
	}

	label {
		border: 1px solid rgb(133, 133, 133);
    background-color: rgb(239, 239, 239);
		color: black;
		height: 37px;
		line-height: 37px;
		width: 203px;
		display: inline-block;
	}
</style>

<svelte:head>
	<title>Production Schedule | Hogue</title>
</svelte:head>

<h1>Production Schedule</h1>

<div class="controls">
	<div>
		{#each shiftsData as _, index}
			<p>
				<span>{shiftsData[index].title}</span>
				<input type="checkbox" bind:checked={shift[index]} value={index+1}> 
			</p>
		{/each}
	</div>

	<div>
		<p>
			<input type="file" on:change={fileHandler} id="file" class="hidden">
			<span>Import</span>
			<label for="file">Select file</label>
		</p>
		<p>
			<span>Start Date</span> <input type="date" bind:value={startDate}>
		</p>
		<p>
			<span>Holiday 1</span> <input type="date">
		</p>
		<p>
			<span>Holiday 2</span> <input type="date">
		</p>
		<p>
			<span>Initial Setup</span> <input type="checkbox" bind:checked={initialSetup}>
		</p>
		<p>
			<span>Total Labour Hours</span> {totalLabourHours.toFixed(2)}
		</p>
	</div>

	<div>
		<p></p>
		<p></p>
		<p></p>
		<p>
			<input type="submit" value="Generate Schedule" on:click={generateSchedule}>
		</p>
		<p>
			<input type="submit" value="Save" on:click={saveHandler}>
		</p>
		<p>
			<input type="submit" value="Export" on:click={exportHandler}>
		</p>
	</div>
</div>

<ul class="tabs">
	{#each Array(30) as tab, index}
	<li class:active={activeTab == index} on:click={(event) => tabHandler(event, index)}>{index + 1}</li>
	{/each}
</ul>

<table class="orders">
	<tr>
		<th></th>
		<th>#</th>
		<th>Base ID</th>
		<th>Part ID</th>
		<th>Part Description</th>
		<th>Status</th>
		<th>Quantity</th>
		<th>Desired Rls Date</th>
		<th>Desired Want Date</th>
		<th>Commodity Code</th>
		<th>Labour-hours</th>
		<th>Setup</th>
		<th>Overtime</th>
	</tr>
	{#each orders as order, index}
		<tr class:new-day={order.newDay} class:no-part={order.missingPart} data-duration={order.duration ? order.duration.toFixed(2) : ''}>
			<td><input type="checkbox" bind:checked={order.countHours} on:change={updateLabourHours}></td>
			<td><input type="text" value={index+1} on:change={event => orderHandler(event, index)}></td>
			<td>{order.baseId}</td>
			<td>{order.partId}</td>
			<td>{order.description}</td>
			<td>{order.status}</td>
			<td>{order.quantity}</td>
			<td>{order.desiredRIsDate.toLocaleString()}</td>
			<td>{order.desiredWantDate.toLocaleString()}</td>
			<td>{order.code}</td>
			<td>{order.laborHours ? order.laborHours.toFixed(2) : ''}</td>
			<td>{order.setup !== undefined ? order.setup : ''}</td>
			<td><input type="text" bind:value={order.overtime}></td>
		</tr>
	{/each}
</table>
