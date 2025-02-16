import { h, Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useRouter } from 'preact-router';
import { useStore } from '@nanostores/preact';

import dayjs from 'dayjs';

import { IApiEvent, readEvent } from '../../api';
import { $tz } from '../../store/tz';

const EventCard = ({event}: {event: IApiEvent}) => {
	const tz = useStore($tz);

	const eventDate = dayjs(event.date).tz(tz);

	return <>
		<p>Кампания: {event.company}</p>
		<p>Мастер: {event.master}</p>
		<p>Место проведения: {event.location}</p>
		<p>Дата: {eventDate.format('YYYY-MM-DD')}</p>
		{/* todo: добавить продолжительность сессии */}
		<p>Время: {eventDate.format('HH:mm')}</p>

		<button
			type="button"
			className="pure-button pure-button-primary"
		>Записаться</button>
	</>;
};

export const EventPage = () => {
	const [route] = useRouter();

	const [fetching, setFetching] = useState(false);
	const [event, setEvent] = useState<IApiEvent | null>(null);

	useEffect(
		() => {
			const eventId = route.matches?.id;
			if (eventId) {
				setFetching(true);
				readEvent(eventId)
					.then((res) => {
						if (res !== null) {
							setEvent(res.payload);
						}
					})
					.finally(() => {
						setFetching(false);
					});
			}
		},
		[route.matches?.id],
	);

	return (
		<div className="form-page">
			{
				fetching
					? 'Loading...'
					: event !== null
						? <EventCard event={event} />
						: 'Ошибка загрузки'
			}
		</div>
	);
};
