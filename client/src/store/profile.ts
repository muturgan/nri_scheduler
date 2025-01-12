import { atom, ReadableAtom, WritableAtom } from 'nanostores';

export const $signed: ReadableAtom<boolean> = atom(false);

export const enter = () => {
	($signed as WritableAtom<boolean>).set(true);
}

export const leave = () => {
	($signed as WritableAtom<boolean>).set(false);
}
