export interface GetCurrenciesResponse {
    currencies: CurrenciesItem[];
}
interface CurrenciesItem {
    currency_code: string;
    unit: string;
}
