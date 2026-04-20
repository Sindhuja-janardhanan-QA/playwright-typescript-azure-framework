import { test, expect } from '@playwright/test';
import { BasePage } from '../../src/pages/BasePage';

test.describe('Login Tests', () => {
  test('should display login page correctly', async ({ page }) => {
    const basePage = new BasePage(page);
    
    // Navigate to login page
    await basePage.navigate('/login');
    
    // Verify page title
    await expect(page).toHaveTitle(/Login/);
    
    // Check if login form is visible
    const loginForm = page.locator('form[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    const basePage = new BasePage(page);
    
    await basePage.navigate('/login');
    
    // Try to submit empty form
    await basePage.click('button[type="submit"]');
    
    // Check for validation messages
    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');
    
    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
    
    // Verify error messages
    const emailErrorText = await basePage.getText(emailError);
    const passwordErrorText = await basePage.getText(passwordError);
    
    expect(emailErrorText).toContain('Email is required');
    expect(passwordErrorText).toContain('Password is required');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const basePage = new BasePage(page);
    
    await basePage.navigate('/login');
    
    // Fill in login form
    await basePage.fill('input[name="email"]', 'test@example.com');
    await basePage.fill('input[name="password"]', 'password123');
    
    // Submit form
    await basePage.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await basePage.waitFor('[data-testid="dashboard"]');
    
    // Verify successful login
    const welcomeMessage = page.locator('[data-testid="welcome-message"]');
    await expect(welcomeMessage).toBeVisible();
    
    const welcomeText = await basePage.getText(welcomeMessage);
    expect(welcomeText).toContain('Welcome');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const basePage = new BasePage(page);
    
    await basePage.navigate('/login');
    
    // Fill in invalid credentials
    await basePage.fill('input[name="email"]', 'invalid@example.com');
    await basePage.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await basePage.click('button[type="submit"]');
    
    // Wait for error message
    await basePage.waitFor('[data-testid="login-error"]');
    
    // Verify error message
    const errorMessage = page.locator('[data-testid="login-error"]');
    await expect(errorMessage).toBeVisible();
    
    const errorText = await basePage.getText(errorMessage);
    expect(errorText).toContain('Invalid email or password');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    const basePage = new BasePage(page);
    
    await basePage.navigate('/login');
    
    // Click forgot password link
    await basePage.click('a[href="/forgot-password"]');
    
    // Wait for forgot password page
    await basePage.waitFor('[data-testid="forgot-password-form"]');
    
    // Verify navigation
    await expect(page).toHaveURL(/forgot-password/);
    const forgotPasswordForm = page.locator('[data-testid="forgot-password-form"]');
    await expect(forgotPasswordForm).toBeVisible();
  });
});
