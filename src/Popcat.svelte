<script lang="ts">
    import { onMount } from "svelte";
	import gsap from 'gsap';

	let popCatEl;

    onMount(() => {
    });

    function popCat(){
		let posSet = ~~(Math.random()*10);
		let xPos = window.innerWidth;
		let yPos = window.innerHeight;
		let xSet, ySet;

		if(posSet >= 5){
			xPos = posSet >= 7 ? -100 : window.innerWidth;
			yPos = ~~(Math.random() * window.innerHeight);
			xSet = xPos < 0 ? '+=100' : '+100';
			ySet = yPos;
		} else {
			xPos = ~~(Math.random() * window.innerWidth);
			yPos = posSet >= 3 ? -100 : window.innerHeight;
			ySet = yPos < 0 ? '-=100' : '+100';
			xSet = xPos;
		}

		popCatEl.style.left = xPos+'px';
		popCatEl.style.top = yPos+'px';
		
		console.log(xSet, ySet);
		
		gsap.to(popCatEl, {x: xSet, y: ySet, visibility:'visible', duration: 1, onComplete: () => {
			// gsap.to(popCatEl, {visibility: 'hidden', x: xPos, y: yPos});
		}});
		// gsap.to('.popCat', {rotation: '+=360', duration: 1})
	}

</script>

<div>
	<div class="popCat" bind:this={popCatEl}></div>
</div>

<style>
	.popCat{
		position: absolute;
		/* visibility: hidden; */
		background-color:#F00;
		width: 100px;
		height: 100px;
	}
</style>