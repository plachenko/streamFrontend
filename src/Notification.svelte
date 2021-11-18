<script lang="ts">
    import { onMount } from "svelte";

    export let noti;
    let notiEl;

    onMount(()=>{
        const wid = +window.getComputedStyle(notiEl).width;
        console.log(wid)
        notiEl.style.left = window.innerWidth/2 - wid/2;
    });
</script>

<div bind:this={notiEl} class="notification">{noti.event} has {noti.user}</div>

<style>
.notification{
		background-color:#000;
		color:#FFF;
		padding: 20px;
		font-size: 25px;
		position: absolute;
		}
</style>