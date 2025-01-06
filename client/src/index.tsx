import 'purecss/build/pure.css';
import './index.css';

import { h, render } from 'preact';
import { RegistrationPage } from './registration';

const App = <RegistrationPage />;

render(App, document.querySelector('body')!);
