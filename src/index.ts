import { initServer } from './app/http/server';
import { logger/*,initializeLogging*/ } from './infra/logging/logger';
import { initConfigs, getJWKSCacheConfig } from './infra/config/factory'
import { initJWKSCache } from './infra/authentication/jwks';


initConfigs().then(() => {
  const port = process.env.PORT;

  initJWKSCache(getJWKSCacheConfig());

  initServer().listen(port, () => {
    logger.info(`[${process.env.NODE_ENV}] Server is listening on port ${port}`);
  });
});
