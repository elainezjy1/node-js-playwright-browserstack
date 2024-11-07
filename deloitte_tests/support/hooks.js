import { LaunchOptions, Logger, test as base } from '@playwright/test';
// import { test } from './myfixture';
const StorePage = require('../pages/storePage');
const CartPage = require('../pages/cartPage');
const LogSeverity = 'verbose' | 'info' | 'warning' | 'error';

base.beforeAll('Set up', async () => {
    console.log('Custom hooks: Before tests');
});

base.beforeEach(async ({ page }) => {
    console.log(`Custom hooks: Running ${test.info().title}`);
});


base.afterEach(async ({ page }) => {
    console.log(`Finished ${test.info().title} with status ${test.info().status}`);
    if (test.info().status !== test.info().expectedStatus) {
        await page.screenshot({ path: `./deloitte_tests/screenshots/${test.info().title}.png`, fullPage: true })
    }
})

base.afterAll('Teardown', async () => {
    console.log('Custom hooks: After tests');
});

const test = base.extend({
    cartPage: async ({ page }, use) => {
        console.log('Custom fixture: setup cartPage');
        const cartPage = new CartPage(page);
        await use(cartPage);
        console.log('Custom fixture: teardown cartPage');
    },
    storePage: async ({ page }, use) => {
        console.log('Custom fixture: setup storePage');
        const storePage = new StorePage(page);
        await use(storePage);
        console.log('Custom fixture: teardown storePage');
    },
    logger: async ({ }, use) => {
        const logger = {
            isEnabled: (name, LogSeverity) => name === 'TEST_LOG',
            log: (name, LogSeverity, message, args) => console.log(`${name} ${severity} ${message} ${args.join(' ')}`)
        }
        await use({ logger });
    }
});


module.exports = test;