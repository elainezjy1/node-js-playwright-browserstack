const log4js = require('log4js');
const logger = log4js.getLogger();
// By default, log4js will not output any logs (so that it can safely be used in libraries). The level for the default category is set to OFF.

if (logger.level.levelStr === 'OFF') {
    // it means log4js is having some default configurations, we'll overwrite it
    log4js.configure(
        {
            appenders: {
                'file': {
                    type: 'file',
                    filename: 'test-results/test_logs.log'
                },
                'stderr':
                {
                    type: 'stderr'
                },
                'stdout': {
                    type: 'stdout',
                    layout: {
                        type: 'pattern',
                        pattern: '%[[%d] [%p] %c -%] %.500m'
                    }
                }
            },
            categories: {
                default: {
                    appenders: ['file', 'stdout'],
                    level: 'debug'
                }
            }
        }
    );
    logger.info('log4js is configured from default logger.');
} else {
    logger.warn('log4js is configured before this point. The default configurations is ignored.');
}

module.exports = logger;
// Log level can be set like logger.level = "debug"
