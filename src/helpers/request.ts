import querystring from 'querystring';

import fetch from 'node-fetch';

export enum MethodType {
	GET,
	POST,
}

export enum ResultType {
	JSON,
	TEXT,
}

function getURL(url: string, method: MethodType, params?: any): string {
	if(method !== MethodType.GET || (params !== undefined && Object.keys(params).length === 0)) {
		return url;
	}
	return `${url}?${querystring.stringify(params)}`;
}

function getRequest(url: string, methodType: MethodType, params?: any) {
	const requestURL = getURL(url, methodType, params);

	switch(methodType) {
	case MethodType.GET:
		return fetch(requestURL);
	case MethodType.POST:
		return fetch(requestURL, {
			'method': 'post',
			'body': JSON.stringify(params),
			'headers': {
				'content-type': 'application/json',
			},
		});
	}
}

function handleRequest(url: string, methodType: MethodType, resultType: ResultType, params?: any) {
	const request = getRequest(url, methodType, params);

	switch(resultType) {
	case ResultType.JSON:
		return request.then((res) => {
			return res.json();
		});
	case ResultType.TEXT:
		return request.then((res) => {
			return res.text();
		});
	}
}

export async function sendRequest(url: string, methodType: MethodType, resultType: ResultType, params: any = {}) {
	return await handleRequest(url, methodType, resultType, params);
}
