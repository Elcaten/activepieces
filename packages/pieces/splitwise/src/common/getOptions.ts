import {
  AuthenticationType,
  HttpMessageBody,
  HttpMethod,
  httpClient,
} from '@activepieces/pieces-common';
import {
  OAuth2PropertyValue,
  OAuth2Props,
  Store,
  StoreScope,
} from '@activepieces/pieces-framework';
import { SPLITWISE_API_URL } from './constants';

export const buildGetOptions =
  <TResponse extends HttpMessageBody>(config: GetOptionsConfig<TResponse>) =>
    (props: unknown) =>
      getOptions(props, config);

export interface GetOptionsConfig<TResponse extends HttpMessageBody> {
  url: string;
  mapResponse: (response: TResponse, props?: unknown) => Array<Option>;
}

export type Option = {
  value: string;
  label: string;
};

async function getOptions<TResponse extends HttpMessageBody>(
  props: unknown,
  config: GetOptionsConfig<TResponse>
): Promise<{
  disabled: boolean;
  options: Array<Option>;
  placeholder?: string;
}> {
  const { auth } = props as {
    auth: OAuth2PropertyValue<OAuth2Props>;
    store: Store;
  };
  const {
    url,
    mapResponse,
  } = config;

  if (!auth) {
    return {
      disabled: true,
      options: [],
      placeholder: 'Please connect your account',
    };
  }

  try {
    const response = await httpClient.sendRequest<TResponse>({
      method: HttpMethod.GET,
      url: `${SPLITWISE_API_URL}/${url}`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: auth.access_token,
      },
    });
    if (response.status === 200) {
      const options = mapResponse(response.body, props);

      return {
        disabled: false,
        options,
      };
    }
  } catch (e) {
    console.debug(e);
    return {
      disabled: true,
      options: [],
      placeholder: 'Please check your connection',
    };
  }

  return {
    disabled: true,
    options: [],
  };
}
