const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/homepage");

test.describe("Test Advanced Tables", () => {
  test("Go to HomePage and Open Link", async ({ page }) => {
    const hyperlink = '//a[@href="/edit"]';
    const homePage = new HomePage(page, hyperlink);
    await homePage.navigate();
    expect(await homePage.isLoaded()).toBeTruthy();
    await page.click(hyperlink);

    // Select text field
    await page.fill("#fullName", "Yogen Ghodke");

    // Append text at the End
    const inputfield = page.locator("#join");
    await inputfield.focus();
    await page.keyboard.press("End");
    await page.type("#join", " - How are you?");
    await page.keyboard.press("Tab");

    const prefilledText = await page.evaluate(
      () => document.activeElement.value
    );
    expect(prefilledText).toBe("ortonikc");
    console.log(prefilledText);

    await page.fill("#clearMe", "");

    // Verify that the edit field is disabled
    const editField = page.locator("#noEdit");
    const isDisabled = await editField.isDisabled();
    expect(isDisabled).toBe(true);

    await page.waitForTimeout(1000);

    // Check if the input field is readonly
    const inputField = page.locator("#dontwrite");
    const isReadonly = await inputField.getAttribute("readonly");
    expect(isReadonly).not.toBeNull();
  });
});
