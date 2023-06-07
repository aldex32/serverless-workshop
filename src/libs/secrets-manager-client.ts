import { GetSecretValueCommand, SecretsManagerClient as AwsSecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export class SecretsManagerClient {
    private static instance: SecretsManagerClient;

    private _financeAppClientSecrets?: { id: string; secret: string };

    private constructor(private readonly awsSecretsManagerClient = new AwsSecretsManagerClient({ region: process.env['AWS_REGION'] ?? 'eu-west-1' })) {}

    static getInstance(): SecretsManagerClient {
        this.instance ??= new SecretsManagerClient();

        return this.instance;
    }

    get financeAppClientSecrets(): Promise<{ id: string; secret: string }> {
        return (async () => {
            this._financeAppClientSecrets ??= await this.getSecret<{
                id: string;
                secret: string;
            }>(`${process.env.stage}-finance-app-client-secrets`);

            return this._financeAppClientSecrets;
        })();
    }

    async getSecret<T>(name: string): Promise<T> {
        const { SecretString: secretString } = await this.awsSecretsManagerClient.send(new GetSecretValueCommand({ SecretId: name }));

        return JSON.parse(secretString);
    }
}
