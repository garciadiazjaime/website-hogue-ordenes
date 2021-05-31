<script>
	function cleanHandler() {
    if (confirm('are you sure? this is going to delete all changes')) {
			for(let i=0; i<30; i++) {
				localStorage.removeItem(`schedule_${i}`);
			}
      localStorage.removeItem('catalog');
      localStorage.removeItem('shifts');
    }
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

	input {
		padding: 6px;
		font-size: 1.1em;
	}

	input[type=submit] {
		min-width: 240px;
	}
</style>

<svelte:head>
	<title>Config | Hogue</title>
</svelte:head>

<h1>Config</h1>

<input type="submit" value="Clean" on:click={cleanHandler}>



