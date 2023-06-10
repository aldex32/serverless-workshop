import { captureAWSv3Client } from 'aws-xray-sdk';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export class SnsClient {
    constructor(
        private readonly topicArn: string,
        private readonly snsClient = captureAWSv3Client(new SNSClient({ region: process.env['AWS_REGION'] ?? 'eu-west-1' })),
    ) {}

    async publish(subject: string, message: string): Promise<void> {
        await this.snsClient.send(new PublishCommand({ TopicArn: this.topicArn, Subject: subject, Message: message }));
    }
}
