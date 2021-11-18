<svelte:options immutable/>
<script lang="ts">
    import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";

	import { processImg } from "./imgProcessing";

	export let bdata;
	export let name;
	export let imgb = false;

	let dispatch = createEventDispatcher();

    let video: HTMLVideoElement;
    let ms = new MediaSource();
    // let mime = 'video/mp4; codecs="avc1.42C028"';
    let mime = 'video/webm; codecs="vp9,opus"';
	let rendered = false;
	let queue = [];
	let srcBuffer = null;
	let ended = false;

	let stepNum = 0;

	let can: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let container: HTMLElement;

	$: if(rendered) showVideo(bdata);

    onMount(() => {

		if(imgb){
			can.width = window.innerWidth;
			can.height = window.innerHeight;
			ctx = can.getContext('2d');
			video.style.visibility = "hidden";
		}

		video.addEventListener('play', (e) => {
			if(!imgb) return;
			function step(){
				if(ended) return;
				
				ctx.drawImage(video, 0, 0, can.width, can.height);

				let srcData = ctx.getImageData(0, 0, can.width, can.height).data;
				let data = processImg(srcData, stepNum);

				let destData = new ImageData(data, can.width, can.height);
				ctx.putImageData(destData, 0, 0);

				stepNum++;
				requestAnimationFrame(step);
			}
			requestAnimationFrame(step);
		})

		ms.addEventListener('sourceopen', (e)=>{
			if(srcBuffer) return;
			srcBuffer = ms.addSourceBuffer(mime);
			srcBuffer.mode = 'sequence';

			srcBuffer.addEventListener('update', (e)=>{
				updateBuffer();
				video.play();
			});

			srcBuffer.addEventListener('updateend', (e)=>{
				updateBuffer();
				if(!srcBuffer.updating && ms.readyState === 'open'){
					ms.endOfStream();
					video.play();
				}
			});
			rendered = true;
		});

		video.src = URL.createObjectURL(ms);
		// const rWid = ~~(Math.random()*window.innerWidth);
		// const rHei = ~~(Math.random()*window.innerHeight);
		// container.style.left =  ((rWid + 100) > window.innerWidth  ? (rWid - 100) : rWid )  + "px";
		// container.style.top =  ((rHei + 100) > window.innerHeight  ? (rHei - 100) : rHei )  + "px";

		video.playbackRate = 1;

		// container.style.top = ~~(Math.random()*window.innerHeight) + "px";
    });

	function showVideo(chunk){
		chunk.forEach(el => {	
			const data = new Uint8Array(el);
			if(srcBuffer.updating || queue.length > 0){
				queue.push(data);
			} else {
				srcBuffer.appendBuffer(data);
			}
		});
	}

	function endEvt(){
		ended = true;
		dispatch('ended', name);
	}

	function updateBuffer(){
		if(queue.length > 0 && !srcBuffer.updating) {
			srcBuffer.appendBuffer(queue.shift());
		}
	}
</script>

<div class="vidContainer" bind:this={container}>
	{#if imgb}
		<canvas bind:this={can} />
	{/if}
	<video 
		on:ended={endEvt}
		bind:this={video}
		autoplay={true}
		muted={true}
		/>
</div>

<style>
.vidContainer{
	/* position: absolute; */
	/* width: 200px; */
	}
	.vidContainer canvas{
		position: absolute;
	}
	.vidContainer video{
		width: 100%;
		height: 100%;
		position: absolute;
	}
</style>