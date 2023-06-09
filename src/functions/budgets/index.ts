import { createBudgetSchema } from '@libs/schema';
import { handlerPath } from '@libs/handler-resolver';

const tableNameArn = 'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:provider.stage}-budget';
const usernameGsiArn =
    'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:provider.stage}-budget/index/${self:provider.stage}-budget-username';
const userPoolArn = '${ssm:${self:custom.serverlessSsmFetch.userPoolArn}}';
const eventBusArn = 'arn:aws:events:${self:provider.region}:${aws:accountId}:event-bus/default';

export const createBudget = {
    handler: `${handlerPath(__dirname)}/http-handlers.createBudget`,
    events: [
        {
            http: {
                method: 'post',
                path: 'budgets',
                authorizer: {
                    arn: userPoolArn,
                    scopes: ['budgets-api/write'],
                },
                request: {
                    schemas: {
                        'application/json': createBudgetSchema,
                    },
                },
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-create-budget',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem'],
            Resource: [tableNameArn],
        },
        {
            Effect: 'Allow',
            Action: ['events:PutEvents'],
            Resource: [eventBusArn],
        },
    ],
    environment: {
        stage: '${self:provider.stage}',
    },
};

export const findBudgetById = {
    handler: `${handlerPath(__dirname)}/http-handlers.findBudgetById`,
    events: [
        {
            http: {
                method: 'get',
                path: 'budgets/{id}',
                authorizer: {
                    arn: userPoolArn,
                    scopes: ['budgets-api/read'],
                },
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-read-budget',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem'],
            Resource: [tableNameArn],
        },
    ],
};

export const findBudgets = {
    handler: `${handlerPath(__dirname)}/http-handlers.findBudgets`,
    events: [
        {
            http: {
                method: 'get',
                path: 'budgets',
                authorizer: {
                    arn: userPoolArn,
                    scopes: ['budgets-api/read'],
                },
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-read-budgets',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:Query'],
            Resource: [usernameGsiArn],
        },
    ],
};

export const updateBudget = {
    handler: `${handlerPath(__dirname)}/http-handlers.updateBudget`,
    events: [
        {
            http: {
                method: 'put',
                path: 'budgets/{id}',
                authorizer: {
                    arn: userPoolArn,
                    scopes: ['budgets-api/update'],
                },
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-update-budget',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
            Resource: [tableNameArn],
        },
    ],
};

export const deleteBudgetById = {
    handler: `${handlerPath(__dirname)}/http-handlers.deleteBudgetById`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'budgets/{id}',
                authorizer: {
                    arn: userPoolArn,
                    scopes: ['budgets-api/write'],
                },
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-delete-budget',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem', 'dynamodb:DeleteItem'],
            Resource: [tableNameArn],
        },
    ],
};

export const processBudget = {
    handler: `${handlerPath(__dirname)}/event-bridge-handlers.processBudget`,
    events: [
        {
            eventBridge: {
                pattern: {
                    source: ['${self:provider.stage}-budgets.sytac.io'],
                    'detail-type': ['BUDGET_REQUEST_CREATED'],
                },
                inputPath: '$.detail',
            },
        },
    ],
    iamRoleStatementsName: '${self:provider.stage}-process-budget',
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: ['secretsmanager:GetSecretValue'],
            Resource: ['arn:aws:secretsmanager:${self:provider.region}:${aws:accountId}:secret:${self:provider.stage}-finance-app-client-secrets-*'],
        },
    ],
    environment: {
        tokenUrl: 'https://${self:provider.stage}-budgets-api.auth.${self:provider.region}.amazoncognito.com/oauth2/token',
        budgetsApiBaseUrl: {
            'Fn::Join': [
                '',
                [
                    'https://',
                    { 'Fn::GetAtt': ['ApiGatewayRestApi', 'RestApiId'] },
                    '.execute-api.${self:provider.region}.amazonaws.com/${self:provider.stage}/budgets',
                ],
            ],
        },
        stage: '${self:provider.stage}',
    },
};
