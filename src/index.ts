import { initLogging } from './infra/logging/logger';

import { initConfigs, getJWKSCacheConfig, getWinstonLoggerOptions } from './infra/config/factory'
import { initJWKSCache } from './infra/authentication/jwks';
import { initServer } from './app/http/server';


initConfigs().then(() => {
  const port = process.env.PORT;

  const logger = initLogging(getWinstonLoggerOptions());

  initJWKSCache(getJWKSCacheConfig());

  initServer().listen(port, () => {
    logger.info(`[${process.env.NODE_ENV}] Server is listening on port ${port}`);
  });
});
