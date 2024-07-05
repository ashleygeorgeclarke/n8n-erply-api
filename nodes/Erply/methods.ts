import {  IDataObject, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodePropertyOptions, JsonObject, NodeApiError, NodeOperationError, IHttpRequestOptions, ICredentialDataDecryptedObject } from "n8n-workflow";

export async function getServiceEndpoints(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const creds = await this.getCredentials('ErplyApi')

	const res = await this.helpers.httpRequest({
		url: `https://${creds.clientCode}.erply.com/api`,
		method: 'POST',
		qs: {
			request: 'getServiceEndpoints',
			"clientCode": creds.clientCode,
		}
	})

	if (res.status.errorCode != 0) {
		throw new NodeOperationError(this.getNode(), 'Error')
	}

	const ret = Object.keys(res.records[0]).map(key => {
		return {
			name: key,
			value: res.records[0][key].url
		}
	})
	return ret
}

export async function getEndpointPaths(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {

	const endpointPath = this.getNodeParameter('service', null, {
		extractValue: true
	}) as any

	const res = await this.helpers.httpRequest({
		url: endpointPath + "documentation/doc.json",
		method: 'GET',
	})

	const ret = Object.keys(res.paths).map(key => {
		return {
			name: key,
			value: key
		}
	})
	return ret
}

export async function getSessionKey(credentials: ICredentialDataDecryptedObject): Promise<string> {
	const url = encodeURI(`https://${credentials.clientCode}.erply.com/api?clientCode=${credentials.clientCode}&username=${credentials.username}&password=${credentials.password}&request=verifyUser&doNotGenerateIdentityToken=1`)

		const authResp = await fetch(url, {
			method: 'POST',
		})

		if (!authResp.ok) {
			throw new Error('Authentication failed');
		}

		const authData = await authResp.json() as any;

		return authData.records[0].sessionKey;
}

export async function apiWebhookRequest(
	this: IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
): Promise<any> {
	const baseUrl = this.getNodeParameter('baseUrl')

	const opts: IHttpRequestOptions = {
		url: `${baseUrl}${endpoint}`,
		method,
		body
	}

	if (Object.keys(body).length === 0) {
		delete opts.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'ErplyApi', opts)
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}



