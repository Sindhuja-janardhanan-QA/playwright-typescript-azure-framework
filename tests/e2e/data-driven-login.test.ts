import { test, expect } from '@playwright/test';
import { BasePage } from '../../src/pages/BasePage';
import * as usersData from '../../src/data/users.json';

test.describe('Data-Driven Login Tests', () => {
  usersData.forEach((user, index) => {
    test(`Login test for ${user.userType} user: ${user.description}`, async ({ page }) => {
      const basePage = new BasePage(page);
      
      // Navigate to login page
      await basePage.navigate('/login');
      
      // Verify we're on the login page
      await expect(page).toHaveURL(/.*login/);
      
      // Fill in login credentials
      await basePage.fill('input[name="email"]', user.username);
      await basePage.fill('input[name="password"]', user.password);
      
      // Submit login form
      await basePage.click('button[type="submit"]');
      
      // Handle different expected outcomes based on user type
      switch (user.expectedOutcome) {
        case 'success':
          // Wait for successful login redirect
          await basePage.waitFor('[data-testid="dashboard"]');
          
          // Verify URL redirect
          await expect(page).toHaveURL(new RegExp(user.expectedRedirect));
          
          // Verify welcome message
          const welcomeMessage = page.locator('[data-testid="welcome-message"]');
          await expect(welcomeMessage).toBeVisible();
          const welcomeText = await basePage.getText(welcomeMessage);
          expect(welcomeText).toContain(user.expectedWelcomeMessage);
          
          // Verify user-specific elements are visible
          if (user.userType === 'admin') {
            const adminPanel = page.locator('[data-testid="admin-panel"]');
            await expect(adminPanel).toBeVisible();
          } else if (user.userType === 'standard') {
            const userProfile = page.locator('[data-testid="user-profile"]');
            await expect(userProfile).toBeVisible();
          }
          break;
          
        case 'failure':
          // Wait for error message
          await basePage.waitFor('[data-testid="login-error"]');
          
          // Verify error message
          const errorMessage = page.locator('[data-testid="login-error"]');
          await expect(errorMessage).toBeVisible();
          const errorText = await basePage.getText(errorMessage);
          expect(errorText).toContain(user.expectedErrorMessage);
          
          // Verify we're still on login page
          await expect(page).toHaveURL(new RegExp(user.expectedRedirect));
          
          // Verify form fields are still present
          const emailInput = page.locator('input[name="email"]');
          const passwordInput = page.locator('input[name="password"]');
          await expect(emailInput).toBeVisible();
          await expect(passwordInput).toBeVisible();
          break;
          
        case 'password_reset_required':
          // Wait for redirect to password reset page
          await basePage.waitFor('[data-testid="reset-password-form"]');
          
          // Verify URL redirect
          await expect(page).toHaveURL(new RegExp(user.expectedRedirect));
          
          // Verify reset password message
          const resetMessage = page.locator('[data-testid="reset-message"]');
          await expect(resetMessage).toBeVisible();
          const resetText = await basePage.getText(resetMessage);
          expect(resetText).toContain(user.expectedErrorMessage);
          
          // Verify email is pre-filled
          const emailField = page.locator('input[name="email"]');
          const emailValue = await emailField.inputValue();
          expect(emailValue).toBe(user.username);
          break;
          
        default:
          throw new Error(`Unknown expected outcome: ${user.expectedOutcome}`);
      }
      
      // Log test completion for debugging
      console.log(`✅ Test completed for ${user.userType} user (${user.username}): ${user.expectedOutcome}`);
    });
  });

  test('Data integrity: Verify all user data is valid', async () => {
    // This test ensures our test data is complete and valid
    expect(usersData.length).toBeGreaterThan(0);
    
    usersData.forEach((user, index) => {
      // Verify required fields exist
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('description');
      expect(user).toHaveProperty('userType');
      expect(user).toHaveProperty('expectedOutcome');
      
      // Verify username format
      expect(user.username).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      
      // Verify expected outcome is valid
      expect(['success', 'failure', 'password_reset_required']).toContain(user.expectedOutcome);
      
      console.log(`✅ User data validation passed for ${user.userType} user at index ${index}`);
    });
  });

  test('Performance: Login response time should be acceptable', async ({ page }) => {
    const basePage = new BasePage(page);
    const testUser = usersData.find(user => user.userType === 'standard');
    
    if (!testUser) {
      throw new Error('Standard user not found in test data');
    }
    
    await basePage.navigate('/login');
    
    // Measure login response time
    const startTime = Date.now();
    
    await basePage.fill('input[name="email"]', testUser.username);
    await basePage.fill('input[name="password"]', testUser.password);
    await basePage.click('button[type="submit"]');
    
    // Wait for successful login
    await basePage.waitFor('[data-testid="dashboard"]');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Assert response time is under 5 seconds
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`🚀 Login response time: ${responseTime}ms for ${testUser.userType} user`);
  });
});
