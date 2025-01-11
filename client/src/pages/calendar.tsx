import '@schedule-x/theme-default/dist/index.css';
import './calendar.css';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/preact';
import { createViewMonthGrid } from '@schedule-x/calendar';

import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { readEventsList } from '../api';

dayjs.extend(utc);
dayjs.extend(timezone);

const localTz = dayjs.tz.guess();
const EVENT_FORMAT = 'YYYY-MM-DD HH:mm';

export const Calendar = () => {
	const calendar = useCalendarApp({
		locale: 'ru-RU',
		views: [
			createViewMonthGrid(),
		],
		callbacks: {
			onEventClick(event) {
				console.log(event);
			},
			onClickDate(date) {
				console.log({date});
			}
		},
	});

	useEffect(() => {
		const now = dayjs().tz(localTz);
		const monthStart = now.startOf('M').format();
		const monthEnd = now.endOf('M').format();

		/** @todo передавать таймзону, возвращать в нужной таймзоне, присылать название кампании, локации, список людей */
		readEventsList(monthStart, monthEnd)
			.then((res) => {
				if (res !== null) {
					calendar.events.set(
						res.payload.map((apiEv) => {
							const start = dayjs(apiEv.date);
							const end = start.add(2, 'h');

							return {
								id: apiEv.id,
								title: apiEv.company,
								location: apiEv.location,
								people: apiEv.players,
								start: start.format(EVENT_FORMAT),
								end: end.format(EVENT_FORMAT),
							};
						})
					);
				}
			});
	}, []);

	return <ScheduleXCalendar calendarApp={calendar} />;
};
