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

const ajax = <T>(input: string, init?: IRequestInit): Promise<IApiResponse<T>> => {
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

const checkResponse = async <T>(response: Response): Promise<IApiResponse<T>> => {
	if (response.ok === false) {
		let payload: object | string | null = null;

		try {
			payload = await response.text();
			try {
				const parsed = JSON.parse(payload);
				payload = parsed;
			} catch {
				// payload is not a json string
			}
		} catch (err) {
			console.info('http response body parsing error');
			console.error(err);
		}

		let status = response.status;

		let apiRes: IApiResponse<any> = {
			status: EScenarioStatus.SYSTEM_ERROR,
			result: `(${status}) ${typeof payload === 'string' ? payload : 'Неизвестная ошибка'}`,
			payload: typeof payload === 'string' ? null : {payload, status},
		};

		return apiRes;
	}

	try {
		let apiRes: IApiResponse<T> = await response.json();

		if (apiRes.status === EScenarioStatus.UNAUTHORIZED || apiRes.status === EScenarioStatus.SESSION_EXPIRED) {
			/** @TODO обработать ошибку авторизации */
		}

		return apiRes;

	} catch (err) {
		let msg = (err as Error | undefined)?.message;

		let apiRes: IApiResponse<any> = {
			status: EScenarioStatus.SYSTEM_ERROR,
			result: typeof msg === 'string' ? msg : 'Ошибка получения ответа',
			payload: typeof msg === 'string' ? null : err as object,
		};

		return apiRes;
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
