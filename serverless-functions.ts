import type { AWS } from '@serverless/typescript';
import { createBudget, deleteBudgetById, findBudgetById, findBudgets, processBudget, updateBudget } from '@functions/budgets';

const serverlessConfiguration: AWS = {
    service: 'serverless-workshop-api',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-ssm-fetch', 'serverless-iam-roles-per-function'],
    provider: {
        name: 'aws',
        region: 'eu-west-1',
        stage: '${opt:stage, "dev"}', // everyone should set its own stage name
        runtime: 'nodejs18.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['xray:PutTelemetryRecords', 'xray:PutTraceSegments'],
                Resource: ['*'],
            },
        ],
        tracing: {
            apiGateway: true,
            lambda: true,
        },
        environment: {
            BUDGET_TABLE_NAME: '${self:provider.stage}-budget',
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        deploymentBucket: { blockPublicAccess: true },
    },
    functions: { createBudget, findBudgetById, findBudgets, updateBudget, deleteBudgetById, processBudget },
    package: { individually: true },
    custom: {
        // TODO is this needed?
        serverlessSsmFetch: {
            userPoolArn: '${self:provider.stage}-sytac-user-pool-arn',
        },
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            target: 'node18',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
