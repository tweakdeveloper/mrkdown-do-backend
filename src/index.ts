import 'dotenv/config';

import { exit } from 'process';

import express from 'express';

import md_to_npf from './md-to-npf.js';
import TumblrClient from './tumblr.js';
import utils from './utils.js';

const PORT = utils.getPort();

if (!process.env.TUMBLR_CLIENT_ID) {
  console.error('TUMBLR_CLIENT_ID not set');
  exit(1);
}

if (!process.env.TUMBLR_CLIENT_SECRET) {
  console.error('TUMBLR_CLIENT_SECRET not set');
  exit(1);
}

const tumblr = new TumblrClient(
  process.env.TUMBLR_CLIENT_ID,
  process.env.TUMBLR_CLIENT_SECRET,
);

const app = express();
app.use(express.json());
app.use(express.text({ type: 'text/markdown' }));

app.get('/', (_req, res) => res.send('howdy!!! 🤠'));

app.get('/init_auth_flow', (req, res) => {
  if (!req.query.state) {
    res.status(400).send('needs state query parameter');
    return;
  } else if (typeof req.query.state != 'string') {
    res.status(400).send('invalid state query parameter');
    return;
  }
  const mobile = req.query.mobile === 'true';
  res.redirect(tumblr.authFlowUrl(req.query.state, mobile));
});

app.post('/exchange_code', async (req, res) => {
  try {
    const tumblrResponse = await tumblr.exchangeToken(
      req.body.code,
      req.body.mobile,
    );
    res.status(tumblrResponse.status).send(tumblrResponse.data);
  } catch (error) {
    console.error('500 occurred: ', error);
    res
      .status(500)
      .send({ error: true, error_msg: 'tumblr servers returned an error' });
  }
});

app.post('/create_post', async (req, res) => {
  try {
    res.send(await md_to_npf(req.body as string));
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: true, error_msg: (error as Error).message });
  }
});

app.listen(PORT, () => console.log(`mrkdown-do-backend listening on ${PORT}!`));
