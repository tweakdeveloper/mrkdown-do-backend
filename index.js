const express = require('express');

const port = process.env.PORT || 1037;

const app = express();

app.get('/', (_req, res) => res.send('howdy!!! 🤠'));

app.listen(port, () => console.log(`mrkdown-do-backend listening on ${port}!`));
