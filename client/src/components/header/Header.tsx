import { h } from "preact";
import { Button } from "../UI/Button";

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
					<a href="/event/1" className="menu__link">
						Событие
					</a>
					<a href="/mastery" className="menu__link">
						Мастерство
					</a>
				</nav>
				<div className="header__buttons">
					<Button title="Вход" href="/signin" />
					<Button title="Регистрация" href="/register" variant="outline" />
				</div>
			</div>
		</header>
	);
}
