const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/homepage");

test.describe("Test Advanced Tables", () => {
  test("Go to HomePage and Open Link", async ({ page }) => {
    const hyperlink = '//a[@href="/dropdowns"]';
    const homePage = new HomePage(page, hyperlink);
    await homePage.navigate();
    expect(await homePage.isLoaded()).toBeTruthy();
    await page.click(hyperlink);

    const dropdown = page.locator("#fruits");
    await dropdown.selectOption({ label: "Apple" });

    const message = page.locator(
      '//p[@class="subtitle" and text() = "You have selected Apple"]'
    );
    const messageText = await message.innerText();
    expect(messageText).toBe("You have selected Apple");

    // Select superhero
    const ironman = page.locator('//option[@value="im"]');
    await ironman.scrollIntoViewIfNeeded();
    await ironman.click();

    const message2 = page.locator(
      '//p[@class="subtitle" and text() = "You have selected Iron Man"]'
    );

    await expect(message2).toHaveText("You have selected Iron Man");

    await page.locator("#country").scrollIntoViewIfNeeded();

    const languages = page.locator("#lang");
    const options = languages.locator("option");
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      console.log(await options.nth(i).innerText());
    }

    const lastOption = await options.nth(count-1).innerText();
    await languages.selectOption({ label: lastOption });

    const message3 = page.locator(
      '//p[@class="subtitle" and text() = "You have selected C#"]'
    );
  
    await  expect(message3).toHaveText(`You have selected ${lastOption}`);

    const country = page.locator('#country');

    await country.selectOption({ value: 'India' });

    const selectedValue = await country.evaluate(el => el.value);

  console.log('Selected value:', selectedValue);

    // delay
    await page.waitForTimeout(2000);
  });
});
