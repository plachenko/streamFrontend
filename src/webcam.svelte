<script lang="ts">
    import { onMount } from "svelte";

    let video: HTMLVideoElement;
	let prevData;
    
	let stepNum = 0;
	const width = 400;
	const height= 300;
	let threshold = 10;

	let webcamImg;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

    onMount(() => {
		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');
        
		navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream)=>{				
			video.srcObject = stream;
			step();
		}).catch((error)=>{
			console.log(error)
		});

    });

    function barrelRoll(){
		const num = 360* ~~(Math.random()*4)
		gsap.to(webcamImg, {rotation: '+=' + num, duration: 1, onComplete: (e) => {
			const rotNum = webcamImg.style.transform.match(/\d+/g)[0];
			if(parseInt(rotNum)%45){
				gsap.to(webcamImg, {rotation: '45deg'});
			}
		}});
	}

	function step(){
		/* 
		1) Grab the video image, 
			- it's image data Object 
			- specify the image data pixels
		*/
		ctx.drawImage(video, 80, 0, width, height, 0, 0, width, height);
		let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let data = img.data;

		data = processImg(data);

		let imgd = new ImageData(data, width, height);
		ctx.putImageData(imgd, 0, 0);

		let obj = {
			type: 'webcam',
			payload: canvas.toDataURL()
		}

		ws.send(JSON.stringify(obj));

		prevData = data;
		
		setTimeout(()=>{
			stepNum++;
			requestAnimationFrame(step);
		}, 40);
	}

    function processImg(data){
		// 2) Check and set previous image data.
		if(!prevData){
			prevData = data;
		}

		// 3) Run through image data pixels...
		for(let c = 0; c < data.length; c += 4){
			if(data[c + 0] >= prevData[c + 0] && data[c+1] >= prevData[c+1] + 2){
				data[c + 0] -= prevData[c + 1]/.3 + 20;
				data[c + 1] -= prevData[c + 2] / 1.9 + 10;
				data[c + 2] += prevData[c + 2] / 4;


				if(prevData[c+0] >= 135){
					data[c+0] += Math.sin(stepNum*.4 / prevData[c + 0] * 200) * 100;
					data[c+1] += Math.cos(stepNum*.4 / prevData[c + 1] * 200) * 100;
					data[c+2] = prevData[c+0]/5;
					data[c+3] += 10;
				}
				// console.log(c);
			}else{
				data[c + 0] = 40;
				data[c + 3] = 0;
			}
		}

		return data;
	}
</script>

<div>
	<img bind:this={webcamImg} class="webcam" id="webcam" src={wsSrc} />
	<canvas style="display:none" bind:this={canvas} />
	<video id="srcVid" autoplay bind:this={video} />
</div>

<style>
	.webcam{
		position: absolute;
		width: 600px;
	}
	#webcam{
		bottom: 0px;
		left: -135px;
  		transform: rotate(45deg);
		}

</style>