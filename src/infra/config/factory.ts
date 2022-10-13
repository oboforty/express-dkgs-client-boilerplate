import dotenv from 'dotenv';

import { JWKSCacheOptions } from '../authentication/jwks.types';


export async function initConfigs() {
  dotenv.config({
    path: `.${process.env.NODE_ENV}.env`
  });
}

export function getJWKSCacheConfig(): JWKSCacheOptions {
  const DAY2MS = 24 * 3600 * 1000;

  return {
    fetch_on_miss: true,
    fetch_min_interval: parseInt(process.env.JWKS_REPLICATE_INTERVAL || '90') * DAY2MS,
    api_url: process.env.DOORS_IDENTITY_URI || obligatory(),
    jwks_cache_file: process.env.JWKS_CACHE_FILE || "jwks.json"
  };
}

function obligatory(name: string = ""): any {
  /**
   * A helper method for TS to raise exception for missing required config
   * basically helps development
   */
  throw new Error(`Config '${name}' must be defined in .env.{deployment}`);
  return "";
}
