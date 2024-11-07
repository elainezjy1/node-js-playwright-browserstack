const { expect } = require('@playwright/test');
const test = require('./support/myfixture');


test.describe('A group of tests', { tag: '@regression', }, () => {

    test.beforeAll('Set up', async () => {
        console.log('Custom hooks: Before tests');
    });

    test.beforeEach(async ({ page }) => {
        console.log(`Custom hooks: Running ${test.info().title}`);
    });


    test.afterEach(async ({ page }) => {
        console.log(`Finished ${test.info().title} with status ${test.info().status}`);
        if (test.info().status !== test.info().expectedStatus) {
            await page.screenshot({ path: `./screenshots/${test.info().title}.png`, fullPage: true })
        }
    })

    test.afterAll('Teardown', async () => {
        console.log('Custom hooks: After tests');
    });

    test('Test scenario 1', { tag: '@smoke', }, async ({ page, cartPage, storePage }) => {
        //Open the Store page
        await storePage.goto();
        //Add an item to the cart
        await storePage.add_product_to_cart("Buffalo - Striploin");
        //Go to Cart
        await storePage.go_to_cart();
        //Check that item exist in Cart
        await expect(page.getByText("Buffalo - Striploin")).toBeVisible();
        //Check that Delete button appears for the added item
        await expect(await cartPage.remove_button_exists("Buffalo - Striploin")).toBeTruthy();
        //Check value of Total Items, Total Payment
        await expect(await cartPage.get_total_items()).toEqual("1");
        await expect(await cartPage.get_total_payment()).toEqual("$39.11");
        //Click Clear button
        await cartPage.clear();
        //Check that cart is clear
        await expect(page.getByText("Your cart is empty")).toBeVisible();

    });

    test('Test scenario 2', async ({ page, cartPage, storePage }) => {

        let product1 = "Buffalo - Striploin";
        let product2 = "Bacardi Breezer - Tropical";
        //Go to Store page
        await storePage.goto();
        //Add 2 items to the cart
        await storePage.add_product_to_cart(product1);
        await storePage.add_product_to_cart(product2);
        await storePage.go_to_cart();

        await expect(page.getByText(product1)).toBeVisible();
        await expect(page.getByText(product2)).toBeVisible();
        //For the first item, increase quantity to 3
        await cartPage.update_quantity(product1, 3);
        //Check value of Total Items, Total Payment
        await expect(await cartPage.get_total_items()).toEqual("4");
        await expect(await cartPage.get_total_payment()).toEqual("$375.25");

        //Check that Reduce button displays for the first item
        await expect(cartPage.reduce_button_exists(product1)).toBeTruthy();
        //Check that Delete button displays for the second item
        await expect(cartPage.remove_button_exists(product2)).toBeTruthy();
        //For the first item, decrease quantity to 2
        await cartPage.update_quantity(product1, 2);
        //Check value of Total Items, Total Payment
        await expect(await cartPage.get_total_items()).toEqual("3");
        await expect(await cartPage.get_total_payment()).toEqual("$336.14");

        //Delete the second item
        await cartPage.delete_product(product2);
        //Check that the first item is removed from cart
        await expect(cartPage.get_product_row(product2).toBeVisible).toBeFalsy;
        //Click Checkout button
        await cartPage.checkout();
        //Check that message “Checkout successfully” displays
        await expect(page.getByText("Checkout successfull")).toBeVisible();
        //Check that cart is clear
        await expect(page.getByText("Your cart is empty")).toBeVisible();

    });

    test.skip('Test scenario 3', async ({ page }) => {
        // This is a dummy test scenario to be skipped
      });
})
