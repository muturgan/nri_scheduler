import '@schedule-x/theme-default/dist/index.css';
import './calendar.css';

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/preact';
import { createViewMonthGrid } from '@schedule-x/calendar';

import { h } from 'preact';

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
		events: [
			{
				id: 1,
				title: 'first',
				start: '2025-01-07 20:15',
				end: '2025-01-07 21:15',
			},
			{
				id: 2,
				title: 'second',
				start: '2025-01-15 10:15',
				end: '2025-01-15 12:15',
			},
			{
				id: 3,
				title: 'third',
				start: '2025-01-15 11:15',
				end: '2025-01-15 13:15',
				people: ['aa', 'bb'],
				description: 'descr',
				location: 'loc',
			}
		],
	});

	return <ScheduleXCalendar calendarApp={calendar} />;
};
