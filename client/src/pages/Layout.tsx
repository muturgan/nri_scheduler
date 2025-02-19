import { h, Fragment } from "preact";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
	page: h.JSX.Element;
}

export const Layout = ({ page }: LayoutProps) => (
	<>
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
				<a href="/signin" className="header__button">
					Вход
				</a>
			</div>
		</header>
		<main>
			{page}
			<Toaster position="bottom-right" />
		</main>
	</>
);
