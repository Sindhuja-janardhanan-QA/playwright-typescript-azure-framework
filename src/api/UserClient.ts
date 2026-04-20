import { APIRequestContext, APIResponse } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Post {
  userId?: number;
  id?: number;
  title: string;
  body: string;
}

export interface CreatePostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface APIErrorData {
  message: string;
  status: number;
  statusText: string;
}

export class APIError extends Error {
  public readonly status: number;
  public readonly statusText: string;

  constructor(data: APIErrorData) {
    super(data.message);
    this.status = data.status;
    this.statusText = data.statusText;
    this.name = 'APIError';
  }
}

export class UserClient {
  private readonly baseUrl: string;
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext, baseUrl: string = process.env.API_URL || 'https://jsonplaceholder.typicode.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new post via API
   * @param postData - Post data to create
   * @returns Promise<CreatePostResponse>
   * @throws APIError if request fails
   */
  async createPost(postData: Omit<Post, 'id'>): Promise<CreatePostResponse> {
    console.log(`📤 Creating post: ${postData.title}`);
    
    try {
      const response: APIResponse = await this.request.post(`${this.baseUrl}/posts`, {
        data: postData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Create post response status: ${response.status()}`);

      if (!response.ok()) {
        const errorBody = await response.text();
        throw new APIError({
          message: `Failed to create post: ${errorBody}`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      const createdPost = await response.json() as CreatePostResponse;
      console.log(`✅ Post created successfully with ID: ${createdPost.id}`);
      
      return createdPost;
    } catch (error) {
      console.error(`❌ Error creating post:`, error);
      throw error;
    }
  }

  /**
   * Get a post by ID via API
   * @param postId - ID of the post to retrieve
   * @returns Promise<Post>
   * @throws APIError if request fails
   */
  async getPost(postId: number): Promise<Post> {
    console.log(`📥 Fetching post with ID: ${postId}`);
    
    try {
      const response: APIResponse = await this.request.get(`${this.baseUrl}/posts/${postId}`);
      
      console.log(`📊 Get post response status: ${response.status()}`);

      if (response.status() === 404) {
        throw new APIError({
          message: `Post with ID ${postId} not found`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      if (!response.ok()) {
        const errorBody = await response.text();
        throw new APIError({
          message: `Failed to get post: ${errorBody}`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      const post = await response.json() as Post;
      console.log(`✅ Post retrieved successfully: ${post.title}`);
      
      return post;
    } catch (error) {
      console.error(`❌ Error getting post:`, error);
      throw error;
    }
  }

  /**
   * Update a post via API
   * @param postId - ID of the post to update
   * @param postData - Updated post data
   * @returns Promise<Post>
   * @throws APIError if request fails
   */
  async updatePost(postId: number, postData: Partial<Post>): Promise<Post> {
    console.log(`📝 Updating post with ID: ${postId}`);
    
    try {
      const response: APIResponse = await this.request.put(`${this.baseUrl}/posts/${postId}`, {
        data: postData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Update post response status: ${response.status()}`);

      if (!response.ok()) {
        const errorBody = await response.text();
        throw new APIError({
          message: `Failed to update post: ${errorBody}`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      const updatedPost = await response.json() as Post;
      console.log(`✅ Post updated successfully: ${updatedPost.title}`);
      
      return updatedPost;
    } catch (error) {
      console.error(`❌ Error updating post:`, error);
      throw error;
    }
  }

  /**
   * Delete a post via API
   * @param postId - ID of the post to delete
   * @returns Promise<boolean>
   * @throws APIError if request fails
   */
  async deletePost(postId: number): Promise<boolean> {
    console.log(`🗑️ Deleting post with ID: ${postId}`);
    
    try {
      const response: APIResponse = await this.request.delete(`${this.baseUrl}/posts/${postId}`);
      
      console.log(`📊 Delete post response status: ${response.status()}`);

      if (!response.ok()) {
        const errorBody = await response.text();
        throw new APIError({
          message: `Failed to delete post: ${errorBody}`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      console.log(`✅ Post deleted successfully: ${postId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting post:`, error);
      throw error;
    }
  }

  /**
   * Get all posts via API
   * @returns Promise<Post[]>
   * @throws APIError if request fails
   */
  async getAllPosts(): Promise<Post[]> {
    console.log(`📥 Fetching all posts`);
    
    try {
      const response: APIResponse = await this.request.get(`${this.baseUrl}/posts`);
      
      console.log(`📊 Get all posts response status: ${response.status()}`);

      if (!response.ok()) {
        const errorBody = await response.text();
        throw new APIError({
          message: `Failed to get all posts: ${errorBody}`,
          status: response.status(),
          statusText: response.statusText(),
        } as APIError);
      }

      const posts = await response.json() as Post[];
      console.log(`✅ Retrieved ${posts.length} posts`);
      
      return posts;
    } catch (error) {
      console.error(`❌ Error getting all posts:`, error);
      throw error;
    }
  }

  /**
   * Validate API response status and handle errors
   * @param response - APIResponse object
   * @throws APIError if response is not ok
   */
  private async validateResponse(response: APIResponse): Promise<void> {
    if (!response.ok()) {
      const errorBody = await response.text();
      const error = new APIError({
        message: `API Error: ${errorBody}`,
        status: response.status(),
        statusText: response.statusText(),
      });
      
      // Categorize error types
      if (response.status() >= 400 && response.status() < 500) {
        console.warn(`⚠️ Client Error (${response.status()}): ${errorBody}`);
      } else if (response.status() >= 500) {
        console.error(`🔥 Server Error (${response.status()}): ${errorBody}`);
      }
      
      throw error;
    }
  }
}
