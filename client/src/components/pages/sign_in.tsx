import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { route as navigate } from 'preact-router';
import { useStore } from '@nanostores/preact';
import { toast } from 'react-hot-toast';
import { signIn, whoIAm } from '../../api';
import { $fetching } from '../../store/fetching';

import { setOffset } from '../../store/tz';

export const SignInPage = () => {
	const fetching = useStore($fetching);

	const emailInput = useRef<HTMLInputElement>(null);
	const passInput  = useRef<HTMLInputElement>(null);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		setIsFormValid(Boolean(
			emailInput.current?.checkValidity()
			&& passInput.current?.checkValidity()
		));
	}, [email, password]);

	const handleSubmit = () => {
		signIn(email, password)
			.then((res) => {
				return res === null ? null : whoIAm();
			})
			.then((res) => {
				if (res !== null) {
					console.log('who I am:');
					console.log(res);

					/**
					 * @todo сделать так чтобы смещение сохранялось после перезагрузки страницы
					 * сейчас просто делать запрос при старте приложения не подойдёт, так как неавторизованных пользователей перекинет на форму авторизации
					 * а неавторизованные пользователи тоже должны иметь возможность смотреть календарь
					 * */
					let timezone_offset = res.payload.timezone_offset;
					if (typeof timezone_offset === 'number') {
						setOffset(timezone_offset);
					}

					toast.success('Успешная авторизация');
					navigate('/calendar');
				}
			});
	};


	return (
		<div className="form-page">
			<div className="form-container">
				<form className="pure-form pure-form-stacked">
					<fieldset>
						<legend>Авторизация</legend>

						<label>Электронная почта
						<input
							type="email"
							pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
							placeholder="Введите вашу почту"
							value={email}
							onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
							ref={emailInput}
							autocomplete="email"
							required
						/>
						</label>

						<label>Пароль
						<input
							type="password"
							placeholder="Введите пароль"
							value={password}
							onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
							ref={passInput}
							autocomplete="current-password"
							required
						/>
						</label>

						<button
							type="button"
							onClick={handleSubmit}
							disabled={!isFormValid || fetching}
							className="pure-button pure-button-primary"
						>
							Войти
						</button>
					</fieldset>
				</form>
			</div>
		</div>
	);
};
