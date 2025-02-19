import { atom, ReadableAtom } from 'nanostores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const $tz: ReadableAtom<string> = atom(dayjs.tz.guess());
