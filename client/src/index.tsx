import 'normalize.css/normalize.css'
import 'primereact/resources/themes/saga-green/theme.css';

import { h, render } from 'preact';
import { addLocale, PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

addLocale('ru', {
	firstDayOfWeek: 1,
	dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
	dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
	monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
	monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
	today: 'Сегодня',
	clear: 'Очистить',
});

const App = <PrimeReactProvider>
	<Button>Hello World!</Button>
	<Calendar inline locale="ru"/>
</PrimeReactProvider>;

render(App, document.querySelector('body')!);
