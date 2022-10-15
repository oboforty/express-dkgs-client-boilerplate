import os from 'os';

import dotenv from 'dotenv';

import { JWKSCacheOptions } from '../authentication/jwks.types';
import { WinstonLoggerOptions } from '../logging/logger.types';

export async function initConfigs() {
  dotenv.config({
    path: `.${process.env.NODE_ENV}.env`
  });
}

function obligatory(name: string = ""): any {
  /**
   * A helper method for TS to raise exception for missing required config
   * basically helps development
   */
  throw new Error(`Config '${name}' must be defined in .env.{deployment}`);
  return "";
}

/**
 * 
 * @returns 
 */
export function getWinstonLoggerOptions(): WinstonLoggerOptions {
  const opts: WinstonLoggerOptions = {
    log_insts:  {
      console: null,
      db: null,
      file: null
    },

    label: process.env.LOG_LABEL || `server(${process.env.NODE_ENV})`
  };

  const default_loglvl = process.env.NODE_ENV == 'prod' ? 'info' : 'silly';

  if (process.env.LOG_LEVEL_CONSOLE && process.env.LOG_LEVEL_CONSOLE != "none") {
    opts.log_insts.console = {
      level: process.env.LOG_LEVEL_CONSOLE || default_loglvl
    };
  }

  if (process.env.LOG_LEVEL_FILE && process.env.LOG_LEVEL_FILE != "none") {
    opts.log_insts.file = {
      level: process.env.LOG_LEVEL_FILE || default_loglvl,
      file_path: process.env.LOG_FILE || (
        os.platform() === 'win32' ? ".logs/logs.txt" : "/var/log/dkgs.log"
      )
    };
  }

  // if (process.env.LOG_LEVEL_DB && process.env.LOG_LEVEL_DB != "none") {
  //   opts.log_insts.db = {
  //     level: process.env.LOG_LEVEL_DB || default_loglvl,
  //     db_inst: "@later"
  //   };
  // }

  return opts;
}


/**
 * Config for Authentication/JWKS Cache
 * @returns JWKSCacheOptions
 */
export function getJWKSCacheConfig(): JWKSCacheOptions {
  const DAY2MS = 24 * 3600 * 1000;

  return {
    fetch_on_miss: true,
    fetch_min_interval: parseInt(process.env.JWKS_REPLICATE_INTERVAL || '90') * DAY2MS,
    api_url: process.env.DOORS_IDENTITY_URI || obligatory(),
    jwks_cache_file: process.env.JWKS_CACHE_FILE || "jwks.cache.json"
  };
}
