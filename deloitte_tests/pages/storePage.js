const { Page, Locator, expect } = require("@playwright/test");


class StorePage {

    constructor(page) {
        this.page = page;
        this.url = "https://react-shooping-cart.netlify.app/";
        this.title = "Store - React Boilerplate";
    }

    async goto() {
        await this.page.goto(this.url);
        await expect(await this.page.title()).toEqual(this.title);
    }

    async add_product_to_cart(product) {
        const product_locator = this.page.locator("div.card").filter({ hasText: product });
        await product_locator.getByText("Add to cart").click();
        await expect(product_locator.getByText("Add more")).toBeVisible;
        await this.page.waitForLoadState();
    }

    async go_to_cart() {
        await this.page.locator("header a:has-text('Cart')").click();
        await this.page.waitForLoadState();
    }

}


module.exports = StorePage;