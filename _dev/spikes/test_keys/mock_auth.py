import json
from eme.mockapi import MockApi

keyid = 'key1'

with open(f'{keyid}.pub.jwk.json') as fh:
  jwk = json.load(fh)

with open(f'{keyid}.jwt.txt') as fh:
  jwt = fh.read()

app = MockApi({
  "/.well-known/openid-configuration": {
    'body': {
      'jwks_uri': '{url}/.well-known/jwks.json'
    },
  },
  '/.well-known/jwks.json': {
    'body': {
      'keys': [
        jwk
      ]
    },
  }
}, __name__)

# mock DKGS auth
app.run(port=5055)
