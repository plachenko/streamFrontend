<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
		// let recList = new webkitSpeechGrammarList();
		// console.log(recList)
		// recList.addFromString()

        let rec = new webkitSpeechRecognition();
		console.log(rec);

		let transcript = "";

		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = "English";

        rec.addEventListener('start', (e) => {
			console.log(e);
		});

		rec.addEventListener('error', (e) => {
			console.log(e);
		});

		rec.addEventListener('end', (e)=>{
			console.log(e);
		});

		rec.addEventListener('result', (e)=>{
			let tmp = "";

			for(let i = e.resultIndex; i < e.results.length; ++i){
				if(e.results[i].isFinal){
					transcript = e.results[i][0].transcript;
					// sendCmd(transcript.toLowerCase().replace(/\s/g, ''));
				}else{
					tmp += e.results[i][0].transcript;
				}
			}
			// console.log(transcript);
		});

		rec.start();
    });
</script>

<div>
    
</div>

<style>

</style>