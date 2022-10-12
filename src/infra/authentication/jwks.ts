import { Secret, Jwt } from 'jsonwebtoken';
import { Request } from 'express';
import jose from 'jose';


// function retrieveSigningKeys(keys) {
//   const keystore = jose.JWKS.asKeyStore({ keys }, { ignoreErrors: true });

//   return keystore.all({ use: 'sig' }).map((key) => {
//     return {
//       kid: key.kid,
//       alg: key.alg,
//       get publicKey() { return key.toPEM(false); },
//       get rsaPublicKey() { return key.toPEM(false); },
//       getPublicKey() { return key.toPEM(false); }
//     };
//   });
// }


export function getJWK(req: Request, token: Jwt | undefined): Secret | Promise<Secret>  {
    const kid = token?.header.kid;

    

    return null;
}