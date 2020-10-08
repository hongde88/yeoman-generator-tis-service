const logger = require('tis_logger').Logger;

before((done) => {
  const chai = require('chai');
  global.should = chai.should();
  const sinonChai = require('sinon-chai');

  logger.error = (str) => {
    return str;
  };
  logger.log = (str) => str;
  logger.info = (str) => str;
  logger.profile = (str) => str;

  chai.use(sinonChai);

  done();
});
