import fs from 'fs';

import { Secret, Jwt } from 'jsonwebtoken';
import { Request } from 'express';
import { ExceptionHandler } from 'winston';
import jwkToBuffer from 'jwk-to-pem';

import { JWKS, JWK_RSA, TokenKeySet, OpenIDConfiguration, JWKSCacheOptions } from './jwks.types';


class JWKSCache implements JWKS {
    metadata: {
        last_replication: number;
    } = {
        last_replication: 0
    };
    keys: TokenKeySet = []

    constructor() {}
}

/*
 * we do not use external cache for JWKS because
 * each application should be responsible for updating
 * their keysets, and keys are updated periodically
 */
let _jwks: JWKSCache;
let options: JWKSCacheOptions;

/**
 * Initializes JWKS in-memory cache
 * @param opts JWKS cache options
 */
export function initJWKSCache(opts: JWKSCacheOptions) {
  options = opts;

  if (options == null || options.api_url == null) {
    throw new Error("App error - JWKS fetcher not configured");
  }

  _jwks = readJWKSCache(options.jwks_cache_file);
}

// @TODO: @LATER: break JWKS and JWKS-Cache into 2 files just like we did in identity server?
/**
 * 
 * @param filename
 * @returns JWKSCache
 */
function readJWKSCache(filename: string): JWKSCache {
  let jwksCache: JWKSCache;

  // read JWKS cache persistence
  try {
    jwksCache = require(filename);

    if (!jwksCache || !jwksCache.keys)
      throw new Error("default empty jwks");
  } catch(e) {
    // file doesn't exits yet, that's okay
    jwksCache = new JWKSCache();
  }

  return jwksCache;
}

/**
 * Saves JWKS cache
 * @param filename 
 * @param jwks 
 */
function saveJWKSCache(filename: string, jwks: JWKSCache) {
  const data = JSON.stringify(jwks);

  fs.writeFile(filename, data, (err)=>{
    if (err) {
      // @TODO: error handling!
      throw err;
    }
  });
}


/**
 * Key fetching function for express-jwt. Matches JWK based on JWT's kid header.
 * @param req - Request
 * @param token - incoming JWT
 * @returns public RSA key (JWK) for JWT 
 */
export async function getJWK(req: Request, token: Jwt | undefined): Promise<Secret>  {
  if (token == null || token?.header.kid == null) {
    throw new Error("kid not provided by JWT");
  }

  const kid: string = token.header.kid;
  const currentTime = Date.now();

  let jwk = _jwks.keys.find(k=>k.kid == kid);

  // trigger key replication if not found
  if (!jwk) {
    if (!_jwks.metadata) _jwks.metadata = {last_replication: 0};

    if (currentTime - _jwks.metadata.last_replication > options.fetch_min_interval) {
      // only fetch JWKS on kid miss if it hasn't already been done recently
      // as identity server JWKS is only rotated a few times a year 
      const jwks = await fetchJWKSEndpoint(
        new URL('/.well-known/openid-configuration', options.api_url)
      );

      if (jwks == null)
        throw new Error("App error - JWKS endpoint not reachable");

      _jwks.keys = jwks.keys;
      _jwks.metadata.last_replication = Date.now();

      // update JWKS json as well
      saveJWKSCache(options.jwks_cache_file, _jwks);
    }
  }

  // let's try again
  jwk = _jwks.keys.find(k=>k.kid == kid);
  if (!jwk || jwk === undefined) {
    // JWKS has already been requested recently, therefore kid is not found in the identity server
    // this may happen when key expires due to rotation. Client must re-issue or refresh tokens
    throw new Error("Invalid kid found");
  }

  // convert to PEM format, for express-jwt
  return jwkToBuffer(jwk);
}


/**
 * Fetches JWKS from OpenID configuration endpoint. In theory this should work with any OpenID endpoint
 * @param jwks_uri OpenID configuration url, e.g. https://example.com/.well-known/openid-configuration
 * @returns JWK keyset
 */
export async function fetchJWKSEndpoint(jwks_uri: URL | string): Promise<JWKS | null> {
    try {
        const resOpenID = await fetch(jwks_uri);

        if (!resOpenID.ok)
            throw new Error("JSON error??");

        const openID: OpenIDConfiguration = await resOpenID.json();

        const resJWKS = await fetch(openID.jwks_uri);

        if (!resJWKS.ok)
            throw new Error("JSON error??");

        return await resJWKS.json();
    } catch (error) {
        // @todo: error logging if EP is unreachable
        console.error(error);
    }

    return null;
}
