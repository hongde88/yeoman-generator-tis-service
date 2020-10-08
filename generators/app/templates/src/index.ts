import * as express from 'express';
import { json } from 'body-parser';
const { ContextGatherer } = require('tis.contextpropagation');
const { ContextPropagator } = require('tis.contextpropagation');
import { handleError, inOutLogger } from 'tis.errorhandler';

const bodySizeLimit = process.env.REQUEST_BODY_SIZE_LIMIT || '100mb';

const logger = require('tis_logger').Logger;
const httpContext = require('express-http-context');

const app: express.Application = express();
const sslServer = require('@xfe/ssl-server');
const httpsServer = sslServer(app, process.env.DISABLE_SSL ? { ssl: false } : {});
const expressHttpMiddleware = require('tis.contextproviders').HttpExpressMiddleware.default;
const httpsPort = process.env.SSL_PORT || 3000;
const serviceName = process.env.SERVICE_NAME;
const apiBase = process.env.API_BASE;
const v1Path = `${apiBase}/v1`;

app.use(json({ limit: bodySizeLimit }));
app.use(httpContext.middleware);

const contextGatherer = new ContextGatherer(new ContextPropagator());
contextGatherer.setContext.bind(contextGatherer);
const contextProviderExpressHttpMiddleware = new expressHttpMiddleware(contextGatherer);

app.use(contextProviderExpressHttpMiddleware.gatherContextFromWebRequest.bind(contextProviderExpressHttpMiddleware));

app.use(inOutLogger);

app.use(v1Path, require('./routes/v1'));

// Routes not specified default to 404
type ErrorStatus = Error & { status: number };

app.use((req, res, next) => {
  const err: ErrorStatus = { name: '', message: 'Not Found', status: 404 };
  next(err);
});

app.use(handleError);

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'dev') {
    logger.error(err);
  }

  res.status(err.statusCode || 500).json({ message: err.message || 'undefined error', status: 'error' });
});
/* eslint-enable no-unused-vars */

httpsServer.listen(httpsPort, () => {
  logger.info(`Service ${serviceName} ready and serving on port ${httpsPort} at ${v1Path}`);
});

module.exports = {
  app,
};
