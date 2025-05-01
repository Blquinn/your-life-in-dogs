<script lang="ts">
	import { dogFormState, dogsPerBbq, hotDogArea, humanArea, minutesPerDog } from '../state.svelte';
</script>

<div class="m-4 flex flex-row items-center justify-between">
	<a class="rounded border px-2" href="/">Go Back</a>
</div>

<main class="m-4 mb-8">
	<div class="flex flex-col space-y-4">
		<div>
			<h2 class="text-2xl">Total Waste</h2>

			<p>
				This is the total amount of time that you will have wasted on your phone by the time you
				die.
			</p>

			<div>
				<div>{dogFormState.state.totalWaste} minutes</div>
				<div>{(dogFormState.state.totalWaste / 60).toFixed()} hours</div>
				<div>{(dogFormState.state.totalWaste / 60 / 24).toFixed()} days</div>
				<div>{(dogFormState.state.totalWaste / 60 / 24 / 365).toFixed()} years</div>
			</div>
		</div>

		<div>
			<h2 class="text-2xl">Hotdogs</h2>

			<p>
				This is the amount of hot dogs you would have to consume to waste the same amount of time.
			</p>

			<div>{dogFormState.state.totalDogs.toFixed()} total</div>
			<div>
				{(dogFormState.state.totalDogs / dogFormState.state.yearsLeft).toFixed()} per
				year
			</div>
			<div>
				{(dogFormState.state.totalDogs / dogFormState.state.daysLeft).toFixed()} per day
			</div>
			<div>
				{(dogFormState.state.totalDogs / dogFormState.state.daysLeft / 16).toFixed(
					2
				)} per waking hour
			</div>
		</div>

		<div>
			<h2 class="text-2xl">BBQ Stats</h2>

			<p>
				This is the number of barbeques you would need to attent over the course of your life in
				order to eat all of those hot dogs.
			</p>

			<div>{dogsPerBbq} Dogs per BBQ</div>

			<div>{dogFormState.state.totalBbqsAttended.toFixed()} BBQs attended</div>
		</div>

		<div>
			<h2 class="text-2xl">Area of all those dogs</h2>

			<p>This is the sum total area of all of the hot dogs you have to eat.</p>

			<div>{dogFormState.state.totalDogs * hotDogArea} square inches</div>

			<div>{dogFormState.state.totalDogs * hotDogArea / 12} square feet</div>

			<div>{(dogFormState.state.totalDogs * hotDogArea / 12 / 5280).toFixed()} square miles</div>
		</div>
	</div>

	<div class="mt-8">
		<a href="/dog-mountain" class="rounded border px-6 py-5">Show me them dogs</a>
	</div>
</main>
