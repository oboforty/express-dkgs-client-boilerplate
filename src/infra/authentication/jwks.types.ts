import { Secret, Jwt } from 'jsonwebtoken';
import jwkToBuffer from 'jwk-to-pem';

export type JWK = {
    use: "sig" | "enc";
    kid: string;
}

export type JWK_RSA = jwkToBuffer.RSA & JWK & {
    // full specification of an actual JWK...
    alg: "RS256" | "RS512" // etc
}

export type JWK_HMAC = JWK;

// @TODO: @later: add support for multiple key types, we don't need these anyway
export type TokenKeySet = Array<JWK_RSA>;

export type JWKS = {
    keys: TokenKeySet
};

export type OpenIDConfiguration = {
    request_parameter_supported: boolean,
    userinfo_signing_alg_values_supported: Array<string>,
    token_endpoint: string,
    jwks_uri: string
    // @TODO: full typedef?
};

export type JWKSCacheOptions = {
    // Fetches and replicates JWKS if JWK request misses
    fetch_on_miss: boolean;

    // prevents calling DKGS api too often
    fetch_min_interval: number;

    // api url for OpenID configuration
    api_url: string;

    // file to persist JWKS
    jwks_cache_file: string;
};
