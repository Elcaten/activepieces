import {
  AuthenticationType,
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';
import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { GetCategoriesResponse } from '../../common/api/categories';
import { GetCurrenciesResponse } from '../../common/api/currencies';
import {
  CreateExpenseWithEqualSharesRequest,
  CreateExpenseWithUserShares,
} from '../../common/api/expenses';
import { GetGroupsResponse } from '../../common/api/groups';
import { SPLITWISE_API_URL } from '../../common/constants';
import { buildGetOptions } from '../../common/getOptions';
import { splitwiseAuth } from '../../index';

export const createExpense = createAction({
  name: 'create_expense', // Must be a unique across the piece, this shouldn't be changed.
  auth: splitwiseAuth,
  displayName: 'Create an expense',
  description: 'Creates an expense',
  props: {
    cost: Property.Number({
      displayName: 'Cost',
      description: 'Expense amount',
      required: true,
      validators: [Validators.number],
    }),
    description: Property.ShortText({
      displayName: 'Description',
      description: 'A short description of the expense',
      required: false,
    }),
    details: Property.LongText({
      displayName: 'Details',
      description: 'Also known as "notes."',
      required: false,
    }),
    date: Property.DateTime({
      displayName: 'Date',
      description: 'The date and time the expense took place.',
      required: false,
      validators: [Validators.datetimeIso],
    }),
    repeat_interval: Property.StaticDropdown({
      displayName: 'Repeat',
      required: true,
      options: {
        options: [
          { label: 'Never', value: 'never' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Fortnightly', value: 'fortnightly' },
          { label: 'Monthly', value: 'monthly' },
          { label: 'Yearly', value: 'yearly' },
        ],
      },
      defaultValue: 'never',
    }),
    currency_code: Property.Dropdown({
      displayName: 'Currency',
      required: true,
      refreshers: [],
      options: buildGetOptions<GetCurrenciesResponse>({
        url: 'get_currencies',
        mapResponse: (response) =>
          response.currencies.map((currency) => ({
            value: currency.currency_code,
            label: currency.currency_code,
          })),
      }),
    }),
    category_id: Property.Dropdown({
      displayName: 'Category',
      required: true,
      refreshers: [],
      options: buildGetOptions<GetCategoriesResponse>({
        url: 'get_categories',
        mapResponse: (response) =>
          response.categories.map((category) => ({
            value: category.id.toString(10),
            label: category.name,
          })),
      }),
    }),
    subcategory_id: Property.Dropdown({
      displayName: 'Subcategory',
      required: true,
      refreshers: ['categoryId'],
      options: buildGetOptions<GetCategoriesResponse>({
        url: 'get_categories',
        mapResponse: (response, props) => {
          const { categoryId } = props as { categoryId: string };

          const category = response.categories.find(
            (category) => category.id.toString(10) === categoryId
          );

          if (category) {
            return category.subcategories.map((category) => ({
              value: category.id.toString(10),
              label: category.name,
            }));
          }

          return [];
        },
      }),
    }),
    group_id: Property.Dropdown({
      displayName: 'Group',
      required: true,
      refreshers: [],
      options: buildGetOptions<GetGroupsResponse>({
        url: 'get_groups',
        mapResponse: (response) =>
          response.groups.map((group) => ({
            value: group.id.toString(10),
            label: group.name,
          })),
      }),
    }),
    equal_shares: Property.Checkbox({
      displayName: 'Equal shares?',
      required: true,
      defaultValue: true,
    }),
    shares: Property.Json({
      displayName: 'Shares',
      description: undefined,
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const shared:
      | CreateExpenseWithEqualSharesRequest
      | CreateExpenseWithUserShares = {
      cost: propsValue.cost.toFixed(2),
      description: propsValue.description ?? '',
      details: propsValue.details ?? '',
      date: propsValue.date ?? new Date().toISOString(),
      repeat_interval: propsValue.repeat_interval,
      currency_code: propsValue.currency_code,
      category_id: Number.parseInt(propsValue.subcategory_id),
      group_id: Number.parseInt(propsValue.group_id),
    };

    const body:
      | CreateExpenseWithEqualSharesRequest
      | CreateExpenseWithUserShares = propsValue.equal_shares
      ? { ...shared, split_equally: true }
      : {
          ...shared,
          ...((propsValue as any).shares as unknown as SharesObject),
        };

    await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${SPLITWISE_API_URL}/create_expense`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: auth.access_token,
      },
      body,
    });
  },
});

type SharesObject = { [key: `users__${number}__user_id`]: string } & {
  [key: `users__${number}__paid_share`]: string;
} & { [key: `users__${number}__owed_share`]: string };
