import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useRouter } from "preact-router";

import { IApiEvent, readEvent } from "../../modules/api";
import { gameSession } from "../../demo";
import { EventCard } from "../../components/event/EventDetail";

export const EventPage = () => {
	const [route] = useRouter();

	const [fetching, setFetching] = useState(false);
	const [event, setEvent] = useState<IApiEvent | null>(null);

	console.log(1, event)

	useEffect(() => {
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
	}, [route.matches?.id]);

	function handleClickBack() {
		window.history.back();
	}

	return (
		<section className="section">
			<div className="container">
				<button
					type="button"
					className="button-outline mb-10"
					onClick={handleClickBack}
				>
					Назад
				</button>
				{fetching ? (
					"Loading..."
				) : event !== null ? (
					<EventCard event={event} />
				) : (
					<EventCard game={gameSession} />
				)}
			</div>
		</section>
	);
};
