import { writable } from 'svelte/store';

function createLocation() {
	const { subscribe, set, update } = writable('Bach Khoa University');

	return {
		subscribe,
		update: (x:string) => update((n) => x),
		reset: () => set('Bach Khoa University')
	};
}

export const location = createLocation();