const { expect } = require('@playwright/test');

class HomePage {
    constructor(page, elementSelector) {
      this.page = page;
      this.hyperlink = page.locator(elementSelector);
    }
  
    async navigate() {
      await this.page.goto('https://letcode.in/test', { waitUntil: 'networkidle' });
    }

    async isLoaded() {
        await this.hyperlink.scrollIntoViewIfNeeded();
        return await this.hyperlink.isVisible();
      }
  

  }

  module.exports = HomePage;