<script lang="ts">
	import { dogFormState } from './state.svelte';
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

		<p class="text-md">You can add any other time wasting activities below.</p>

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

		{#each dogFormState.state.entries as entry (entry.id)}
			<div class="flex flex-row space-x-2">
				{@render textInput(
					'activityName',
					'Activity name',
					entry.name,
					(v) => dogFormState.updateEntryName(entry.id, v)
				)}
				<div>
					<label for="hoursSpent" class="block text-sm/6 font-medium">Hours spent</label>
					<div class="mt-2">
						<input
							type="number"
							step="0.25"
							name="hoursSpent"
							id="price"
							class="rounded"
							value={entry.hours}
							onchange={(e) => dogFormState.updateEntryHours(entry.id, parseFloat((e.target as HTMLInputElement).value))}
						/>
					</div>
				</div>
				<button class="rounded border px-2 py-1 self-end"
					onclick={() => dogFormState.removeEntry(entry.id)}>Remove</button>
			</div>
		{/each}

		<button class="rounded border px-2 py-1"
			onclick={() => dogFormState.addEntry()}
		>Add Activity</button>
	</div>

	<div class="my-16">
		<a class="rounded border px-6 py-5" href="/stats">Show me the damage</a>
	</div>
</main>
