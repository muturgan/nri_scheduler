import '@schedule-x/theme-default/dist/index.css';

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/preact';
import { createViewMonthGrid } from '@schedule-x/calendar';

import { h } from 'preact';

export const Calendar = () => {
	const calendar = useCalendarApp({
		views: [
			createViewMonthGrid(),
		],
	});

	return <ScheduleXCalendar calendarApp={calendar} />;
};
