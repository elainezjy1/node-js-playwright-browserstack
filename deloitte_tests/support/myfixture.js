import { test as base } from '@playwright/test';
const StorePage = require('../pages/storePage');
const CartPage = require('../pages/cartPage');

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
    }
});


module.exports = test;