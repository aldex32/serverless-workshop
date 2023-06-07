export const createBudgetSchema = {
    type: 'object',
    properties: {
        amount: { type: 'integer', minimum: 1 },
        description: { type: 'string' },
    },
    required: ['amount', 'description'],
} as const;

export const updateBudgetSchema = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['approved', 'declined'] },
    },
    required: ['status'],
} as const;
