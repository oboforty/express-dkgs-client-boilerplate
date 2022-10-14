import http, { Server } from 'http';

import express from 'express';
//import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { loggers } from 'winston';
import { create, engine } from "express-handlebars";

import jwt from './middleware/jwt';
import { router, unprotected } from './routes';

const logger = loggers.get('default');


export function initServer(): Server {
  const app = express();
  const httpServer = http.createServer(app);

  // middleware
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(jwt.unless({
    path: unprotected
  }));

  if (process.env.FRIENDLY_ERRORS == "yes") {
    // @todo: @later: add Options type for server

    app.use((err: any, req: express.Request, res: express.Response, next: Function) => {

      if (err) {
        // @TOOD: custom error page depending on status & common exception type

        // General error: dump everything
        logger.error(
          typeof err + '\n'+
          '   '+JSON.stringify(err)+'\n'+  
          '   '+JSON.stringify(req.url)+'\n'+
          '   '+JSON.stringify(req.params)+'\n'+
          '   '+JSON.stringify(req.headers)+'\n'+
          '   '+JSON.stringify(req.body)+'\n'+
          '-------------------------------------'
        );
      }

      next();
    });
  }

  app.use(router);

//   app.use(morgan('combined', {
//     skip(req, res) { return res.statusCode < 400; },
//   }));
// @TODO: add optional middleware based on process
  switch (process.env.NODE_ENV) {
    case 'prod':
      break;
    case 'debug':
      break;
    }
  // if (process.env.NODE_ENV == 'prod') {
  //   // @TODO: log errors to journal
  // } else if ()
// /* Error handler middleware */

//   const statusCode = err.statusCode || 500;
//   console.error(err.message, err.stack);
//   res.status(statusCode).json({'message': err.message});
  
//   return;
// });


  initViews(app);

  return httpServer;
}

function initViews(app: express.Express) {
  // @TODO: @LATER: make it work with __dirname, which points to dist/ .....
  var hbs = create({
    layoutsDir: "src/app/http/views/layouts",
    partialsDir: "src/app/http/views/partials",
    helpers: {
        foo: function () { return 'FOO!'; },
    }
  });

  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', 'src/app/http/views');

  app.use(express.static('public'));
  // static: .unless({ method: "OPTIONS" })
}