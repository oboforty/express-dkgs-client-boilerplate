import { Request, Response } from 'express';
import { loggers } from 'winston';

import {GenericHTTPError} from './errorHandlers.types';

const logger = loggers.get('default');


const prettyMessages: {[status: number]: string | [string, string]} = {
  400: "Bad Request",
  401: ["Unauthorized", "You are not authorized to view this server.\nPlease try logging in or contact the website administrator"],
  403: ["Forbidden", "You are not authorized to view this server.\nPlease try logging in or contact the website administrator"],
  404: ["Page not found", "The page you’re looking for doesn’t exist"],
  405: "Method Not Allowed",
  406: "Not Acceptable",
  408: "Request Timeout",
  415: "Unsupported Media Type",
  500: ["Internal Server Error", "An unexpected error happened."],
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
};


/**
 * handle errors that do not result in 500
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function prettyErrorMiddleware(err: GenericHTTPError, req: Request, res: Response, next: Function) {

  if (err) {

    if (err.type == 'redirect')
      res.redirect('/error')
    else if (err.type == 'time-out')
      res.status(408).send(err)

    // @TODO: log errors to journal

    const status_code = err.status || 500;

    let error_message: string;
    let pretty_message: string | null; 
    const msg = prettyMessages[status_code];

    if (msg instanceof Array) {
      error_message = msg[0];
      pretty_message = msg[1];
    } else {
      error_message = msg as string;
      pretty_message = null;
    }

    // send response
    const contentType = res.get('Content-Type');
    const isJsonContent = contentType && typeof contentType === "string"
      ? contentType.includes('application/json' )
      : 'json' === req.accepts('html', 'json');

    res.status(status_code);
    if (isJsonContent) {
      res.json({
        error_message
      });
    } else {
      // display html error
      return res.render('errors/error', {
        title: `${status_code} ${error_message}`,
        status_code: status_code,
        oops: "Oppa!",
        error_message,
        pretty_message
      });
    }
  }


  return next();
}

/**
 * Logs error & context
 * @param err express error
 * @param req express request
 * @param res express response
 */
export function errorLoggerMiddleware(err: any, req: Request, res: Response, next: Function) {
  if (err) {

    // if friendly errors are disabled then they're propagated in express anyway
    if (process.env.FRIENDLY_ERRORS !== "yes") {
      throw err;
    }

    else if (err instanceof Error) {
      logger.log({ level: 'error', message: `${err.stack || err}`, request: {
        url: req.url,
        params: req.params,
        headers: req.headers,
        body: req.body
      } });
    } else {
      logger.log({ level: 'error', message: err });
    }

    throw err;
  }

  return next();
}

/**
 * Converts error as-is to json format
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export function forceJsonErrorMiddleware(err: any, req: Request, res: Response, next: Function) {
  if (err) {
    const contentType = res.get('Content-Type');
    const isJsonContent = contentType && typeof contentType === "string"
      ? contentType.includes('application/json' )
      : 'json' === req.accepts('html', 'json');

    if (!isJsonContent)
      throw err;

    if (err instanceof Error)
      res.json(errorToSerializable(err));
    else if (err instanceof Object || err instanceof Array)
      res.json(err);
    else
      res.json({
        "err": err
      });
  }

  return next();
}


const nonEnumerablePropsToCopy = ['code', 'errno', 'syscall'];

function errorToSerializable(error: Error) {
  const _obj = {
    // Add all enumerable properties
    ...error,
    // normal props
    name: error.name,
    message: error.message,
    stack: error.stack?.split("\n"),
  }

  nonEnumerablePropsToCopy.forEach((key) => {
    // @ts-ignore
    if (key in error) _obj[key] = error[key]
  })

  return _obj;
}