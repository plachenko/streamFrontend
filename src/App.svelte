<script lang="ts">
	import {onMount} from 'svelte';
	import VidSrc from './VidSrc.svelte';
	import notifcation from './Notification.svelte';
	import Webcam from './webcam.svelte';
	
	let ws;
	let OBSBrowser = false;
	let vidSrcArr = {};
	let vidNum = 0;
	let vidSrcNames = [];
	let cmdBtns = [];

	let connected = false;
	let error = false;

	let curItem = "cmds";

	let notif = {
		user: '',
		event: ''
	}

	let wsInfo = {
		ip: '192.168.1.16',
		port: '6969',
		status: 0
	}

	onMount(() => {
		// Check if OBS Browser...
		if(window.obsstudio){
			OBSBrowser = true;
		}

		// Connect to Websocket server.
		connect();

		setNotification();

		document.addEventListener('keyup', (e)=>{
			switch(e.which){
				case 32:
					sendCmd('sendVid');
					break;
			}
		});
	});

	function setNotification(){
		notif.user = 'test';
		notif.event = 'test';
	}

	function connect(){
		console.log('connecting...');

		if(!wsInfo.ip || !wsInfo.port) return;
		
		ws = new WebSocket(`ws://${wsInfo.ip}:${wsInfo.port}/OBSBrowser`);
		ws.addEventListener('open', (e) => {
			// step();
			console.log('connecting');
			connected = true;
			error = false;
		});

		ws.addEventListener('error', (e)=>{
			ws.close();	
		});

		ws.addEventListener('close', (e)=> {
			setTimeout(() => {
				connected = false;
				error = true;
				connect();
			}, 1000);
		});

		ws.addEventListener('message',(e)=>{
			const data = JSON.parse(e.data);

			switch(data.type){
				case 'cmdBtns':
					cmdBtns = data.payload;
					cmdBtns.unshift('random');
					break;
				case 'msg':
					if(data.payload == 'barrelRoll'){
						// barrelRoll();
					}
					break;
				case 'notifcation':
					setNotification();
					break;
				case 'webcam':
					// wsSrc = data.payload;
					break;
				case 'video':
					if(!vidSrcArr[data.payload.name]){
						console.log(vidSrcArr);
						vidSrcArr[data.payload.name] = [];

						const vidObj = {
							id: vidNum,
							name: data.payload.name
						}
						
						vidSrcNames = [...vidSrcNames, vidObj];
						vidNum++;
					}

					vidSrcArr[data.payload.name].push(data.payload.buffer.data);

					break;
			}
		});
	}

	function sendCmd(e){
		const obj = {
			type: 'cmd',
			payload: e
		}

		ws.send(JSON.stringify(obj));
	}

	function checkIdx(idx){
		return (vidSrcNames.length-1 == idx);
	}

	function endEvt(e){
		vidSrcNames = vidSrcNames.filter((el) => {
			return el.name != e.detail;
		});

		delete vidSrcArr[e.detail];

		// console.log(vidSrcNames, vidSrcArr);
	}
</script>

<main>
	{#if !connected && error}
		<div id="wsError">Websocket has been disconnected!</div>
	{/if}

	{#if notif}
	<!-- <notifcation /> -->
	{/if}

	{#if OBSBrowser}
		{#each vidSrcNames as vid (vid.id)}
			<VidSrc
				on:ended={endEvt}
				bind:name={vid.name}
				bind:bdata={vidSrcArr[vid.name]} 
				/>
		{/each}
	{:else}
		<div id="menuTop">
			<div class="btn" on:click={() => curItem = "cmds"}>Commands</div>
			<div class="btn" on:click={() => curItem = "opts"}>Options</div>
		</div>
		{#if curItem == 'cmds'}
			<div id="btnContainer">
				{#each cmdBtns as btn}
					<div on:click={(e) => sendCmd(btn)} class="btn">{btn}</div>
				{/each}
			</div>
		{:else if curItem == 'opts'}
			<form>
				<fieldset style="float:left;">
					<legend>Websocket connection info</legend>

					<!-- <label for="ip">IP</label> -->
					<input type="text" id="ip" bind:value={wsInfo.ip} />
					
					<!-- <label for="port">Port</label> -->
					<input type="text" id="port" bind:value={wsInfo.port} />
					
					<input type="button" on:click={connect} value="connect" />
				</fieldset>
			</form>
		{/if}
	{/if}


	<!-- <div class:OBSBrowser style="background-color:#F00;">{OBSBrowser}</div> -->
</main>

<style>
	main{
		width: 100%;
		height: 100%;
		overflow:hidden;
		}

	.notification{
		background-color:#000;
		color:#FFF;
		padding: 20px;
		font-size: 25px;
		position: absolute;
		}

	#menuTop{
		padding: 4px;
		width:100%;
		background-color:#AAA;
		float: left;
		}
		#menuTop .btn{
			position: relative;
			float: left;
			padding: 4px;
			width: 100px;
			margin: 0px 5px;
		}

	#btnContainer{
		overflow-y:scroll;
		flex-wrap: wrap;
		display: flex;
		flex-direction: row;
		flex: 1;
		float: left;
		width: 85%;
		height: 100%;
	}
	.btn{
		background-color: #CCC;
		border: 1px solid;
		float: left;
		box-sizing: border-box;
		padding: 20px;
		flex:1;
		text-align:center;
		min-width: 200px;
		user-select: none;
		cursor: pointer;
		}
		.btn:hover{
			background-color:#AAA;
			}
		.btn:active{
			background-color:#F00;
			}

#wsError{
	background-color:#F00; 
	color:#FFF; 
	font-weight:bold; 
	text-align: center;
	font-size: 2em; 
	padding: 10px; 
	position: absolute; 
	width: 100%; 
	box-sizing:border-box;
	bottom: 0px;
	}
</style>