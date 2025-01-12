import { atom, ReadableAtom, WritableAtom } from 'nanostores';
import { nanoquery } from '@nanostores/query';

import { readEvent, IApiEvent } from '../api';

const [createFetcherStore, createMutatorStore] = nanoquery({
	fetcher: (...keys) => readEvent(keys[0] as string),
});

const $currentEventId = atom('');
export const $currentEvent = createFetcherStore<IApiEvent | null>([$currentEventId]);

export const navigateEvent = (eventId: string) => {
	$currentEventId.set(eventId);
}
