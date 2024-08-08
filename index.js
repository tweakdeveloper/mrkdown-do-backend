require('dotenv').config();

const express = require('express');

const tumblr = require('./tumblr');
const utils = require('./utils');

const port = process.env.PORT || 1037;

const app = express();
app.use(express.json());

app.get('/', (_req, res) => res.send('howdy!!! 🤠'));

app.get('/init_auth_flow', (req, res) => {
  if (!req.query.state) {
    res.status(400).send('needs state query parameter');
    return;
  }
  let authURL = new URL('https://www.tumblr.com/oauth2/authorize');
  authURL.searchParams.append('client_id', process.env.TUMBLR_CLIENT_ID);
  authURL.searchParams.append('response_type', 'code');
  authURL.searchParams.append('scope', '');
  authURL.searchParams.append('state', req.query.state);
  authURL.searchParams.append(
    'redirect_uri',
    utils.redirectUri(req.query.mobile),
  );
  res.redirect(authURL);
});

app.post('/exchange_code', async (req, res) => {
  try {
    const tumblrResponse = await tumblr.exchangeToken(
      req.body.code,
      req.body.mobile,
    );
    res.status(tumblrResponse.status).send(tumblrResponse.data);
  } catch (error) {
    res
      .status(500)
      .send({ error: true, error_msg: 'tumblr servers returned an error' });
  }
});

app.listen(port, () => console.log(`mrkdown-do-backend listening on ${port}!`));
