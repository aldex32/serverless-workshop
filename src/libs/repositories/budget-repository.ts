import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb';
import { Instant } from '@js-joda/core';
import * as crypto from 'crypto';
import { Budget, BudgetStatus } from '@libs/models';

export type BudgetCreate = Omit<Budget, 'id' | 'createdAt'>;

export class BudgetRepository {
    private readonly dynamoDBDocument: DynamoDBDocument;

    constructor(private readonly tableName: string) {
        this.dynamoDBDocument = DynamoDBDocument.from(new DynamoDBClient({ region: process.env['AWS_REGION'] ?? 'eu-west-1' }), {
            marshallOptions: { removeUndefinedValues: true },
        });
    }

    async create(budget: BudgetCreate): Promise<Budget> {
        const newBudget: Budget = {
            ...budget,
            id: crypto.randomUUID(),
            createdAt: Instant.now().toString(),
        };

        console.debug('Create budget', newBudget);
        await this.dynamoDBDocument.put({
            TableName: this.tableName,
            Item: newBudget,
        });
        console.debug('Budget created');

        return newBudget;
    }

    async findById(id: string): Promise<Budget | null> {
        console.debug(`Find budget [id=${id}]`);
        const { Item: item } = await this.dynamoDBDocument.get({
            TableName: this.tableName,
            Key: { id },
        });
        console.debug('Budget found', item);

        return item as Budget;
    }

    async findByUsername(username: string): Promise<Budget[]> {
        console.debug(`Find budgets [username=${username}]`);
        const { Items: items } = await this.dynamoDBDocument.query({
            TableName: this.tableName,
            IndexName: `${this.tableName}-username`,
            KeyConditions: {
                username: { ComparisonOperator: 'EQ', AttributeValueList: [username] },
            },
        });
        console.debug('Budgets found', items);

        return (items ?? []) as Budget[];
    }

    async update(id: string, status: BudgetStatus): Promise<Budget> {
        console.debug(`Update budget [id=${id}, status=${status}]`);
        const { Attributes: updatedItem } = await this.dynamoDBDocument.update({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: 'SET #__status = :status',
            ExpressionAttributeNames: { '#__status': 'status' },
            ExpressionAttributeValues: { ':status': status },
            ReturnValues: ReturnValue.ALL_NEW,
        });
        console.debug('Budget updated', updatedItem);

        return updatedItem as Budget;
    }

    async deleteById(id: string): Promise<void> {
        console.debug(`Delete budget [id=${id}]`);
        await this.dynamoDBDocument.delete({
            TableName: this.tableName,
            Key: { id },
        });
        console.debug('Budget deleted');
    }
}
