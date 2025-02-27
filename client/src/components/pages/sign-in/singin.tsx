import { h } from "preact";
import { route as navigate } from "preact-router";
import { useForm } from "react-hook-form";

import { signIn, whoIAm } from "../../../api";

import {
	Button,
	Container,
	Heading,
	Input,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Field } from "../../ui/field";
import { PasswordInput } from "../../ui/password-input";

import { useStore } from "@nanostores/preact";
import { $fetching } from "../../../store/fetching";
import { setOffset } from "../../../store/tz";
import toast from "react-hot-toast";

interface IFormSignin {
	email: string;
	password: string;
}

export const SignInPage = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IFormSignin>();

	const fetching = useStore($fetching);

	const onSubmit = handleSubmit((data) => {
		const { email, password } = data;

		signIn(email, password)
			.then((res) => {
				return res === null ? null : whoIAm();
			})
			.then((res) => {
				if (res !== null) {
					console.log("who I am:");
					console.log(res);
					reset();

					/**
					 * @todo сделать так чтобы смещение сохранялось после перезагрузки страницы
					 * сейчас просто делать запрос при старте приложения не подойдёт, так как неавторизованных пользователей перекинет на форму авторизации
					 * а неавторизованные пользователи тоже должны иметь возможность смотреть календарь
					 * */
					let timezone_offset = res.payload.timezone_offset;
					if (typeof timezone_offset === "number") {
						setOffset(timezone_offset);
					}

					toast.success("Успешная авторизация");
					navigate("/calendar");
				}
			});
	});

	return (
		<Container>
			<form onSubmit={onSubmit}>
				<Stack gap="4" align="flex-start" maxW="lg" w="full" mx="auto">
					<Heading>Авторизация</Heading>
					<Field
						label="Электронная почта"
						invalid={!!errors.email}
						errorText={errors.email?.message}
					>
						<Input
							placeholder="me@example.ru"
							{...register("email", {
								required: "Заполните поле",
								pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							})}
						/>
					</Field>
					<Field
						label="Пароль"
						invalid={!!errors.password}
						errorText={errors.password?.message}
					>
						<PasswordInput
							placeholder="******"
							{...register("password", {
								required: "Заполните поле",
							})}
						/>
					</Field>
					<Button type="submit" disabled={fetching} w="full">
						Войти
					</Button>
					<Text mx="auto" fontSize="sm">
						Еще не зарегистрированы?{" "}
						<Link variant="underline" href="/signup" colorPalette="teal">
							Зарегистрироваться
						</Link>
					</Text>
				</Stack>
			</form>
		</Container>
	);
};
