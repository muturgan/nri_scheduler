import { h, render } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import {
	CalendarPage,
	CreateEventPage,
	EventPage,
	Layout,
	MasteryPage,
	NotFound,
	RegistrationPage,
	SignInPage,
} from "./pages";

import "purecss/build/pure.css";
import "./styles/index.css";

const App = () => (
	<Layout>
		<Router>
			{/* Авторизация  */}
			<AsyncRoute path="/signin" component={SignInPage} />
			<AsyncRoute path="/register" component={RegistrationPage} />
			<Route default component={NotFound} />

			{/* Контент  */}
			<Route path="/" component={CalendarPage} />
			<AsyncRoute path="/calendar" component={CalendarPage} />
			<AsyncRoute path="/event/create" component={CreateEventPage} />
			<AsyncRoute path="/event/:id" component={EventPage} />
			<AsyncRoute path="/mastery" component={MasteryPage} />
		</Router>
	</Layout>
);

render(<App />, document.body);
