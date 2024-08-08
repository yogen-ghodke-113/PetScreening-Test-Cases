const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/homepage');

test.describe('Test Advanced Tables', () => {
    test('Go to HomePage and Open Link', async ({ page }) => {
        const hyperlink = '//a[@href="/selectable"]' 
        const homePage = new HomePage(page, hyperlink);
      await homePage.navigate();
      expect(await homePage.isLoaded()).toBeTruthy();
      await page.click(hyperlink);

      await page.click('//h3[@id="clour" and text()= "Selenium"]');

      const element = page.locator('//h3[@id="clour" and text()= "LetCode"]');
      await element.scrollIntoViewIfNeeded();
      await element.hover();
      await page.keyboard.down('Shift');
      await element.click();
      await page.keyboard.up('Shift');
      
      await page.waitForTimeout(1000);
      

      // GEt multiple elements with id = clour
      const selectable_elements = page.locator('#selectable');

      const count = await selectable_elements.count();

      // loop through all the elements
      for (let i = 0; i < count; i++) {
        const curr_element = selectable_elements.nth(i);
        const isSelected = await curr_element.evaluate(el => el.classList.contains('ui-selected'));
        expect(isSelected).toBeTruthy();
      }


      await page.waitForTimeout(1000);


    });





});