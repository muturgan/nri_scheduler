import { h } from "preact";

export function Header() {
	return (
		<header className="header">
			<div className="container header__container">
				<a href="/" className="header__logo">
					НРИ Календарь
				</a>
				<nav className="menu">
					<a href="/calendar" className="menu__link">
						Календарь
					</a>
					<a href="/event/create" className="menu__link">
						Создать событие
					</a>
					<a href="/mastery" className="menu__link">
						Мастерство
					</a>
				</nav>
				<div className="header__buttons">
					<a href="/signin" className="header__button">
						Вход
					</a>
					<a href="/register" className="header__button">
						Регистрация
					</a>
				</div>
			</div>
		</header>
	);
}
