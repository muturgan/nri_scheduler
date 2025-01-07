import { create } from 'zustand';

interface IFetchingStore {
	readonly fetching: boolean;
	startFetching(): void;
	stopFetching(): void;
}

export let startFetching: () => void;
export let stopFetching: () => void;

export const useFetchingStore = create<IFetchingStore>((set) => {
	startFetching = () => set(() => ({ fetching: true  }));
	stopFetching = () => set(() => ({ fetching: false }));

	return {
		fetching: false,
		startFetching,
		stopFetching,
	};
});
