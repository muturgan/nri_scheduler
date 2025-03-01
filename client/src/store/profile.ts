import type { UUID } from "node:crypto";

import { atom, computed, map, ReadableAtom, WritableAtom } from 'nanostores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import type { IApiSelfInfo } from '../api';

dayjs.extend(utc);
dayjs.extend(timezone);

/** @todo добавить все временные зоны */
const TIMEZONES = {
	2: 'Europe/Kaliningrad',
	3: 'Europe/Moscow',
	4: 'Europe/Samara',
	5: 'Asia/Yekaterinburg',
	6: 'Asia/Omsk',
	7: 'Asia/Krasnoyarsk',
	8: 'Asia/Irkutsk',
	9: 'Asia/Yakutsk',
	10: 'Asia/Vladivostok',
	11: 'Asia/Magadan',
	12: 'Asia/Kamchatka',
} as const;

const MASTERY_KEY = 'nri_mastery';

export const $tz: ReadableAtom<string> = atom(dayjs.tz.guess());

const setOffset = (offset: number) => {
	if (!(offset in TIMEZONES)) {
		console.error('Передано кривое смещение временной зоны', offset);
		return;
	}

	const timeZone = TIMEZONES[offset as keyof typeof TIMEZONES];
	($tz as WritableAtom<string>).set(timeZone);
};

const $currentUser: ReadableAtom<UUID | null> = atom(null);
export const $signed = computed($currentUser, (currentUser) => currentUser !== null);

export const enter = ({ id, timezone_offset }: IApiSelfInfo) => {
	($currentUser as WritableAtom<UUID | null>).set(id);

	if (typeof timezone_offset === "number") {
		setOffset(timezone_offset);
	}
}

export const leave = () => {
	($currentUser as WritableAtom<UUID | null>).set(null);
}

$signed.listen((signed) => {
	if (!signed) {
		($tz as WritableAtom<string>).set(dayjs.tz.guess());
	}
});

const $masteryMap = map((() => {
	const stored = localStorage.getItem(MASTERY_KEY) || '{}';

	let parsed: Record<UUID, boolean | undefined>;
	try {
		parsed = JSON.parse(stored);
	} catch {
		localStorage.removeItem(MASTERY_KEY);
		parsed = {};
	}

	return parsed;
})());



export const $mastery = computed(
	[$masteryMap, $currentUser],
	(masteryMap, currentUser) => {
		return currentUser !== null && masteryMap[currentUser] === true
	},
);

export const enableMastery = () => {
	const current = $currentUser.get();
	if (current === null) {
		return;
	}

	$masteryMap.setKey(current, true);

	const currentMap = $masteryMap.get();
	localStorage.setItem(MASTERY_KEY, JSON.stringify(currentMap));
}

export const disableMastery = () => {
	const current = $currentUser.get();
	if (current === null) {
		return;
	}

	$masteryMap.setKey(current, undefined);

	const currentMap = $masteryMap.get();
	localStorage.setItem(MASTERY_KEY, JSON.stringify(currentMap));
}
