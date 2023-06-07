import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type ValidatedAPIGatewayProxyEvent<S extends JSONSchema = Record<string, unknown>> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const okResponse = <T>(body: T) => {
    return {
        statusCode: 200,
        body: JSON.stringify(body),
    };
};

export const createdResponse = <T>(body: T) => {
    return {
        statusCode: 201,
        body: JSON.stringify(body),
    };
};

export const noContentResponse = () => {
    return {
        statusCode: 204,
        body: '',
    };
};

export const notFoundResponse = () => {
    return {
        statusCode: 404,
        body: '',
    };
};
