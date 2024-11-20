import { test as base } from '@playwright/test';
const logger = require('../utils/logger');
const StorePage = require('../pages/storePage');
const CartPage = require('../pages/cartPage');

const test = base.extend({
    cartPage: async ({ page }, use) => {
        logger.info('Custom fixture: setup cartPage');
        const cartPage = new CartPage(page);
        await use(cartPage);
        logger.info('Custom fixture: teardown cartPage');
    },
    storePage: async ({ page }, use) => {
        logger.info('Custom fixture: setup storePage');
        const storePage = new StorePage(page);
        await use(storePage);
        logger.info('Custom fixture: teardown storePage');
    }
});


module.exports = test;