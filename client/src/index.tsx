import 'purecss/build/pure.css';
import './index.css';

import { h, render } from 'preact';
import { Router, Route } from 'preact-router';
import AsyncRoute from 'preact-async-route';

import { RegistrationPage } from './registration';

const App = () => (
	<Router>
		<Route path="/" component={RegistrationPage} />
		<AsyncRoute
			path="/calendar"
			getComponent={() => import('./calendar').then((module) => module.Calendar)}
		/>
		<Route default component={() => <h1>404 - Страница не найдена</h1>} />
	</Router>
);

const root = document.createElement('div');
document.body.appendChild(root);

render(<App />, root);
