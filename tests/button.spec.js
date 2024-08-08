const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');

test.describe('Test Button Click', () => {
    test('Go to HomePage, Open Button Link and perform Tests', async ({ page }) => {
        const hyperlink = '//a[@href="/buttons"]' 
        const homePage = new HomePage(page, hyperlink);
        await homePage.navigate();
        expect(await homePage.isLoaded()).toBeTruthy();   // Check if hyperlink is visible
        await page.click(hyperlink); 
        await page.click('#home'); 
        await page.goto('https://letcode.in/buttons');

        // Get the location of the button
        const button = page.locator('#position');
        const boundingBox = await button.boundingBox();
        console.log(boundingBox.x + ',' + boundingBox.y);

        // Get the color of the button
        const colorButton = page.locator('#color');
        const color = await colorButton.evaluate((colorButton) => {
            return window.getComputedStyle(colorButton).backgroundColor;
        });
        console.log(`Button color: ${color}`);

        // Get the height and width of button
        const propertyButton = page.locator('#property');
        const dimensions = await colorButton.evaluate((colorButton) => {
            const rect = colorButton.getBoundingClientRect();
            return rect;
        });
        console.log('height : ' + dimensions.height + ', width : ' + dimensions.width );
        

        // Confirm button is disabled
        const disabledButton = page.locator('//button[@title = "Disabled button" and @id="isDisabled"]');
        expect (await disabledButton.isEnabled()).toBeFalsy();

        // Click and Hold Button until text changes to Hi !
        const holdButton = page.locator('//h2[text() = "Button Hold!"]/ancestor::button');

        // Scroll the page to the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await holdButton.scrollIntoViewIfNeeded();
        await holdButton.hover();
        await page.mouse.down();

        // Wait for the text to change
        //await page.waitForSelector('//h2[text() = "Button has been long pressed"]', { timeout: 20000 });
        const successMessage = page.locator('//h2[text() = "Button has been long pressed"]');
        await successMessage.waitFor({ state: 'visible', timeout: 20000 });

        // Release the mouse button
        await page.mouse.up();

        // Verify the text change
        expect(await page.locator('//h2[text() = "Button has been long pressed"]').isVisible()).toBeTruthy();
    });
    
});
