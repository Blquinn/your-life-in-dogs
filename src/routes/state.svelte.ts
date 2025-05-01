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

export type DogFormState = {
	// Actual form values
	hoursOnPhonePerDay: number;

	// Derived values
	totalWaste: number;
	totalDogs: number;
	wastePerDay: number;
	totalBbqsAttended: number;
	yearsLeft: number;
	daysLeft: number;
};

export const dogFormState = (() => {
	let state: DogFormState = $state({
		// Actual form values
		hoursOnPhonePerDay: 5.0,

		// Derived values
		totalWaste: 0.0,
		totalDogs: 0.0,
		wastePerDay: 0.0,
		totalBbqsAttended: 0.0,
		yearsLeft: 50,
		daysLeft: 0
	});

	const recalculate = () => {
		state.wastePerDay = state.hoursOnPhonePerDay * 60.0;
		state.daysLeft = state.yearsLeft * 365.0;
		state.totalWaste = state.wastePerDay * state.daysLeft;
		state.totalDogs = Math.ceil(state.totalWaste / minutesPerDog);
		state.totalBbqsAttended = state.totalDogs / dogsPerBbq;
	};

	recalculate();

	return {
		get state(): Readonly<DogFormState> {
			return state;
		},
		updateHoursOnPhonePerDay(hoursOnPhonePerDay: number) {
			state.hoursOnPhonePerDay = hoursOnPhonePerDay;
			recalculate();
		},
		updateYearsLeft(yearsLeft: number) {
			state.yearsLeft = yearsLeft;
			recalculate();
		}
	};
})();
