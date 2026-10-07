# My Page Collector

![Playwright Tests](https://github.com/TYHern1997/Book-Collection-Manager/actions/workflows/playwright.yml/badge.svg)

A small book collection manager built with plain HTML, CSS and JavaScript. Books are stored in the browser's localStorage.

## Features
- Add, edit and delete books
- Search by title or author (case-insensitive)
- Data persists across page reloads

## Tests
End-to-end tests written with [Playwright](https://playwright.dev), run automatically on every push with GitHub Actions.

Covered:
- Default books load
- Add a book, and it persists after reload
- Delete a book
- Search filteringgio
- Delete and edit while a search filter is active (regression tests for a wrong-index bug)

## Run locally

**Use the app:**
```bash
npm install
npm run dev
```
Then open the URL Vite prints (usually http://localhost:5173).

**Run the tests** (Playwright starts the app automatically):
```bash
cd book-tests
npm install
npx playwright install chromium
npx playwright test --project=chromium
