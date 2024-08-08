exports.redirectUri = (isMobile) =>
  isMobile
    ? 'mrkdown://mrkdown.slottedspoon.dev/auth/redirect'
    : 'https://tweakdeveloper.github.io/mrkdown/redirect';
