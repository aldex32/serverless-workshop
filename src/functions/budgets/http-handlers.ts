import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { createdResponse, noContentResponse, notFoundResponse, okResponse, ValidatedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { createBudgetSchema, updateBudgetSchema } from '@libs/schema';
import middy, { Request } from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { BudgetCreate, BudgetRepository } from '@libs/repositories/budget-repository';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import inputOutputLogger from '@middy/input-output-logger';
import { Budget, BudgetEvent } from '@libs/models';
import { EventBridgeClient } from '@libs/event-bridge-client';

const budgetTable = new BudgetRepository(process.env['BUDGET_TABLE_NAME']);
const eventBridgeClient = new EventBridgeClient(`${process.env.stage}-budgets.sytac.io`);

const createBudgetHandler: ValidatedEventAPIGatewayProxyEvent<typeof createBudgetSchema> = async (event) => {
    console.log(`Request context: ${JSON.stringify(event.requestContext)}`);
    const budgetCreate: BudgetCreate = {
        ...event.body,
        status: 'pending',
        username: getUsernameFromEvent(event),
    };
    const budget = await budgetTable.create(budgetCreate);

    // Send the event to event bus
    const budgetEvent: BudgetEvent = {
        id: budget.id,
        status: 'pending',
        amount: budget.amount,
    };
    await eventBridgeClient.send('BUDGET_REQUEST_CREATED', budgetEvent);

    return createdResponse(toHttpBudgetResponse(budget));
};

const findBudgetByIdHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const { id } = event.pathParameters;
    const username = getUsernameFromEvent(event);

    const budget = await budgetTable.findById(id);
    if (budget?.username === username) {
        return okResponse(toHttpBudgetResponse(budget));
    }

    return notFoundResponse();
};

const findBudgetsHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const username = getUsernameFromEvent(event);

    const budgets = await budgetTable.findByUsername(username);

    return okResponse(budgets.map(toHttpBudgetResponse));
};

const updateBudgetHandler: ValidatedEventAPIGatewayProxyEvent<typeof updateBudgetSchema> = async (event) => {
    const { id } = event.pathParameters;

    const budget = await budgetTable.findById(id);
    if (budget == null) {
        return notFoundResponse();
    }

    const updatedBudget = await budgetTable.update(id, event.body.status);

    return okResponse(toHttpBudgetResponse(updatedBudget));
};

const deleteBudgetByIdHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
    const { id } = event.pathParameters;
    const username = getUsernameFromEvent(event);

    const budget = await budgetTable.findById(id);
    if (budget?.username === username) {
        await budgetTable.deleteById(id);
    }

    return noContentResponse();
};

const getUsernameFromEvent = (event: ValidatedAPIGatewayProxyEvent): string => {
    return event.requestContext.authorizer.claims.username;
};

const printUsername = async (request: Request<ValidatedAPIGatewayProxyEvent>) => {
    console.debug('Username', getUsernameFromEvent(request.event));
};

const toHttpBudgetResponse = (budget: Budget): Omit<Budget, 'username'> => {
    const { username, ...budgetWithoutUsername } = budget;

    return budgetWithoutUsername;
};

export const createBudget = middy(createBudgetHandler) // prettier
    .use(inputOutputLogger())
    .before(printUsername)
    .use(middyJsonBodyParser());
export const findBudgetById = middy(findBudgetByIdHandler) // prettier
    .use(inputOutputLogger())
    .before(printUsername)
    .use(middyJsonBodyParser());
export const findBudgets = middy(findBudgetsHandler) // prettier
    .use(inputOutputLogger())
    .before(printUsername)
    .use(middyJsonBodyParser());
export const updateBudget = middy(updateBudgetHandler) // prettier
    .use(inputOutputLogger())
    .before(printUsername)
    .use(middyJsonBodyParser());
export const deleteBudgetById = middy(deleteBudgetByIdHandler) // prettier
    .use(inputOutputLogger())
    .before(printUsername)
    .use(middyJsonBodyParser());
