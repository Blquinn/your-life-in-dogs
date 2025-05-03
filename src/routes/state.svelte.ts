// In inches
export const hotDogWidth = 1.0;
export const hotDogLength = 6.0;

export const hotDogArea = hotDogWidth * hotDogLength;

// In inches
export const humanHeight = 69.0;
export const humanWidth = 18.0;

export const humanArea = humanHeight * humanWidth;

export const minutesPerDog = 36.0;

export const dogsPerBbq = 2.0;

// Dogs

export type WasteEntry = {
	id: string;
	name: string;
	// In hours
	hours: number;
};

export type DogFormState = {
	entries: WasteEntry[];
	// Actual form values
	// hoursOnPhonePerDay: number;

	// Derived values
	totalWaste: number;
	totalDogs: number;
	wastePerDay: number;
	totalBbqsAttended: number;
	yearsLeft: number;
	daysLeft: number;
};

const stateStorageKey = 'form-state';

export const dogFormState = (() => {
	const storedValue = window.localStorage.getItem(stateStorageKey);

	let initialState: DogFormState;

	if (storedValue) {
		initialState = JSON.parse(storedValue);
	} else {
		initialState = {
			entries: [
				{
					id: crypto.randomUUID(),
					name: 'Phone Usage',
					hours: 5.0
				}
			],
			// Actual form values
			// hoursOnPhonePerDay: 5.0,

			// Derived values
			totalWaste: 0.0,
			totalDogs: 0.0,
			wastePerDay: 0.0,
			totalBbqsAttended: 0.0,
			yearsLeft: 50,
			daysLeft: 0
		};
	}

	const state: DogFormState = $state(initialState);

	const recalculateAndStore = () => {
		const totalHours = state.entries.reduce((p, c) => p + c.hours, 0);

		state.wastePerDay = totalHours * 60.0;
		state.daysLeft = state.yearsLeft * 365.0;
		state.totalWaste = state.wastePerDay * state.daysLeft;
		state.totalDogs = Math.ceil(state.totalWaste / minutesPerDog);
		state.totalBbqsAttended = state.totalDogs / dogsPerBbq;

		window.localStorage.setItem('form-state', JSON.stringify(state));
	};

	recalculateAndStore();

	return {
		get state(): Readonly<DogFormState> {
			return state;
		},
		addEntry() {
			state.entries.push({
				id: crypto.randomUUID(),
				name: '',
				hours: 1
			});
			recalculateAndStore();
		},
		removeEntry(id: string) {
			state.entries.splice(
				state.entries.findIndex((e) => e.id == id),
				1
			);
			recalculateAndStore();
		},
		updateEntryName(id: string, name: string) {
			state.entries.find((e) => e.id == id)!.name = name;
			recalculateAndStore();
		},
		updateEntryHours(id: string, hours: number) {
			state.entries.find((e) => e.id == id)!.hours = hours;
			recalculateAndStore();
		},
		updateYearsLeft(yearsLeft: number) {
			state.yearsLeft = yearsLeft;
			recalculateAndStore();
		}
	};
})();
