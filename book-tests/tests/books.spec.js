import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
})


test('loads the 3 default books', async ({ page }) => {
    await expect(page.getByText('Pride and Prejudice')).toBeVisible();
})

async function addBook(page, title, author, year) {
    await page.getByPlaceholder('Enter title').fill(title);
    await page.getByPlaceholder('Enter author').fill(author);
    await page.getByPlaceholder('Enter year').fill(year);
    await page.getByRole('button', { name: 'Add Book' }).click();
}

test('add a new book', async ({ page }) => {
    await addBook(page, 'Dune', 'Frank Herbert', '1965');
    await expect(page.getByRole('row', { name: /Dune/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('row', { name: /Dune/ })).toBeVisible();
})

test('delete a book', async ({ page }) => {
    await page
        .getByRole('row', { name: /Pride and Prejudice/ })
        .getByRole('button', { name: 'Delete' })
        .click();
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).not.toBeVisible();
})

test('search filter by title, case-insensitive', async ({ page }) => {
    await page.getByPlaceholder('Search by title').fill('PRIDE');
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Black Beauty/ })).toHaveCount(0);
})

test('delete works while a search is active', async ({ page }) => {
    await page.getByPlaceholder('Search by title').fill('time machine');
    await page
        .getByRole('row', { name: /The Time Machine/ })
        .getByRole('button', { name: 'Delete' })
        .click();
    await page.getByPlaceholder('Search by title or author').fill('');
    await expect(page.getByRole('row', { name: /The Time Machine/ })).toHaveCount(0);
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Black Beauty/ })).toBeVisible();
})

test('edit a book', async ({ page }) => {
    await page
        .getByRole('row', { name: /Pride and Prejudice/ })
        .getByRole('button', { name: 'Edit' })
        .click();

    await page.getByPlaceholder('Enter year').fill('1814');
    await page.getByRole('button', { name: 'Add Book' }).click();
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).toContainText('1814');
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).not.toContainText('1813');
})

test('edit works while a search is active', async ({ page }) => {
    const search = page.getByPlaceholder('Search by title or author');

    await search.fill('time machine');
    const row = page.getByRole('row', { name: /The Time Machine/ });
    await row.getByRole('button', { name: 'Edit' }).click();
    await page.getByPlaceholder('Enter year').fill('1896');
    await page.getByRole('button', { name: 'Add Book' }).click();
    await search.fill('');

    // the edited book changed
    await expect(page.getByRole('row', { name: /The Time Machine/ })).toContainText('1896');
    await expect(page.getByRole('row', { name: /The Time Machine/ })).not.toContainText('1895');

    // the other books did not
    await expect(page.getByRole('row', { name: /Pride and Prejudice/ })).toContainText('1813');
    await expect(page.getByRole('row', { name: /Black Beauty/ })).toContainText('1877');

})