import { startFetching, stopFetching } from "./fetching";

const POST = 'POST';

export const enum EScenarioStatus {
	SCENARIO_SUCCESS,
	UNAUTHORIZED,
	SCENARIO_FAIL,
	SYSTEM_ERROR,
	SESSION_EXPIRED,
}

export interface IApiResponse {
	status: EScenarioStatus,
	result: string,
	payload: object | null,
}

export interface IRequestInit {
	body?: string | FormData;
	headers?: Record<string, string>;
	method?: string;
	timeoutMilliseconds?: number;
}

const ajax = (input: string, init?: IRequestInit): Promise<IApiResponse> => {
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
		.then((res) => checkResponse(res))
		.finally(() => {
			clearTimeout(timeoutId);
			stopFetching();
		});
};

const checkResponse = async (response: Response): Promise<IApiResponse> => {
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

		let apiRes: IApiResponse = {
			status: EScenarioStatus.SYSTEM_ERROR,
			result: `(${status}) ${typeof payload === 'string' ? payload : 'Неизвестная ошибка'}`,
			payload: typeof payload === 'string' ? null : {payload, status},
		};

		return apiRes;
	}

	try {
		let apiRes: IApiResponse = await response.json();

		if (apiRes.status === EScenarioStatus.UNAUTHORIZED || apiRes.status === EScenarioStatus.SESSION_EXPIRED) {
			/** @TODO обработать ошибку авторизации */
		}

		return apiRes;

	} catch (err) {
		let msg = (err as Error | undefined)?.message;

		let apiRes: IApiResponse = {
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
	return ajax(
		'/api/registration',
		prepareAjax({nickname, email, password}, POST),
	);
};

export const signIn = (email: string, password: string) => {
	return ajax(
		'/api/signin',
		prepareAjax({email, password}, POST),
	);
};

export const whoIAm = () => {
	return ajax('/api/check');
};
