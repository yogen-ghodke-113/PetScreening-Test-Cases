const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/homepage");

// Check if an array contains all numbers
function isArrayNumeric(arr) {
    return arr.every(item => !isNaN(item));
  }

// Comparator for sorting numbers 
function compareNumbers(a, b) {
    return a - b;
  }


test.describe("Test Simple Tables", () => {
  test("Go to HomePage and Open Link", async ({ page }) => {
    const hyperlink = '//a[@href="/table"]';
    const homePage = new HomePage(page, hyperlink);
    await homePage.navigate();
    expect(await homePage.isLoaded()).toBeTruthy();
    await page.click(hyperlink);

    // Check sum and total
    const table1 = page.locator("#shopping");
    const prices = await table1.locator("//tbody//td[2]").elementHandles();

    let sum_prices = 0;
    for (const price of prices) {
      const text = await price.textContent();
      sum_prices += parseInt(text);
    }

    const totalText = await table1.locator("//tfoot//td[2]").textContent();
    const total = parseInt(totalText.trim());

    // Check if the sum of the prices is equal to the total
    expect(sum_prices).toEqual(total);

    // Mark Raj as Present
    const rajCheckbox = page.locator(
      '//table[@id = "simpletable"]//tbody//td[2][text()="Raj"]/following-sibling::td[2]/input'
    );

    await page.waitForTimeout(500);
    await rajCheckbox.click();
    await page.waitForTimeout(500);

    // Check if Raj is marked as present
    const rajPresent = await rajCheckbox.isChecked();
    expect(rajPresent).toBeTruthy();

    // Check if the tables are sorting properly
    const table3 = page.locator("//table[contains(@class, 'mat-sort')]");
    await table3.scrollIntoViewIfNeeded();

    const cols = table3.locator("thead th");
    const rows = table3.locator("tr");

    for (let i = 0; i < (await cols.count()); i++) {
      let arr1 = [];
      let arr2 = [];
      const curr_col = cols.nth(i);
      const curr_col_text = await curr_col.textContent();
      
      await curr_col.click();

      for (let j = 0; j < (await rows.count()); j++) {
        const curr_row = rows.nth(j).locator("td").nth(i);
        const curr_row_text = await curr_row.textContent();
        
        // Check if curr_row_text is a number and type cast if necessary
        if (!isNaN(curr_row_text)) {
            arr1.push(parseFloat(curr_row_text));
        } else {
            arr1.push(curr_row_text);
        }
      }


      //check if arr1 is sorted
      let arr1_sorted = arr1.slice();
      if (isArrayNumeric(arr1_sorted)) {
        arr1_sorted.sort(compareNumbers);
    } else {
        arr1_sorted.sort();
    }    
      

      expect(arr1).toEqual(arr1_sorted);

      await curr_col.click();
      for (let j = 0; j < (await rows.count()); j++) {
        const curr_row = rows.nth(j).locator("td").nth(i);
        const curr_row_text = await curr_row.textContent();
        // Check if curr_row_text is a number and type cast if necessary
        if (!isNaN(curr_row_text)) {
            arr2.push(parseFloat(curr_row_text));
        } else {
            arr2.push(curr_row_text);
        }
      }

        
        //check if arr2 is sorted in reverse
        let arr2_sorted = arr2.slice();
        if (isArrayNumeric(arr2_sorted)) {
            arr2_sorted.sort(compareNumbers);
        } else {
            arr2_sorted.sort();
        }    
        arr2_sorted.reverse();
        expect(arr2).toEqual(arr2_sorted);
      
    }
  });
});