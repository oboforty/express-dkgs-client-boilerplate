import { initServer } from './app/http/server';
import { logger } from './infra/logging/logger';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const port = process.env.PORT || 5000;

  initServer().listen(port, () => {
    logger.info(`[${process.env.NODE_ENV}] Server is listening on port ${port}`);
  });
}


main();
