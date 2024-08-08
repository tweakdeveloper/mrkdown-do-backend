const axios = require('axios').default;

const utils = require('./utils');

const tumblrClient = axios.create({
  baseURL: 'https://api.tumblr.com/v2',
  headers: {
    'User-Agent': `mrkdown-do-backend v${process.env.npm_package_version}`,
  },
  validateStatus: (status) => status < 500,
});

exports.exchangeToken = async function (code, isMobile) {
  return tumblrClient.post('/oauth2/token', {
    grant_type: 'authorization_code',
    code: code,
    client_id: process.env.TUMBLR_CLIENT_ID,
    client_secret: process.env.TUMBLR_CLIENT_SECRET,
    redirect_uri: utils.redirectUri(isMobile),
  });
};
