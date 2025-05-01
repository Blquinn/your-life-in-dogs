<script lang="ts">
	import { onMount } from 'svelte';
	import {
		dogFormState,
		hotDogLength,
		hotDogWidth,
		humanHeight,
		humanWidth
	} from '../state.svelte';
	import { SvelteMap } from 'svelte/reactivity';

	function loop(cb: (dt: number) => void) {
		let last = performance.now();

		const onFrame = () => {
			const now = performance.now();
			cb((now - last) / 1000);
			last = now;

			requestAnimationFrame(onFrame);
		};

		requestAnimationFrame(onFrame);
	}

	const screenWidth = 800;
	const screenHeight = 600;

	const scaleFactor = 6; // px per virtual inch

	const dogWidth = hotDogWidth * scaleFactor;
	const dogHeight = hotDogLength * scaleFactor;

	const manHeight = humanHeight * scaleFactor;
	const manWidth = humanWidth * scaleFactor;

	let autodogEnabled = $state(false);

	let dogsRemaining = $state(dogFormState.state.totalDogs);

	let timeSliderValue = $state(0);
	let timeMultiplier = $derived(Math.pow(10, timeSliderValue));

	let dogsPerHour = $derived(dogFormState.state.totalDogs / dogFormState.state.daysLeft / 24);
	let spawnRate = $derived((dogsPerHour / 60 / 60) * timeMultiplier);
	let dogVelocity = $derived(autodogEnabled ? (spawnRate * screenWidth) / dogWidth : 400);

	let startTime = new Date();
	let totalGameTimeElapsed = $state(0.0);
	let simulationTime = $derived(new Date(startTime.getTime() + totalGameTimeElapsed));

	type DogEntity = {
		x: number;
		y: number;
	};

	let currentId = 0;
	function nextId() {
		return ++currentId;
	}

	let inFlightDogs: Map<number, DogEntity> = new SvelteMap();

	let spawnCounter = 0.0;

	function spawnDog() {
		if (dogsRemaining - inFlightDogs.size <= 0) {
			return;
		}

		const id = nextId();
		inFlightDogs.set(id, {
			x: screenWidth + dogWidth,
			y: screenHeight - dogWidth - (manHeight - 8 * scaleFactor)
		});
	}

	function updateDogs(dt: number) {
		let rem = [];
		for (let [id, dog] of inFlightDogs.entries()) {
			dog.x -= dogVelocity * dt;

			if (dog.x < 0) {
				rem.push(id);
			}

			inFlightDogs.set(id, { ...dog });
		}

		for (let id of rem) {
			inFlightDogs.delete(id);
			dogsRemaining--;
		}

		spawnCounter += dt;

		if (autodogEnabled && dogsRemaining > 0) {
			while (spawnCounter > 1.0 / spawnRate) {
				spawnDog();
				spawnCounter -= 1 / spawnRate;
			}
		}
	}

	// Main animation loop callback
	function onLoop(dt: number) {
		totalGameTimeElapsed += dt * 1000 * (autodogEnabled ? timeMultiplier : 1);
		// Spawn another dog
		updateDogs(dt);
	}

	onMount(() => {
		loop(onLoop);
	});
</script>

<div class="m-4">
	<a class="rounded border px-2 py-1" href="/dog-mountain">Go Back</a>
</div>

<main class="flex flex-col items-center justify-center space-y-4">
	{#if dogsRemaining > 0}
		<h2 class="text-2xl">I hope you're hungry</h2>

		<div class="flex flex-col items-center space-y-2">
			<h3 class="text-xl">dogstat</h3>
			<table>
				<tbody>
					<tr>
						<td class="pr-2 text-right">Simulation time</td>
						<td class="w-48 text-left"
							>{simulationTime.toLocaleDateString()} {simulationTime.toLocaleTimeString()}</td
						>
					</tr>
					<tr>
						<td class="pr-2 text-right">Dogs eaten</td>
						<td class="w-48 text-left">{dogFormState.state.totalDogs - dogsRemaining}</td>
					</tr>
					<tr>
						<td class="pr-2 text-right">Dogs remaining</td>
						<td class="w-48 text-left">{dogsRemaining}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			class="relative overflow-hidden border"
			style={`
                width: ${screenWidth}px;
                height: ${screenHeight}px;
            `}
		>
			<div
				style={`
                    position: absolute;
                    width: ${manWidth}px;
                    left: 0px;
                    top: ${screenHeight - manHeight}px;
                `}
			>
				<div
					style={`
                    position: absolute;
                    background-color: white;
                    height: ${manHeight - 1}px;
                    width: ${manWidth / 2 - 3}px;
                    z-index: 10;
                `}
				></div>

				<img
					src="/man.png"
					alt="Hungry human"
					height={manHeight}
					width={manWidth}
					class="absolute"
					style={`
                        height: ${manHeight}px;
                        width: ${manWidth}px;
                        z-index: 11;
                        width: ${manWidth}px;
                    `}
				/>
			</div>

			{#each inFlightDogs.entries() as [id, dog] (id)}
				<img
					src="/hotdog.png"
					alt="Hotdog"
					width={dogWidth}
					height={dogHeight}
					class="absolute rotate-90"
					style={`
                        top: ${dog.y}px;
                        left: ${dog.x - dogWidth}px;
                    `}
				/>
			{/each}
		</div>

		{#if autodogEnabled}
			<div class="m-auto">
				<p>
					By default, autodog runs in real time. In other words it will spawn hot dogs at a rate of {dogsPerHour.toFixed(
						3
					)} per hour.
				</p>
				<label for="dog-rate" class="flex items-center space-x-2">
					<input
						class="w-92"
						type="range"
						name="dog-rate"
						id="dog-rate"
						min="0"
						max="7"
						step="1"
						bind:value={timeSliderValue}
					/>
					<span>Time speedup -- {timeMultiplier}x real time</span>
				</label>
			</div>
		{:else}
			<button class="cursor-pointer rounded border px-8 py-6" onmousedown={spawnDog}
				>Another one wouldn't hurt</button
			>
		{/if}

		<label for="autodog" class="flex flex-row items-center space-x-2">
			<input id="autodog" type="checkbox" bind:checked={autodogEnabled} />
			<span>Enable Autodog</span>
		</label>
	{:else}
		<p class="text-4xl">Congratulations, you died!</p>
	{/if}
</main>
