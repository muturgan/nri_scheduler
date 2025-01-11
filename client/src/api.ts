import { route as navigate } from 'preact-router';
import { toast } from 'react-hot-toast';

import { startFetching, stopFetching } from "./store/fetching";

const POST = 'POST';

export const enum EScenarioStatus {
	SCENARIO_SUCCESS,
	UNAUTHORIZED,
	SCENARIO_FAIL,
	SYSTEM_ERROR,
	SESSION_EXPIRED,
}

export interface IApiResponse<T = null> {
	readonly status: EScenarioStatus,
	readonly result: string,
	readonly payload: T,
}

export interface IRequestInit {
	readonly body?: string | FormData;
	readonly headers?: Record<string, string>;
	readonly method?: string;
	readonly timeoutMilliseconds?: number;
}

const ajax = <T>(input: string, init?: IRequestInit): Promise<IApiResponse<T> | null> => {
	let controller: AbortController | undefined;
	let timeoutId: ReturnType<typeof setTimeout>;

	if (init?.timeoutMilliseconds) {
		controller = new AbortController();
		timeoutId = setTimeout(() => controller!.abort(), init.timeoutMilliseconds);
	}

	startFetching();

	return fetch(
		input,
		{
			body:    init?.body,
			headers: init?.headers,
			method:  init?.method,
			signal:  controller?.signal,
		},
	)
		.then((res) => checkResponse<T>(res))
		.finally(() => {
			clearTimeout(timeoutId);
			stopFetching();
		});
};

const checkResponse = async <T>(response: Response): Promise<IApiResponse<T> | null> => {
	if (response.ok === false) {
		let body: object | string | null = null;

		try {
			body = await response.text();
			try {
				const parsed = JSON.parse(body);
				body = parsed;
			} catch {
				// payload is not a json string
			}
		} catch (err) {
			console.info('http response body parsing error');
			console.error(err);
		}

		toast.error('Ошибка обращения к серверу');
		console.info('Http response is not ok');
		console.error({
			status: response.status,
			statusText: response.statusText,
			body,
		});

		return null;
	}

	try {
		let apiRes: IApiResponse<T> = await response.json();

		switch (apiRes.status) {
			case EScenarioStatus.SCENARIO_SUCCESS:
				return apiRes;

			case EScenarioStatus.UNAUTHORIZED:
			/** @todo добавить refresh */
			case EScenarioStatus.SESSION_EXPIRED:
				navigate('/signin');
				break;

			case EScenarioStatus.SCENARIO_FAIL:
			case EScenarioStatus.SYSTEM_ERROR:
				toast.error(apiRes.result);
				break;

			default:
				toast.error('Неизвестный статус ответа');
				console.info('Неизвестный статус');
				console.error(apiRes);
				break;
		}

		return null;

	} catch (err) {
		toast.error('Неизвестная ошибка');
		console.info('Хрень какая-то...');
		console.error(err);

		return null;
	}
};

const prepareAjax = (payload?: object, method?: string): IRequestInit => {
	return {
		body: payload
			? JSON.stringify(payload)
			: undefined,
		headers: payload
			? {'Content-Type': 'application/json'}
			: undefined,
		method,
	};
};

export const registration = (nickname: string, email: string, password: string) => {
	return ajax<null>(
		'/api/registration',
		prepareAjax({nickname, email, password}, POST),
	);
};

export const signIn = (email: string, password: string) => {
	return ajax<null>(
		'/api/signin',
		prepareAjax({email, password}, POST),
	);
};

export interface IApiEvent {
	readonly id: string;
	readonly company: string;
	readonly master: string;
	readonly location: string;
	readonly date: string;
	readonly players: string[];
	readonly you_applied: boolean;
	readonly your_approval: boolean | null;
}

export const readEventsList = (from: string, to: string) => {
	return ajax<IApiEvent[]>(`/api/events?date_from=${encodeURIComponent(from)}&date_to=${encodeURIComponent(to)}`);
};

export const whoIAm = () => {
	return ajax('/api/check');
};
