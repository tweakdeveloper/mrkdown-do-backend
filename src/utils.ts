import { exit } from 'process';

function getPort(): number {
  if (!process.env.PORT) {
    return 1037;
  } else if (isNaN(parseInt(process.env.PORT))) {
    console.error('invalid value for PORT: `%s`', process.env.PORT);
    exit(1);
  } else {
    return parseInt(process.env.PORT);
  }
}

const redirectUri = (isMobile: boolean) =>
  isMobile
    ? 'mrkdown://mrkdown.slottedspoon.dev/auth/redirect'
    : 'https://tweakdeveloper.github.io/mrkdown/redirect';

const unicodeLength = (text: string) => [...text].length;

export default { getPort, redirectUri, unicodeLength };
