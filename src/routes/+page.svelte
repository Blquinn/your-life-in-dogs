<script lang="ts">
	import { dogFormState, dogsPerBbq, hotDogArea, humanArea, minutesPerDog } from './state.svelte';
</script>

<main class="m-4 mb-8">
	<h1 class="text-4xl">Your life in hotdogs</h1>

	<div>
		<p>
			We waste a lot of time on our phones. The average American spends 5 hours per day on their
			phone. If you correctly think of all of that time on your phone as wasted time, then it begs
			the question of how much time you'll end up wasting over the course of your life.
		</p>
		<p>
			The amount of time is so large that it's hard to actually wrap your head around, so this site
			is an aid to help you visualize the amount of time waste.
		</p>
		<p>
			It is said that for every hot dog you eat, you lose 36 minutes of your life. <a
				class="text-blue-500 underline visited:text-purple-700"
				href="https://www.cnn.com/2021/08/27/health/hot-dog-could-shorten-life-trnd-wellness-scn/index.html"
				>CNN makes this claim here.</a
			>

			This may not be true, but it let's us talk about hot dogs, which is nice.
		</p>
		<p>
			If you imagine all of those hours you spend on your phone each day in terms of the number of
			hot dogs that you would have to eat to reduce your lifespan by the same amount, then it
			becomes much easier to visualize.
		</p>
	</div>

	<!-- <form onsubmit={() => false}>
    </form> -->
	<div class="form my-8 space-y-4">
		<h2 class="text-2xl">Your information</h2>

		{#snippet textInput(
			name: string,
			label: string,
			value: string | number,
			onChange: (val: string) => void
		)}
			<div>
				<label for={name} class="block text-sm/6 font-medium">{label}</label>
				<div class="mt-2">
					<input
						type="text"
						{name}
						id="price"
						class="rounded"
						{value}
						onchange={(e) => onChange((e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
		{/snippet}

		{@render textInput(
			'hoursOnPhonePerDay',
			'Number of hours spent on phone per day (avg screen time)',
			dogFormState.state.hoursOnPhonePerDay,
			(v) => dogFormState.updateHoursOnPhonePerDay(parseFloat(v))
		)}

		{@render textInput(
			'yearsLeft',
			'Number of years left to live',
			dogFormState.state.yearsLeft,
			(v) => dogFormState.updateYearsLeft(parseFloat(v))
		)}
	</div>

	<a class="rounded border px-6 py-5" href="/stats">Show me the damage</a>
</main>
