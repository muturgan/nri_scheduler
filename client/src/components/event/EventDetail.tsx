import { h } from "preact";
import dayjs from "dayjs";
import { IApiEvent } from "../../modules/api";
import { GameSession } from "../../types";

import "dayjs/locale/ru";
import { useStore } from "@nanostores/preact";
import { useState } from "preact/hooks";
import { $tz } from "../../modules/store/tz";
import { Button } from "../UI/Button";
dayjs.locale("ru");

interface Props {
	event?: IApiEvent;
	game?: GameSession;
}

export const EventCard = ({ event, game }: Props) => {
	const tz = useStore($tz);

	const [isLoading, setIsLoading] = useState(false);
	const [buttonStatus, setButtonStatus] = useState("Записаться");

	const master = game?.master;
	const players = game?.players;
	const story = game?.story;
	const sessionDetails = game?.sessionDetails;

	const eventDate = dayjs(sessionDetails?.date).tz(tz);
	const customDay = eventDate.format("DD MMMM");
	// const customTime = eventDate.format("HH:mm");

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
				<h1 className="event-card__title">{story?.title}</h1>
				<p className="event-card__text">{story?.description}</p>
				<p className="event-card__desc">Место действия: {story?.setting}</p>
				<h2 className="event__text">Мастер игры</h2>
				<p className="event-card__desc">
					Имя:{" "}
					<a href="#" className="event-card__location">
						{master?.name}
					</a>
				</p>

				<h2 className="event__text">Игроки</h2>
				{players?.map((player, index) => (
					<p className="event-card__desc" key={index}>
						<a href="#" className="event-card__location">
							{player.name}
						</a>
					</p>
				))}

				<h2 className="event__text">Детали сессии</h2>
				<p className="event-card__desc">{`Дата: ${customDay}`}</p>
				<p className="event-card__desc">
					Продолжительность: {sessionDetails?.duration}
				</p>
				<p className="event-card__desc">
					Локация:{" "}
					<a href="#" className="event-card__location">
						{sessionDetails?.location}
					</a>
				</p>
				<p className="event-card__desc">Заметки: {sessionDetails?.notes}</p>
				<Button
					title={isLoading ? "Загрузка ..." : buttonStatus}
					onClick={handleClick}
					className="full"
				/>
			</div>
		</div>
	);
};
