import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import { h } from '@fullcalendar/core/preact'
import { useEffect, useRef } from 'preact/hooks';

export const Calendar = () => {
	const calendarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const calendarEl = calendarRef.current;
		if (calendarEl !== null) {
			const calendar = new FullCalendar(calendarEl, {
					plugins: [dayGridPlugin],
					initialView: 'dayGridMonth',
					locale: ruLocale,
			});

			calendar.render();
		}
	}, []);

	return <div ref={calendarRef}></div>;
};
