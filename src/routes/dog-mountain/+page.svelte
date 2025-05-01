<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import {
		dogFormState,
		hotDogLength,
		hotDogWidth,
		humanHeight,
		humanWidth
	} from '../state.svelte';
	import { Vector2D } from '$lib/vector2d';

	const animationPause = 2000;
	const animationDuration = 5000;

	let showControls = $state(false);

	// The dimensions of the viewport element in pixels
	let viewportWidth = $state(0);
	let viewportHeight = $state(0);

	// The dimensions of the hot dog square in pixels (and also inches)
	let tdh = $derived(dogFormState.state.totalDogs * hotDogLength);
	let tdw = $derived(dogFormState.state.totalDogs * hotDogWidth);
	let boundingBoxWidth = $derived((tdh + tdw) / 2);

	// Determines the scale necessary to fit a box of a certain size in the viewport.
	function scaleToFixBox(box: Vector2D): number {
		const widthScale = viewportWidth / box.x;
		const heightScale = viewportHeight / box.y;
		return Math.min(widthScale, heightScale);
	}

	function getCenterOfSquare(scale: number): Vector2D {
		return new Vector2D((-tdw / 2) * scale, (-tdw / 2) * scale);
	}

	let x = new Tween(-1000, {
		duration: animationDuration,
		easing: cubicInOut
	});
	let y = new Tween(-4000, {
		duration: animationDuration,
		easing: cubicInOut
	});
	let scale = new Tween(40, {
		duration: animationDuration,
		easing: cubicInOut
	});

	async function moveToHuman() {
		const humanScale = scaleToFixBox(new Vector2D(humanHeight * 6, humanHeight));
		await Promise.all([x.set(0), y.set(0), scale.set(humanScale)]);
	}

	async function moveToSomeDogs(duration: number = animationDuration) {
		const dogScale = scaleToFixBox(new Vector2D(hotDogWidth, hotDogLength).multiply(8));
		const dogCenter = getCenterOfSquare(dogScale);

		await Promise.all([
			x.set(dogCenter.x, { duration }),
			y.set(dogCenter.y, { duration }),
			scale.set(dogScale, { duration })
		]);
	}

	async function zoomWayOut() {
		const padding = boundingBoxWidth / 10;

		const size = new Vector2D(boundingBoxWidth, boundingBoxWidth).add(
			new Vector2D(padding, padding)
		);

		const destScale = scaleToFixBox(size);
		const dest = getCenterOfSquare(destScale);

		const offset = padding / 2;

		await Promise.all([
			x.set((dest.x + offset) * destScale),
			y.set((dest.y + offset) * destScale),
			scale.set(destScale)
		]);
	}

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	onMount(async () => {
		await moveToSomeDogs(0);

		await sleep(animationPause);

		await moveToHuman();

		await sleep(animationPause);

		await zoomWayOut();

		await sleep(animationPause);

		showControls = true;
	});
</script>

<main class="p-4">
	<div class="mb-4 flex flex-row items-center justify-between">
		<a class="rounded border px-2" href="/stats">Go Back</a>
	</div>

	<div
		class="mx-auto mt-4
            aspect-square max-h-128 max-w-128
            overflow-hidden border"
	>
		<!-- The pan/zoom scene -->
		<div
			bind:clientWidth={viewportWidth}
			bind:clientHeight={viewportHeight}
			style={`
                transform-origin: top left;
                transform: matrix(${scale.current}, 0, 0, ${scale.current}, ${x.current}, ${y.current});
            `}
		>
			<div class="flex max-w-128 flex-row items-center">
				<div
					class="mr-2"
					style={`
                    height: ${humanHeight}px; 
                    width: ${humanWidth}px;
                    background-image: url("/human.png");
                    background-size: ${humanWidth}px ${humanHeight}px;
                `}
				></div>
				<p>This is you standing on a friggin mountain of hot dogs</p>
			</div>
			<div
				style={`
                height: ${boundingBoxWidth}px;
                width: ${boundingBoxWidth}px;
                background-size: ${hotDogWidth}px ${hotDogLength}px;
            ` +
					(scale.current < 1
						? `background-color: #a65021;`
						: `background-image: url("/hotdog.png");
                			background-repeat: repeat;
                			background-position: top left;`)}
			></div>
		</div>
	</div>

	{#if showControls}
		<p class="p-4 text-center">This is the number of hot dogs you need to eat.</p>
		<div class="mt-4 flex flex-col justify-center space-y-2 space-x-2 px-4 sm:flex-row">
			<button class="rounded border px-2" onclick={moveToHuman}>Where am I?</button>
			<button class="rounded border px-2" onclick={() => moveToSomeDogs()}
				>I wanna see one glisten</button
			>
			<button class="rounded border px-2" onclick={zoomWayOut}>Show me all'a them dogs</button>
		</div>

		<div class="mx-auto my-8 flex justify-center">
			<a class="rounded border px-6 py-5" href="/bbq">I'm ready to eat</a>
		</div>
	{/if}
</main>
