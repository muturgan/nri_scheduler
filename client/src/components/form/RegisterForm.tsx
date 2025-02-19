import { h } from "preact";
import { route as navigate } from "preact-router";
import { useEffect, useRef, useState } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import { $fetching } from "../../modules/store/fetching";
import { registration } from "../../modules/api";
import { FormWrapper } from "./FormWrapper";

export const RegisterForm = () => {
	const fetching = useStore($fetching);

	const nameInput = useRef<HTMLInputElement>(null);
	const emailInput = useRef<HTMLInputElement>(null);
	const passInput1 = useRef<HTMLInputElement>(null);
	const passInput2 = useRef<HTMLInputElement>(null);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		setIsFormValid(
			Boolean(
				nameInput.current?.checkValidity() &&
					emailInput.current?.checkValidity() &&
					passInput1.current?.checkValidity() &&
					passInput2.current?.checkValidity()
			)
		);
	}, [name, email, password1, password2]);

	const handleInput = (
		e: h.JSX.TargetedEvent,
		setter: (value: string) => void
	) => {
		const value = (e.target as HTMLInputElement).value;

		if (passInput1.current && passInput2.current) {
			if (passInput1.current.value !== passInput2.current.value) {
				passInput1.current.setCustomValidity(
					"Введённые пароли должны совпадать"
				);
				passInput2.current.setCustomValidity(
					"Введённые пароли должны совпадать"
				);
			} else {
				passInput1.current.setCustomValidity("");
				passInput2.current.setCustomValidity("");
			}
		}

		setter(value);
	};

	const handleSubmit = () => {
		registration(name, email, password1).then((res) => {
			if (res !== null) {
				navigate("/signin", true);
			}
		});
	};

	return (
		<FormWrapper title="Регистрация">
			<form>
				<div className="form__field">
					<label htmlFor="text" className="form__label">
						Логин
					</label>
					<input
						type="text"
						className="form__input"
						placeholder="Придумайте логин"
						value={name}
						onInput={(e) => handleInput(e, setName)}
						ref={nameInput}
						required
					/>
				</div>

				<div className="form__field">
					<label htmlFor="email" className="form__label">
						Электронная почта
					</label>
					<input
						type="email"
						className="form__input"
						pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
						placeholder="Введите вашу почту"
						value={email}
						onInput={(e) => handleInput(e, setEmail)}
						ref={emailInput}
						required
					/>
				</div>
				<div className="form__field">
					<label htmlFor="password" className="form__label">
						Пароль
					</label>
					<input
						type="password"
						className="form__input"
						placeholder="Введите пароль"
						value={password1}
						onInput={(e) => handleInput(e, setPassword1)}
						ref={passInput1}
						autocomplete="off"
						required
					/>
				</div>

				<div className="form__field">
					<label htmlFor="password" className="form__label">
						Повторите пароль
					</label>
					<input
						type="password"
						className="form__input"
						placeholder="Повторите пароль"
						value={password2}
						onInput={(e) => handleInput(e, setPassword2)}
						ref={passInput2}
						autocomplete="off"
						required
					/>
				</div>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={!isFormValid || fetching}
					className="form__button button-primary"
				>
					Зарегистрироваться
				</button>
			</form>
		</FormWrapper>
	);
};
