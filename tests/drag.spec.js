const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/homepage");

test.describe("Test Drag and Drop", () => {
  test("Go to HomePage and Open Link", async ({ page }) => {
    const hyperlink = '//a[@href="/draggable"]';
    const homePage = new HomePage(page, hyperlink);
    await homePage.navigate();
    expect(await homePage.isLoaded()).toBeTruthy();
    await page.click(hyperlink);

    // Get the location of the element
    const header = page.locator("#header");
    const boundingBox = await header.boundingBox();
    console.log(boundingBox.x + "," + boundingBox.y);

    await page.waitForTimeout(500);

    // Perform the drag and drop by moving the mouse to the center, then by the offset
    await page.hover("#header");
    await page.mouse.down();
    await page.mouse.move(boundingBox.x + 150, boundingBox.y + 150, {steps: 20});
    await page.mouse.up();

    // Get the new location of the element

    const newBoundingBox = await header.boundingBox();
    console.log(newBoundingBox.x + "," + newBoundingBox.y);

    await page.waitForTimeout(1000);

    // Verify that the element has moved
    expect(boundingBox.x).not.toEqual(newBoundingBox.x);
    expect(boundingBox.y).not.toEqual(newBoundingBox.y);
  
  
  });
});
