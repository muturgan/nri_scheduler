import './layout.css';

import { h, Fragment } from 'preact';
import { Toaster } from 'react-hot-toast';

export const Layout = ({ page }: {page: h.JSX.Element}) => (
	<>
		<header>
			<h1>НРИ Календарь</h1>
			{/* <nav>
				<a href="/">Главная</a>
				<a href="/signin">Вход</a>
				<a href="/calendar">Календарь</a>
				<a href="/event/create">Создать событие</a>
				<a href="/mastery">Мастерство</a>
			</nav> */}
		</header>
		<main>
			{ page }
			<Toaster position="bottom-right" />
		</main>
	</>
);
