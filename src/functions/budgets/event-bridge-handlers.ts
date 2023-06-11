import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { BudgetEvent, BudgetStatus } from '@libs/models';
import { SecretsManagerClient } from '@libs/secrets-manager-client';
import { SnsClient } from '@libs/sns-client';
import { captureHTTPsGlobal } from 'aws-xray-sdk';

// Tracing HTTP calls with X-Ray
captureHTTPsGlobal(require('https'));

const axios = require('axios');

const secretsManagerClient = new SecretsManagerClient();
const snsClient = new SnsClient(process.env.budgetNotificationSnsArn);

const processBudgetHandler = async ({ id, amount }: BudgetEvent) => {
    if (amount <= 20) {
        console.info(`Budget approved [id=${id}, amount=${amount}]`);

        await updateBudgetStatus(id, 'approved');

        await snsClient.publish(`Budget approved - ${id}`, `Requested budget has been approved.`);
    } else if (amount > 300) {
        console.warn(`Budget declined [id=${id}, amount=${amount}]`);

        await updateBudgetStatus(id, 'declined');

        await snsClient.publish(`Budget declined ${id}`, `Requested budget has been declined.`);
    } else {
        console.info(`Manual approval required for the budget [id=${id}, amount=${amount}]`);

        await snsClient.publish(`Budget pending ${id}`, `Requested budget is waiting for approval.`);
    }
};

const updateBudgetStatus = async (id: string, status: BudgetStatus) => {
    const financeAppClientSecrets = await secretsManagerClient.getSecret<{
        id: string;
        secret: string;
    }>(`${process.env.stage}-finance-app-client-secrets`);

    const tokenResponse = await axios.post(
        process.env.tokenUrl,
        {
            grant_type: 'client_credentials',
            client_id: financeAppClientSecrets.id,
            client_secret: financeAppClientSecrets.secret,
            scope: 'budgets-api/update',
        },
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
    );

    await axios.put(
        `${process.env.budgetsApiBaseUrl}/${id}`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`,
            },
        },
    );
};

export const processBudget = middy(processBudgetHandler) // prettier
    .use(inputOutputLogger());
