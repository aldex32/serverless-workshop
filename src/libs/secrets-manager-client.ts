import { GetSecretValueCommand, SecretsManagerClient as AwsSecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { captureAWSv3Client } from 'aws-xray-sdk';

export class SecretsManagerClient {
    constructor(
        private readonly awsSecretsManagerClient = captureAWSv3Client(new AwsSecretsManagerClient({ region: process.env['AWS_REGION'] ?? 'eu-west-1' })),
    ) {}

    async getSecret<T>(name: string): Promise<T> {
        const { SecretString: secretString } = await this.awsSecretsManagerClient.send(new GetSecretValueCommand({ SecretId: name }));

        return JSON.parse(secretString);
    }
}
