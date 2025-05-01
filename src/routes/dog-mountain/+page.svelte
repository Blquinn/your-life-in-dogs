<script lang="ts">
	import { onMount } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { Tween } from "svelte/motion";
	import { dogFormState, hotDogLength, hotDogWidth, humanHeight, humanWidth } from "../state.svelte";

    // Dogs bounding box

    let showControls = $state(false);

    let tdh = $derived(dogFormState.state.totalDogs * hotDogLength);
    let tdw = $derived(dogFormState.state.totalDogs * hotDogWidth);
    let boundingBoxWidth = $derived((tdh + tdw) / 2);

    let x = new Tween(-1000, {
        duration: 5000,
        easing: cubicInOut,
    });
    let y = new Tween(-4000, {
        duration: 5000,
        easing: cubicInOut,
    });
    let scale = new Tween(40, {
        duration: 5000,
        easing: cubicInOut,
    });

    async function moveToHuman() {
        await Promise.all([
            x.set(0),
            y.set(0),
            scale.set(2),
        ])
    }

    async function moveToSomeDogs() {
        await Promise.all([
            x.set(-1000),
            y.set(-4000),
            scale.set(40),
        ])
    }

    async function zoomWayOut() {
        // TODO: Calculate required scale to fit the bounding box
        const destScale = 0.001;
        await Promise.all([
            x.set(boundingBoxWidth / 4 * destScale),
            y.set(boundingBoxWidth / 4 * destScale),
            scale.set(destScale),
        ])
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    onMount(async () => {
        await sleep(2000);

        await moveToHuman();

        await sleep(2000);

        await zoomWayOut();

        showControls = true;
    })
</script>

<main class="h-screen w-screen flex flex-col">

    <div class="flex flex-row items-center justify-between m-4">
        <a class="border rounded px-2" href="/stats">Go Back</a>
    </div>

    <div
        class="mx-4 mb-4 aspect-square items-end overflow-hidden border">
        <!-- The pan/zoom scene -->
        <div style={`
            transform-origin: top left;
            transform: matrix(${scale.current}, 0, 0, ${scale.current}, ${x.current}, ${y.current});
        `}>
            <div class="flex flex-row items-center">
                <div class="mr-2" style={`
                    height: ${humanHeight}px; 
                    width: ${humanWidth}px;
                    background-image: url("/human.png");
                    background-size: ${humanWidth}px ${humanHeight}px;
                `}>
                </div>
                <p>This is you standing on a friggin mountain of hot dogs</p>
            </div>
            <div style={`
                height: ${boundingBoxWidth}px;
                width: ${boundingBoxWidth}px;
                background-size: ${hotDogWidth}px ${hotDogLength}px;
            ` + ((scale.current < 1) ? `
                background-color: #a65021;
            ` : `
                background-image: url("/hotdog.png");
                background-repeat: repeat;
                background-position: top left;
            `)}></div>
            <p style={`
                height: ${boundingBoxWidth / 3}px;
                width: ${boundingBoxWidth}px;
                font-size: ${(boundingBoxWidth ).toFixed()}px;
            `}>This is how many hot dogs you would need to eat</p>
        </div>
    </div>

    {#if showControls}
        <div class="flex flex-col sm:flex-row space-y-2 space-x-2 px-4 self-center">
            <!-- <div>Current scale <span class="font-mono">{(currentTransform?.scale ?? 1).toFixed(3)}</span></div> -->
            <button class="border rounded px-2" onclick={moveToHuman}>Where am I?</button>
            <button class="border rounded px-2" onclick={moveToSomeDogs}>I wanna see one glisten</button>
            <button class="border rounded px-2" onclick={zoomWayOut}>Show me all'a them dogs</button>
        </div>

        <div class="my-8 flex justify-center">
            <a class="border rounded px-6 py-5" href="/bbq">I'm ready to eat</a>
        </div>
    {/if}
</main>
