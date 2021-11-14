<script lang="ts">
    import { onMount } from "svelte";

	export let bdata;

    let video: HTMLVideoElement;
    let ms = new MediaSource();
    let mime = 'video/mp4; codecs="avc1.42C028"';
	let rendered = false;

	let srcBuffer = null;
	let queue = [];

	$: if(rendered) showVideo(bdata);

    onMount(() => {
        ms.addEventListener('sourceopen', (e)=>{
			srcBuffer = ms.addSourceBuffer(mime);
			srcBuffer.mode = 'sequence';

			srcBuffer.addEventListener('update', (e)=>{
				updateBuffer();
				console.log('updating');
			});

			srcBuffer.addEventListener('updateend', (e)=>{
				updateBuffer();
				video.play();
			});
			rendered = true;
		});
		video.src = URL.createObjectURL(ms);
    });

	function showVideo(chunk){
		const data = new Uint8Array(chunk);
		if(srcBuffer.updating || queue.length > 0){
			queue.push(data);
		} else {
			srcBuffer.appendBuffer(data);
		}
	}

	function updateBuffer(){
		if(queue.length > 0 && !srcBuffer.updating) {
			srcBuffer.appendBuffer(queue.shift());
		}
	}
</script>

<video 
	bind:this={video} 
	autoplay="true" 
	muted="muted" />

<style>
	video{
		position: absolute;
	}

</style>