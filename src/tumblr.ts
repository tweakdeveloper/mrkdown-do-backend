import axios from 'axios';

import utils from './utils.js';

export default class TumblrClient {
  private readonly TUMBLR_CLIENT_ID: string;
  private readonly TUMBLR_CLIENT_SECRET: string;

  private readonly tumblrClient = axios.create({
    baseURL: 'https://api.tumblr.com/v2',
    headers: {
      'User-Agent': `mrkdown-do-backend v${process.env.npm_package_version}`,
    },
    validateStatus: (status: number) => status < 500,
  });

  constructor(TUMBLR_CLIENT_ID: string, TUMBLR_CLIENT_SECRET: string) {
    this.TUMBLR_CLIENT_ID = TUMBLR_CLIENT_ID;
    this.TUMBLR_CLIENT_SECRET = TUMBLR_CLIENT_SECRET;
  }

  authFlowUrl(state: string, mobile: boolean): string {
    let authURL = new URL('https://www.tumblr.com/oauth2/authorize');
    authURL.searchParams.append('client_id', this.TUMBLR_CLIENT_ID);
    authURL.searchParams.append('response_type', 'code');
    authURL.searchParams.append('scope', '');
    authURL.searchParams.append('state', state);
    authURL.searchParams.append('redirect_uri', utils.redirectUri(mobile));
    return authURL.toString();
  }

  async exchangeToken(code: string, isMobile: boolean) {
    return this.tumblrClient.post('/oauth2/token', {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.TUMBLR_CLIENT_ID,
      client_secret: this.TUMBLR_CLIENT_SECRET,
      redirect_uri: utils.redirectUri(isMobile),
    });
  }
}
