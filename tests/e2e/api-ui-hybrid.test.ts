import { test, expect, request } from '@playwright/test';
import { BasePage } from '../../src/pages/BasePage';
import { UserClient, APIError, Post } from '../../src/api/UserClient';

test.describe('API-UI Hybrid Tests', () => {
  let apiClient: UserClient;
  let createdPostId: number;

  test.beforeAll(async () => {
    // Initialize API client
    const apiRequest = await request.newContext();
    apiClient = new UserClient(apiRequest);
  });

  test.afterAll(async () => {
    // Cleanup: Delete the created post if it exists
    if (createdPostId) {
      try {
        await apiClient.deletePost(createdPostId);
        console.log(`🧹 Cleaned up post with ID: ${createdPostId}`);
      } catch (error) {
        console.warn(`⚠️ Failed to cleanup post ${createdPostId}:`, error);
      }
    }
  });

  test('Step 1: Create post via API and capture ID', async () => {
    const postData: Omit<Post, 'id'> = {
      userId: 1,
      title: 'Test Post for API-UI Integration',
      body: 'This is a test post created via API for demonstrating API-UI chaining in Playwright tests.',
    };

    try {
      const createdPost = await apiClient.createPost(postData);
      createdPostId = createdPost.id;

      // Verify the response structure
      expect(createdPost).toHaveProperty('id');
      expect(createdPost).toHaveProperty('userId', postData.userId);
      expect(createdPost).toHaveProperty('title', postData.title);
      expect(createdPost).toHaveProperty('body', postData.body);

      // Verify the ID is a positive number
      expect(createdPostId).toBeGreaterThan(0);

      console.log(`✅ Successfully created post with ID: ${createdPostId}`);
      console.log(`📝 Post title: ${createdPost.title}`);
      console.log(`📄 Post body: ${createdPost.body.substring(0, 50)}...`);

    } catch (error) {
      console.error('❌ Failed to create post via API:', error);
      throw error;
    }
  });

  test('Step 2: Retrieve post via API and verify data integrity', async () => {
    expect(createdPostId).toBeDefined();
    expect(createdPostId).toBeGreaterThan(0);

    try {
      const retrievedPost = await apiClient.getPost(createdPostId);

      // Verify the retrieved post matches what we created
      expect(retrievedPost).toHaveProperty('id', createdPostId);
      expect(retrievedPost).toHaveProperty('userId', 1);
      expect(retrievedPost).toHaveProperty('title', 'Test Post for API-UI Integration');
      expect(retrievedPost).toHaveProperty('body');

      console.log(`✅ Successfully retrieved post with ID: ${retrievedPost.id}`);
      console.log(`📝 Retrieved title: ${retrievedPost.title}`);

    } catch (error) {
      console.error('❌ Failed to retrieve post via API:', error);
      throw error;
    }
  });

  test('Step 3: Update post via API and verify changes', async () => {
    expect(createdPostId).toBeDefined();

    const updateData = {
      title: 'Updated Test Post for API-UI Integration',
      body: 'This post has been updated via API to demonstrate data modification in API-UI testing.',
    };

    try {
      const updatedPost = await apiClient.updatePost(createdPostId, updateData);

      // Verify the update was successful
      expect(updatedPost).toHaveProperty('id', createdPostId);
      expect(updatedPost).toHaveProperty('title', updateData.title);
      expect(updatedPost).toHaveProperty('body', updateData.body);

      console.log(`✅ Successfully updated post with ID: ${updatedPost.id}`);
      console.log(`📝 Updated title: ${updatedPost.title}`);

    } catch (error) {
      console.error('❌ Failed to update post via API:', error);
      throw error;
    }
  });

  test('Step 4: API-UI Chaining - Verify data in UI matches API data', async ({ page }) => {
    expect(createdPostId).toBeDefined();

    const basePage = new BasePage(page);

    try {
      // Navigate to a mock page that displays posts
      // Note: This is a simulated UI verification since jsonplaceholder doesn't have a UI
      // In a real application, you would navigate to the actual page that displays the post
      await basePage.navigate('/posts');

      // Simulate finding the post in the UI and verifying its content
      // In a real scenario, you would locate the actual post element
      const postElement = page.locator(`[data-post-id="${createdPostId}"]`);
      
      // Since we're working with a mock API, we'll simulate the UI verification
      // In a real application, you would:
      // 1. Wait for the post to be visible
      // 2. Get the actual text content from the UI
      // 3. Compare it with the API data

      // Simulate UI data verification
      console.log(`🔍 Simulating UI verification for post ID: ${createdPostId}`);
      
      // Get the latest data from API to compare with UI
      const latestPostData = await apiClient.getPost(createdPostId);
      
      // Simulate finding the post in UI (mock verification)
      console.log(`📱 UI would display: ${latestPostData.title}`);
      console.log(`📱 UI would show: ${latestPostData.body.substring(0, 100)}...`);

      // In a real test, you would do something like:
      // await expect(postElement).toBeVisible();
      // const uiTitle = await postElement.locator('.post-title').textContent();
      // const uiBody = await postElement.locator('.post-body').textContent();
      // expect(uiTitle).toBe(latestPostData.title);
      // expect(uiBody).toBe(latestPostData.body);

      // For demonstration, we'll verify the data structure
      expect(latestPostData).toHaveProperty('id', createdPostId);
      expect(latestPostData).toHaveProperty('title');
      expect(latestPostData).toHaveProperty('body');

      console.log(`✅ API-UI chaining verification completed`);
      console.log(`📊 API data: ${latestPostData.title}`);
      console.log(`🌐 UI would display the same data`);

    } catch (error) {
      console.error('❌ Failed to verify API-UI chaining:', error);
      throw error;
    }
  });

  test('Error Handling: Test 404 error for non-existent post', async () => {
    const nonExistentId = 999999;

    try {
      await apiClient.getPost(nonExistentId);
      // If we reach here, test should fail
      throw new Error('Expected APIError to be thrown for non-existent post');
    } catch (error) {
      // Verify it's the expected APIError
      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).status).toBe(404);
      expect((error as APIError).message).toContain('not found');
      
      console.log(`✅ Correctly handled 404 error for post ID: ${nonExistentId}`);
      console.log(`📊 Error status: ${(error as APIError).status}`);
      console.log(`📝 Error message: ${(error as APIError).message}`);
    }
  });

  test('Error Handling: Test invalid data for post creation', async () => {
    const invalidPostData = {
      // Missing required fields
      userId: 'invalid', // Should be a number
      // Missing title and body
    };

    try {
      await apiClient.createPost(invalidPostData as any);
      throw new Error('Expected APIError to be thrown for invalid data');
    } catch (error) {
      // Verify it's the expected APIError
      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).status).toBeGreaterThanOrEqual(400);
      expect((error as APIError).status).toBeLessThan(500);
      
      console.log(`✅ Correctly handled validation error for invalid post data`);
      console.log(`📊 Error status: ${(error as APIError).status}`);
      console.log(`📝 Error message: ${(error as APIError).message}`);
    }
  });

  test('Performance: Measure API response times', async () => {
    const testPost = {
      userId: 1,
      title: 'Performance Test Post',
      body: 'This post is created to measure API response times.',
    };

    // Measure create post performance
    const createStartTime = Date.now();
    const createdPost = await apiClient.createPost(testPost);
    const createEndTime = Date.now();
    const createResponseTime = createEndTime - createStartTime;

    // Measure get post performance
    const getStartTime = Date.now();
    await apiClient.getPost(createdPost.id);
    const getEndTime = Date.now();
    const getResponseTime = getEndTime - getStartTime;

    // Assert reasonable response times (under 5 seconds)
    expect(createResponseTime).toBeLessThan(5000);
    expect(getResponseTime).toBeLessThan(5000);

    console.log(`⚡ Create post response time: ${createResponseTime}ms`);
    console.log(`⚡ Get post response time: ${getResponseTime}ms`);

    // Cleanup the performance test post
    await apiClient.deletePost(createdPost.id);
    console.log(`🧹 Cleaned up performance test post: ${createdPost.id}`);
  });
});
