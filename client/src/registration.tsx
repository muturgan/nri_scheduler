import './registration.css';

import { h } from 'preact';
import { useState } from 'preact/hooks';

export const RegistrationPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleChange = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
		// @ts-ignore
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e: h.JSX.TargetedSubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Форма отправлена:', formData);
		// Здесь можно добавить логику отправки данных на сервер
	};

	return (
		<div className="registration-page">
			<div className="pure-g">
				<div className="pure-u-1 pure-u-md-1-3"></div> {/* Пустой блок для центрирования */}
				<div className="pure-u-1 pure-u-md-1-3">
					<form className="pure-form pure-form-stacked" onSubmit={handleSubmit}>
						<fieldset>
							<legend>Регистрация</legend>

							<label htmlFor="name">Имя</label>
							<input
								id="name"
								type="text"
								name="name"
								placeholder="Введите ваше имя"
								value={formData.name}
								onChange={(e) => {}}
								required
							/>

							<label htmlFor="email">Электронная почта</label>
							<input
								id="email"
								type="email"
								name="email"
								placeholder="Введите вашу почту"
								value={formData.email}
								onChange={handleChange}
								required
							/>

							<label htmlFor="password">Пароль</label>
							<input
								id="password"
								type="password"
								name="password"
								placeholder="Введите пароль"
								value={formData.password}
								onChange={handleChange}
								required
							/>

							<button type="button" className="pure-button pure-button-primary">
								Зарегистрироваться
							</button>
						</fieldset>
					</form>
				</div>

				<div className="pure-u-1 pure-u-md-1-3"></div> {/* Пустой блок для центрирования */}
			</div>
		</div>
	);
};
