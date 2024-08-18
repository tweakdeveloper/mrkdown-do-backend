# mrkdown-do-backend

A backend for the mrkdown [iOS](https://github.com/tweakdeveloper/mrkdown-iOS)
and [Android](https://github.com/tweakdeveloper/mrkdown-android) apps designed
to be run on the
[DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform).

## Running

You'll need [Node.js](https://nodejs.org) to run this. I'm currently testing
with v20.16.0.

The app will listen on the port specified in the `PORT` environment variable,
but will listen on port 1037 by default.

The environment variable `TUMBLR_CLIENT_ID` will need to be set to the consumer
key you get from
[registering an application with Tumblr](https://www.tumblr.com/oauth/register).

Additionally, the environment variable `TUMBLR_CLIENT_SECRET` will need to be
set to the consumer secret from the same Tumblr application that was
registered.
