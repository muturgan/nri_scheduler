import type { UUID } from 'node:crypto';

import { atom, ReadableAtom, WritableAtom } from 'nanostores';
import { nanoquery } from '@nanostores/query';

import { readEvent, IApiEvent } from '../api';

const [createFetcherStore, createMutatorStore] = nanoquery({
	fetcher: (...keys) => readEvent(keys[0] as UUID),
});

const $currentEventId = atom('' as UUID);
export const $currentEvent = createFetcherStore<IApiEvent | null>([$currentEventId]);

export const navigateEvent = (eventId: UUID) => {
	$currentEventId.set(eventId);
}
