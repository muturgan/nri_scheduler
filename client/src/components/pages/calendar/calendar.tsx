import { h } from "preact";

import "@schedule-x/theme-default/dist/index.css";
import "./calendar.css";

import dayjs from "dayjs";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/preact";
import { createViewMonthGrid } from "@schedule-x/calendar";

import { useEffect, useState } from "preact/hooks";
import { route as navigate } from "preact-router";
import { useStore } from "@nanostores/preact";

import { createEvent, readEventsList } from "../../../api";
import { $tz } from "../../../store/tz";
import {
	Button,
	Container,
	Group,
	HStack,
	Input,
	InputAddon,
	Stack,
} from "@chakra-ui/react";
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
	id: string;
	title: string;
	start: string;
	startTime: string;
	end: string;
	endTime: string;
	location: string;
	max_slots: number | null;
	plan_duration: number | null;
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

		document.addEventListener("keydown", handleKeyDown);

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

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Escape") setOpenDraw(false);
	}

	const onSubmit = handleSubmit((data) => {
		const { start, startTime, end, endTime, max_slots, plan_duration } = data;

		const startDateTime = dayjs(`${start} ${startTime}`).tz(tz);
		const endDateTime = dayjs(`${end} ${endTime}`).tz(tz);
		if (data) {
			createEvent(
				"1eff3781-2223-6f10-9750-f8b1b0900aa1",
				startDateTime.toISOString(),
				"1eff3758-f826-6b80-bf7c-a233deaf9f6d",
				max_slots || null,
				plan_duration || null
			).then((res) => {
				if (res !== null) {
					// calendar.events.add(data);
					console.log(1, res);
				}
			});
		}

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
											placeholder="Введите локацию"
											{...register("location", {
												required: "Заполните поле",
											})}
										/>
									</Field>
									<Field label="Максимальное количество игроков">
										<Input
											type="number"
											min="1"
											step="1"
											{...register("max_slots")}
										/>
									</Field>

									<Field label="Длительность">
										<Group attached w="full">
											<Input
												type="number"
												min="1"
												step="1"
												{...register("plan_duration")}
											/>
											<InputAddon>час</InputAddon>
										</Group>
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
