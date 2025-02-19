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
	<Layout
		page={
			<Router>
				{/* Авторизация  */}
				<Route path="/signin" component={SignInPage} />
				<Route default component={NotFound} />

				{/* Контент  */}
				<AsyncRoute path="/" component={RegistrationPage} />
				<AsyncRoute path="/calendar" component={CalendarPage} />
				<Route path="/event/create" component={CreateEventPage} />
				<Route path="/event/:id" component={EventPage} />
				<Route path="/mastery" component={MasteryPage} />
			</Router>
		}
	/>
);

render(<App />, document.body);
