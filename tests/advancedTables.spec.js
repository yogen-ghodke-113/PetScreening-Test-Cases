const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/homepage");

// Check if an array contains all numbers
function isArrayNumeric(arr) {
  return arr.every((item) => !isNaN(item));
}

// Comparator for sorting numbers
function compareNumbers(a, b) {
  return a - b;
}

test.describe("Test Advanced Tables", () => {
  test("Go to HomePage and Open Link", async ({ page }) => {
    const hyperlink = '//a[@href="/advancedtable"]';
    const homePage = new HomePage(page, hyperlink);
    await homePage.navigate();
    expect(await homePage.isLoaded()).toBeTruthy();
    await page.click(hyperlink);

    // Check if the tables are sorting properly

    const dropdown = page.locator('//select[@name="advancedtable_length"]');
    //await dropdown.selectOption({ label: "25" });

    const table = page.locator("#advancedtable");
    await table.scrollIntoViewIfNeeded();

    const cols = table.locator("thead th");
    const rows = table.locator("tbody tr");

    //const first = page.locator("#advancedtable_first");
    const last = page.locator("#advancedtable_last");
    let isOnLastPage = false;
    


    for (let k = 0; k < 2; k++) {
      await page.reload();
      await dropdown.selectOption({ label: "25" });
      let flag = false;

      for (let i = 0; i < (await cols.count()); i++) {
        let arr1 = [];
        let arr2 = [];
        const curr_col = cols.nth(i);
        const curr_col_text = await curr_col.textContent();

        if (flag) {
          await curr_col.click();
        }
        flag = true;

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

        //console.log(arr1, arr1_sorted);
        //console.log(arr2, arr2_sorted);

      }
      if (!isOnLastPage) {
        await last.scrollIntoViewIfNeeded();
        await last.click();
        isOnLastPage = true;
      }
    }
  });
});
