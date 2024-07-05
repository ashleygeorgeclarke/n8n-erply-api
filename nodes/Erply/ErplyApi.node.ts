import {  INodeType, INodeTypeDescription } from 'n8n-workflow';


export class ErplyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Erply API',
		name: 'erplyApi',
		icon: 'file:logo.svg',
		defaults: {
			name: 'Erply API',
		},
		credentials: [
			{
				name: 'ErplyApi',
				required: true,
			}
		],

		group: ['input'],
		version: 1,
		description: 'Consume Erply API',
		inputs: ['main'],
		outputs: ['main'],
		subtitle: '={{$parameter["request"]}}',
		requestDefaults: {
			method: 'POST',
		},

		properties: [
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Client code',
				name: 'clientCode',
				noDataExpression: true,
				type: 'string',
				default: '',
			},
			{
				displayName: 'Request',
				name: 'request',
				noDataExpression: true,
				type: 'string',
				default: 'getServiceEndpoints',
				routing: {
					request: {
						url: '=https://{{$parameter["clientCode"]}}.erply.com/api',
						qs: {
							request: '={{$parameter["request"]}}',
							clientCode: '={{$parameter["clientCode"]}}',

						},

						returnFullResponse: true,
					}
				},
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				routing: {
					request: {
						//@ts-ignore
						qs: '={{ $parameter.parameters.parameter ? $parameter.parameters.parameter.smartJoin("key", "value") : undefined }}',
					}
				},
				options: [
					{
						displayName: 'Parameter',
						name: 'parameter',

						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						]
					},
				]
			}
		]
	}
}
