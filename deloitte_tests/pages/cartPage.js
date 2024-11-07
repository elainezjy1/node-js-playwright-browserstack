const { Page, Locator, expect } = require("@playwright/test");


class CartPage {

    constructor(page) {
        this.page = page;
        this.url = "https://react-shooping-cart.netlify.app/cartbutt";
        this.title = "Cart - React Boilerplate";
    }

    async goto() {
        await this.page.goto(this.url);
        await expect(await this.page.title()).toEqual(this.title);

    }

    async get_product_quantity(product) {
        let quantity = await this.get_product_row(product)
            .locator("div.col-sm-2 p")
            .innerText();
        quantity = quantity.match(/Qty: (\d+)/)[1];
        return parseInt(quantity);
    }

    get_product_row(product) {
        return this.page.locator("div.card div.row").filter({ has: this.page.getByAltText(product) });
    }

    async update_quantity(product, quantity) {
        let current_quantity = await this.get_product_quantity(product);
        //TODO: Risk of infinate loops
        while (current_quantity != quantity) {
            if (current_quantity < quantity) {
                // console.log(`Expected ${quantity}, Actual ${current_quantity}`)
                await this.get_product_row(product).locator("button.btn-primary").click();
                await this.page.waitForLoadState();
            } else {
                // console.log(`Expected ${quantity}, Actual ${current_quantity}`)
                await this.get_product_row(product).locator("button.btn-danger").click();
                await this.page.waitForLoadState();
            }
            current_quantity = await this.get_product_quantity(product);
        }

        await expect(await this.get_product_quantity(product)).toEqual(quantity);
    }

    async delete_product(product) {
        let current_quantity = await this.get_product_quantity(product);
        if (current_quantity != 1) {
            await update_quantity(product, 1)
        }
        await this.get_product_row(product).locator("button.btn-danger").click();
    }

    reduce_button_exists(product) {
        const reduce_button = this.get_product_row(product)
            .locator("button.btn-danger")
            .getByRole("path", { d: /M10/i })
        return reduce_button ? true : false;

    }

    remove_button_exists(product) {
        const reduce_button = this.get_product_row(product)
            .locator("button.btn-danger")
            .getByRole("path", { d: /M9/i })
        return reduce_button ? true : false;

    }

    async product_exists(product) {
        await expect(this.get_product_row(product)).toBeVisible();
    }


    async checkout() {
        await this.page.getByText("CHECKOUT").click();
    }

    async clear() {
        await this.page.getByText("CLEAR").click();
    }

    async get_total_items() {
        return await this.page.locator("div.row div.col-sm-3 div.card h4").innerText();
    }

    async get_total_payment() {
        return await this.page.locator("div.row div.col-sm-3 div.card h3").innerText();
    }

}

module.exports = CartPage;