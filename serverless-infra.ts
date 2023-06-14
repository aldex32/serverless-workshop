import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'serverless-workshop-infra',
    frameworkVersion: '3',
    provider: {
        name: 'aws',
        region: 'eu-west-1',
        stage: 'aldo', // everyone should set its own stage name
        runtime: 'nodejs18.x',
        deploymentBucket: { blockPublicAccess: true },
    },
    resources: {
        Resources: {
            BudgetTable: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Delete', // You must set the policy to 'Retain' in production
                Properties: {
                    TableName: '${self:provider.stage}-budget',
                    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: '${self:provider.stage}-budget-username',
                            KeySchema: [{ AttributeName: 'username', KeyType: 'HASH' }],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                    AttributeDefinitions: [
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'username', AttributeType: 'S' },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                },
            },

            // Creates user pool (user directory)
            UserPool: {
                Type: 'AWS::Cognito::UserPool',
                Properties: {
                    UserPoolName: '${self:provider.stage}-sytac-user-pool',
                    EmailConfiguration: { EmailSendingAccount: 'COGNITO_DEFAULT' },
                    MfaConfiguration: 'OFF',
                    UsernameAttributes: ['email'],
                    AutoVerifiedAttributes: ['email'],
                    Schema: [{ AttributeDataType: 'String', Mutable: true, Name: 'email', Required: true }],
                },
            },
            UserPoolDomain: {
                Type: 'AWS::Cognito::UserPoolDomain',
                DependsOn: ['UserPool'],
                Properties: {
                    Domain: '${self:provider.stage}-budgets-api',
                    UserPoolId: { Ref: 'UserPool' },
                },
            },
            // Creates OAuth 2.0 resource server and defines custom scopes
            ResourceServer: {
                Type: 'AWS::Cognito::UserPoolResourceServer',
                DependsOn: ['UserPool'],
                Properties: {
                    UserPoolId: { Ref: 'UserPool' },
                    Identifier: 'budgets-api',
                    Name: 'budgets-api-resource-server',
                    Scopes: [
                        { ScopeName: 'read', ScopeDescription: 'Read budget scope' },
                        { ScopeName: 'write', ScopeDescription: 'Create budget scope' },
                        { ScopeName: 'update', ScopeDescription: 'Update budget scope' },
                    ],
                },
            },
            // Creates user pool client with authorization code grant type for Sytac web portal.
            WebPortalAppClient: {
                Type: 'AWS::Cognito::UserPoolClient',
                DependsOn: ['UserPool', 'ResourceServer'],
                Properties: {
                    ClientName: 'web-portal',
                    UserPoolId: { Ref: 'UserPool' },
                    // Enable SRP-based authentication and auth flow to refresh tokens.
                    ExplicitAuthFlows: ['ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
                    SupportedIdentityProviders: ['COGNITO'],
                    GenerateSecret: false,
                    AllowedOAuthFlowsUserPoolClient: true,
                    AllowedOAuthFlows: ['code'],
                    AllowedOAuthScopes: ['budgets-api/read', 'budgets-api/write'],
                    CallbackURLs: ['https://www.example.com/callback'],
                    LogoutURLs: ['https://www.example.com/logout'],
                },
            },
            // Creates user pool client with client credentials grant type for finance app.
            FinanceAppClient: {
                Type: 'AWS::Cognito::UserPoolClient',
                DependsOn: ['UserPool', 'ResourceServer'],
                Properties: {
                    ClientName: 'finance-app',
                    UserPoolId: { Ref: 'UserPool' },
                    GenerateSecret: true,
                    AllowedOAuthFlowsUserPoolClient: true,
                    AllowedOAuthFlows: ['client_credentials'],
                    AllowedOAuthScopes: ['budgets-api/update'],
                },
            },
            UserPoolArnParameterStore: {
                Type: 'AWS::SSM::Parameter',
                DependsOn: ['UserPool'],
                Properties: {
                    Name: '${self:provider.stage}-sytac-user-pool-arn',
                    Type: 'String',
                    Value: { 'Fn::GetAtt': ['UserPool', 'Arn'] },
                },
            },

            BudgetNotificationSns: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: '${self:provider.stage}-budget-notification-sns',
                    DisplayName: 'Sytac Budget',
                },
            },
            BudgetNotificationEmailSubscription: {
                Type: 'AWS::SNS::Subscription',
                DependsOn: ['BudgetNotificationSns'],
                Properties: {
                    Protocol: 'email',
                    Endpoint: 'sytac@example.com', // Put your Sytac email
                    TopicArn: { Ref: 'BudgetNotificationSns' },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
