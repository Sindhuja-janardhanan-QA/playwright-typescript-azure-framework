import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async click(selector: string | Locator): Promise<void> {
    console.log(`Clicking on: ${typeof selector === 'string' ? selector : 'Locator'}`);
    if (typeof selector === 'string') {
      await this.page.click(selector);
    } else {
      await selector.click();
    }
  }

  async fill(selector: string | Locator, value: string): Promise<void> {
    console.log(`Filling ${typeof selector === 'string' ? selector : 'Locator'} with: ${value}`);
    if (typeof selector === 'string') {
      await this.page.fill(selector, value);
    } else {
      await selector.fill(value);
    }
  }

  async waitFor(selector: string | Locator, options?: { timeout?: number }): Promise<void> {
    console.log(`Waiting for: ${typeof selector === 'string' ? selector : 'Locator'}`);
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, options);
    } else {
      await selector.waitFor(options);
    }
  }

  async navigate(url: string): Promise<void> {
    console.log(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  async getText(selector: string | Locator): Promise<string> {
    console.log(`Getting text from: ${typeof selector === 'string' ? selector : 'Locator'}`);
    if (typeof selector === 'string') {
      return await this.page.textContent(selector) || '';
    } else {
      return await selector.textContent() || '';
    }
  }

  async isVisible(selector: string | Locator): Promise<boolean> {
    console.log(`Checking visibility of: ${typeof selector === 'string' ? selector : 'Locator'}`);
    if (typeof selector === 'string') {
      return await this.page.isVisible(selector);
    } else {
      return await selector.isVisible();
    }
  }
}
