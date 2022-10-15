import http, { Server } from 'http';
import express from 'express';

import bodyParser from 'body-parser';
import helmet from 'helmet';
//import morgan from 'morgan';
//import { deflate } from 'zlib';

import jwt from './middleware/jwt';
import jsonApiMiddleWare from './middleware/jsonApi';
import { prettyErrorMiddleware, forceJsonErrorMiddleware, errorLoggerMiddleware } from './middleware/errorHandlers';
import adminGuardMiddleware from './middleware/adminGuard';


import { router as api, unprotected as apiNoAuth } from './routes/api';
import { router as web, unprotected as webappNoAuth } from './routes/website';

import hbs from './handlebars';


export function initServer(): Server {
  const app = express();
  const httpServer = http.createServer(app);

  // shared middleware
  app.use(helmet());
  app.use(bodyParser.json());
  
  // web api
  app.use('/api/v1',
    jsonApiMiddleWare,
    jwt.unless({ path: apiNoAuth }),
    adminGuardMiddleware,
    forceJsonErrorMiddleware,
  api);

  // website
  web.use(bodyParser.urlencoded({ extended: false }));
  web.use(express.static('public'));
  // static: .unless({ method: "OPTIONS" })

  // @TODO: @LATER: cookies & sessions login?
  //            webappNoAuth
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', 'src/app/http/views');
  app.use(web);//@TODO: stateful auth for web router

  // error handling
  app.use(errorLoggerMiddleware);
  app.use(prettyErrorMiddleware);

  return httpServer;
}
