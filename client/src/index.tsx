import { h, render } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import { Layout } from "./components/layout";
import {
	CreateEventPage,
	EventPage,
	MasteryPage,
	SignInPage,
} from "./components/pages";
import { softCheck } from "./api";

softCheck();

const App = () => (
	<Layout
		page={
			<Router>
				<AsyncRoute
					path="/signup"
					getComponent={() =>
						import("./components/pages/sign-up/signup").then(
							(module) => module.SingUpPage
						)
					}
				/>
				<Route path="/signin" component={SignInPage} />
				<AsyncRoute
					path="/calendar"
					getComponent={() =>
						import("./components/pages/calendar/calendar").then(
							(module) => module.CalendarPage
						)
					}
				/>
				<Route path="/event/create" component={CreateEventPage} />
				<Route path="/event/:id" component={EventPage} />
				<Route path="/mastery" component={MasteryPage} />
				<Route
					default
					component={() => <h1>404 - Страница не найдена</h1>}
				/>
			</Router>
		}
	/>
);

render(<App />, document.body);
