import { h } from "preact";

import "@schedule-x/theme-default/dist/index.css";
import "./calendar.css";

import dayjs from "dayjs";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/preact";
import { createViewMonthGrid } from "@schedule-x/calendar";

import { useEffect, useState } from "preact/hooks";
import { route as navigate } from "preact-router";
import { useStore } from "@nanostores/preact";

import { readEventsList } from "../../../api";
import { $tz } from "../../../store/tz";
import { Button, Container, HStack, Input, Stack } from "@chakra-ui/react";
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerCloseTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerRoot,
	DrawerTitle,
	DrawerTrigger,
} from "../../ui/drawer";
import { Field } from "../../ui/field";
import { useForm } from "react-hook-form";

const EVENT_FORMAT = "YYYY-MM-DD HH:mm";
const DEFAULT_EVENT_DURATION = 4;

interface IFormCreateEvent {
	id: number;
	master: string;
	title: string;
	start: string;
	startTime: string;
	end: string;
	endTime: string;
	location: string;
	slots: string;
	duration: string;
}

export const CalendarPage = () => {
	const [openDraw, setOpenDraw] = useState(false);

	const tz = useStore($tz);
	const { register, handleSubmit, reset } = useForm<IFormCreateEvent>();

	const calendar = useCalendarApp({
		locale: "ru-RU",
		views: [createViewMonthGrid()],
		callbacks: {
			onEventClick(event) {
				navigate(`/event/${event.id}`);
			},
		},
	});

	useEffect(() => {
		const now = dayjs().tz(tz);
		const monthStart = now.startOf("M").format();
		const monthEnd = now.endOf("M").format();

		/** @todo передавать таймзону, возвращать в нужной таймзоне, присылать название кампании, локации, список людей */
		readEventsList(monthStart, monthEnd).then((res) => {
			if (res !== null) {
				calendar.events.set(
					res.payload.map((apiEv) => {
						const start = dayjs(apiEv.date);
						const end = start.add(
							apiEv.plan_duration || DEFAULT_EVENT_DURATION,
							"h"
						);

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

	const onSubmit = handleSubmit((data) => {
		const { start, startTime, end, endTime } = data;

		data.id = Math.random();
		data.start = start + " " + startTime;
		data.end = end + " " + endTime;

		calendar.events.add(data);
		setOpenDraw(false);
		reset();
	});

	return (
		<section>
			<Container>
				<DrawerRoot
					open={openDraw}
					// placement="bottom"
					onOpenChange={(e) => setOpenDraw(e.open)}
				>
					<DrawerBackdrop />
					<DrawerTrigger asChild>
						<Button variant="outline" size="sm" mb={4}>
							Добавить событие
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Создание события</DrawerTitle>
						</DrawerHeader>
						<DrawerBody>
							<form onSubmit={onSubmit}>
								<Stack
									gap="4"
									align="flex-start"
									maxW="lg"
									w="full"
									mx="auto"
								>
									<Field label="Мастер">
										<Input
											{...register("master", {
												required: "Заполните поле",
											})}
										/>
									</Field>
									<Field label="Название">
										<Input
											placeholder="Заполните поле"
											{...register("title", {
												required: "Заполните поле",
											})}
										/>
									</Field>
									<HStack gap={2} width="full">
										<Field label="Начало">
											<Input
												type="date"
												{...register("start", {
													required: "Заполните поле",
												})}
											/>
										</Field>
										<Field label="Время">
											<Input
												type="time"
												{...register("startTime", {
													required: "Заполните поле",
												})}
											/>
										</Field>
									</HStack>
									<HStack gap={2} width="full">
										<Field label="Конец">
											<Input
												type="date"
												{...register("end", {
													required: "Заполните поле",
												})}
											/>
										</Field>
										<Field label="Время">
											<Input
												type="time"
												{...register("endTime", {
													required: "Заполните поле",
												})}
											/>
										</Field>
									</HStack>
									<Field label="Локация">
										<Input
											{...register("location", {
												required: "Заполните поле",
											})}
										/>
									</Field>
									<Field label="Количество игроков">
										<Input
											type="number"
											min={2}
											{...register("slots", {
												required: "Заполните поле",
											})}
										/>
									</Field>
									<Field label="Длительность">
										<Input
											type="number"
											{...register("duration", {
												required: "Заполните поле",
											})}
										/>
									</Field>
								</Stack>
								<Button type="submit" w="full" mt={6}>
									Создать
								</Button>
							</form>
						</DrawerBody>
						<DrawerCloseTrigger />
					</DrawerContent>
				</DrawerRoot>
				<ScheduleXCalendar calendarApp={calendar} />
			</Container>
		</section>
	);
};
