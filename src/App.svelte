<script lang="ts">
	import {onMount} from 'svelte';
	import VidSrc from './VidSrc.svelte';

	let ws;
	let OBSBrowser = false;
	let vidSrcArr = [];
	let vidNum = 0;
	let vidSrcNames = [];
	let cmdBtns = [];

	let connected = false;
	let error = false;

	onMount(()=>{		
		// Check if OBS Browser...
		if(window.obsstudio){
			OBSBrowser = true;
		}

		// Connect to Websocket server.
		connect();
	});

	function connect(){
		ws = new WebSocket('ws://192.168.1.16:6969/'+OBSBrowser);
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
				case 'webcam':
					console.log('test');
					// wsSrc = data.payload;
					break;
				case 'video':
					if(!vidSrcArr[data.payload.name]){
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
</script>

<main>
	{#if !connected && error}
		<div id="wsError">Websocket has been disconnected!</div>
	{/if}
	
	{#each vidSrcNames as vid (vid.id)}
	<!-- <p>{vid.id}</p> -->
		<VidSrc bind:bdata={vidSrcArr[vid.name]} />
	{/each}

	<!--
	{#if OBSBrowser}

	{:else}
		<div id="menuTop">

		</div>
		<div id="btnContainer">
			{#each cmdBtns as btn}
				<div on:click={(e) => sendCmd(btn)} class="btn">{btn}</div>
			{/each}
		</div>
	{/if}
	-->

	<!-- <div class:OBSBrowser style="background-color:#F00;">{OBSBrowser}</div> -->
</main>

<style>
	main{
		width: 100%;
		height: 100%;
		overflow:hidden;
		}

	#menuTop{
		padding: 20px;
		background-color:#AAA;
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
	/* position: absolute;  */
	width: 100%; 
	box-sizing:border-box
	}
</style>