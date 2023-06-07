export type BudgetStatus = 'pending' | 'approved' | 'declined';

export interface Budget {
    id: string;
    status: BudgetStatus;
    amount: number;
    description: string;
    username: string;
    createdAt: string;
    changedBy?: string;
    changedAt?: string;
}

export type BudgetEvent = Pick<Budget, 'id' | 'status' | 'amount'>;
