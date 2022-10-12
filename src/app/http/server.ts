import http, { Server } from 'http';
import express from 'express';
//import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';

import { create, engine } from "express-handlebars";

import routes from './routes';

export function initServer(): Server {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(routes);

//   app.use(morgan('combined', {
//     skip(req, res) { return res.statusCode < 400; },
//   }));

// /* Error handler middleware */
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   console.error(err.message, err.stack);
//   res.status(statusCode).json({'message': err.message});
  
//   return;
// });

  // @TODO: @LATER: make it work with __dirname, which points to dist/ .....
  var hbs = create({
    layoutsDir: "src/views/layouts",
    partialsDir: "src/views/partials",
    helpers: {
        foo: function () { return 'FOO!'; },
    }
  });
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', 'src/views');

  app.use(express.static('public'));

  return httpServer;
}