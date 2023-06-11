import { EventBridgeClient as AwsEventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { captureAWSv3Client } from 'aws-xray-sdk';
import { JsonObject } from 'type-fest';

export class EventBridgeClient {
    constructor(
        private readonly source: string,
        private readonly eventBridgeClient = captureAWSv3Client(new AwsEventBridgeClient({ region: process.env['AWS_REGION'] ?? 'eu-west-1' })),
    ) {}

    async send(eventType: string, eventPayload: JsonObject): Promise<void> {
        await this.eventBridgeClient.send(
            new PutEventsCommand({
                Entries: [
                    {
                        Source: this.source,
                        DetailType: eventType,
                        Detail: JSON.stringify(eventPayload),
                    },
                ],
            }),
        );
    }
}
