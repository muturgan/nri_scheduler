import {
	Button,
	Heading,
	Input,
	Stack,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { h } from "preact";
import { Field } from "../../ui/field";
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

import { addCompany, IApiCompany } from "../../../api";
import { useForm } from "react-hook-form";
import { useState } from "preact/compat";

export const Company = () => {
	const [open, setOpen] = useState(false);
	const { register, handleSubmit, reset } = useForm<IApiCompany>();

	const onSubmit = handleSubmit((data) => {
		const { name, system, description } = data;
		if (data) {
			addCompany(name, system, description).then((res) => {
				if (res !== null) {
					console.log(res.payload);
					reset();
					setOpen(false);
				}
			});
		}
	});

	return (
		<DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
			<DrawerBackdrop />
			<DrawerTrigger asChild>
				<Button variant="outline">Создать кампанию</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Создание кампании</DrawerTitle>
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
									{...register("name")}
								/>
							</Field>
							<Field label="Система">
								<Input
									placeholder="Заполните поле"
									{...register("system")}
								/>
							</Field>
							<Field label="Описание">
								<Textarea
									placeholder="Расскажите о своей кампании"
									{...register("description")}
								/>
							</Field>
						</Stack>
						<Button type="submit" w="full" mt={6}>
							Создать
						</Button>
					</form>
					<Heading size="md" mt={6} mb={4}>
						Доступные мне
					</Heading>
					<Text>Список пуст</Text>
				</DrawerBody>
				<DrawerCloseTrigger />
			</DrawerContent>
		</DrawerRoot>
	);
};
