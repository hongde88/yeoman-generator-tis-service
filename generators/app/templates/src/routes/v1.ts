import { Router } from 'express';
const health = require('tis_service_health');
const logger = require('tis_logger').Logger;

const router = Router();

const downstreamServices = [];

logger.info('Configuring routes');

router.use('/health', health.Health(downstreamServices));

router.use('/template', require('./v1/template'));

logger.info('All routes configured');

module.exports = router;
