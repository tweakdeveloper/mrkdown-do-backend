const express = require('express');

const port = process.env.PORT || 1037;

const app = express();

app.get('/', (_req, res) => res.send('howdy!!! 🤠'));

app.get('/init_auth_flow', (_req, res) => {
  let authURL = new URL('https://www.tumblr.com/oauth2/authorize');
  authURL.searchParams.append('client_id', process.env.TUMBLR_CLIENT_ID);
  authURL.searchParams.append('response_type', 'code');
  authURL.searchParams.append('scope', '');
  authURL.searchParams.append('state', crypto.randomUUID());
  authURL.searchParams.append(
    'redirect_uri',
    'mrkdown://mrkdown.slottedspoon.dev/auth/redirect',
  );
  res.redirect(authURL);
});

app.listen(port, () => console.log(`mrkdown-do-backend listening on ${port}!`));
