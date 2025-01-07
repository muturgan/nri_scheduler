/** @todo сделать свои стили */
import './registration.css';

import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { signIn, whoIAm } from './api';
import { useFetchingStore } from './fetching';

export const SignInPage = () => {
	const fetching = useFetchingStore((state) => state.fetching);

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
				console.log('after login');
				console.log(res);
				return whoIAm();
			})
			.then((res) => {
				console.log('who I am:');
				console.log(res);
			});
	};


	return (
		<div className="registration-page">
			<div className="pure-g">
				<div className="pure-u-1 pure-u-md-1-3"></div> {/* Пустой блок для центрирования */}

				<div className="pure-u-1 pure-u-md-1-3">
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
								autocomplete="off"
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

				<div className="pure-u-1 pure-u-md-1-3"></div> {/* Пустой блок для центрирования */}
			</div>
		</div>
	);
};
