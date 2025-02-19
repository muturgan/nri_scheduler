import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useRouter } from "preact-router";
import { useStore } from "@nanostores/preact";

import dayjs from "dayjs";
import "dayjs/locale/ru";

import { $tz } from "../../modules/store/tz";

import { GameSession } from "../../types";
import { IApiEvent, readEvent } from "../../modules/api";
import { gameSession } from "../../demo";

dayjs.locale("ru");

interface Props {
	event?: IApiEvent;
	game: GameSession;
}

const EventCard = ({ event, game }: Props) => {
	const tz = useStore($tz);

	console.log(event);

	const [isLoading, setIsLoading] = useState(false);
	const [buttonStatus, setButtonStatus] = useState("Записаться");

	const master = game.master;
	const players = game.players;
	const story = game.story;
	const sessionDetails = game.sessionDetails;

	const eventDate = dayjs(sessionDetails.date).tz(tz);
	const customDay = eventDate.format("DD MMMM");
	// const customTime = eventDate.format("HH:mm");

	console.log(sessionDetails);

	function handleClick() {
		setIsLoading(true);
		setButtonStatus("...");

		setTimeout(() => {
			setIsLoading(false);
			setButtonStatus("Записаны!");
		}, 1500);
	}

	return (
		<div className="event">
			<div className="event-card">
				<p className="event-card__desc">Информация о сессии</p>
				<h1 className="event-card__title">{story.title}</h1>
				<p className="event-card__text">{story.description}</p>
				<p className="event-card__desc">Место действия: {story.setting}</p>
				<h2 className="event__text">Мастер игры</h2>
				<p className="event-card__desc">
					Имя:{" "}
					<a href="#" className="event-card__location">
						{master.name}
					</a>
				</p>

				<h2 className="event__text">Игроки</h2>
				{players.map((player, index) => (
					<p className="event-card__desc" key={index}>
						<a href="#" className="event-card__location">
							{player.name}
						</a>
					</p>
				))}

				<h2 className="event__text">Детали сессии</h2>
				<p className="event-card__desc">{`Дата: ${customDay}`}</p>
				<p className="event-card__desc">
					Продолжительность: {sessionDetails.duration}
				</p>
				<p className="event-card__desc">
					Локация:{" "}
					<a href="#" className="event-card__location">
						{sessionDetails.location}
					</a>
				</p>
				<p className="event-card__desc">Заметки: {sessionDetails.notes}</p>

				<button
					type="button"
					className="event-card__button"
					onClick={handleClick}
					disabled={isLoading}
				>
					{isLoading ? (
						<span>Загрузка ...</span>
					) : (
						<span>{buttonStatus}</span>
					)}
				</button>
			</div>
		</div>
	);
};

export const EventPage = () => {
	const [route] = useRouter();

	const [fetching, setFetching] = useState(false);
	const [event, setEvent] = useState<IApiEvent | null>(null);

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
		<section className="form-page">
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
				<EventCard event={event} game={gameSession} />
			) : (
				<EventCard game={gameSession} />
			)}
		</section>
	);
};
