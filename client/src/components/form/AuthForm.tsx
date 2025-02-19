import { h } from "preact";
import { FormWrapper } from "./FormWrapper";
import { useStore } from "@nanostores/preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { signIn, whoIAm } from "../../modules/api";
import toast from "react-hot-toast";
import { route as navigate } from "preact-router";
import { $fetching } from "../../modules/store/fetching";

export const AuthForm = () => {
	const fetching = useStore($fetching);

	const emailInput = useRef<HTMLInputElement>(null);
	const passInput = useRef<HTMLInputElement>(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		setIsFormValid(
			Boolean(
				emailInput.current?.checkValidity() &&
					passInput.current?.checkValidity()
			)
		);
	}, [email, password]);

	const handleSubmit = () => {
		signIn(email, password)
			.then((res) => {
				return res === null ? null : whoIAm();
			})
			.then((res) => {
				if (res !== null) {
					console.log("who I am:");
					console.log(res);
					toast.success("Успешная авторизация");
					navigate("/calendar");
				}
			});
	};

	return (
		<FormWrapper title="Авторизация">
			<form className="">
				<div className="form__field">
					<label htmlFor="email" className="form__label">Электронная почта</label>
					<input
						type="email"
						className="form__input"
						pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
						placeholder="Введите вашу почту"
						value={email}
						onInput={(e) =>
							setEmail((e.target as HTMLInputElement).value)
						}
						ref={emailInput}
						autocomplete="email"
						required
					/>
				</div>
				<div className="form__field">
					<label htmlFor="password" className="form__label">Пароль</label>
					<input
						type="password"
						className="form__input"
						placeholder="Введите пароль"
						value={password}
						onInput={(e) =>
							setPassword((e.target as HTMLInputElement).value)
						}
						ref={passInput}
						autocomplete="current-password"
						required
					/>
				</div>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={!isFormValid || fetching}
					className="form__button button-primary"
				>
					Войти
				</button>
			</form>
		</FormWrapper>
	);
};
