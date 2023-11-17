export interface CreateExpenseWithEqualSharesRequest {
  cost: string;
  description: string;
  details: string;
  date: string;
  repeat_interval: string;
  currency_code: string;
  category_id: number;
  group_id: number;
  split_equally: true;
}

export type CreateExpenseWithUserShares = {
  cost: string;
  description: string;
  details: string;
  date: string;
  repeat_interval: string;
  currency_code: string;
  category_id: number;
  group_id: number;
} & { [key: `users__${number}__user_id`]: string } & {
  [key: `users__${number}__paid_share`]: string;
} & { [key: `users__${number}__owed_share`]: string };