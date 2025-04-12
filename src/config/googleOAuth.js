const { OAuth2Client } = require("google-auth-library");
const keys = require("../../dev_tinder_oauth.json");

const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

module.exports = oAuth2Client;
