import 'normalize.css/normalize.css'
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-green/theme.css';

import { h, render } from 'preact';
import { PrimeReactProvider } from 'primereact/api';
import { RegistrationPage } from './registration';

const App = <PrimeReactProvider>
	<RegistrationPage />
</PrimeReactProvider>;

render(App, document.querySelector('body')!);
