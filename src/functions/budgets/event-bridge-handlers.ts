import middy from '@middy/core';
import inputOutputLogger from '@middy/input-output-logger';
import { BudgetEvent, BudgetStatus } from '@libs/models';
import { SecretsManagerClient } from '@libs/secrets-manager-client';

const axios = require('axios').default;

const secretsManagerClient = SecretsManagerClient.getInstance();

const processBudgetHandler = async ({ id, amount }: BudgetEvent) => {
    if (amount <= 20) {
        console.info(`Budget approved [id=${id}, amount=${amount}]`);

        await updateBudgetStatus(id, 'approved');
    } else if (amount > 300) {
        console.warn(`Budget declined [id=${id}, amount=${amount}]`);

        await updateBudgetStatus(id, 'declined');
    } else {
        console.info(`Manual approval required for the budget [id=${id}, amount=${amount}]`);
    }
};

const updateBudgetStatus = async (id: string, status: BudgetStatus) => {
    const financeAppClientSecrets = await secretsManagerClient.financeAppClientSecrets;
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
