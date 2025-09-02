/**
 * GitHub API Client
 * 
 * This module provides functions to interact with GitHub's API
 * for submitting artwork to the repository.
 */

// Get GitHub token from environment variables
// In production, this will be set as a GitHub secret
// In development, you can set it in a .env file (make sure to add .env to .gitignore)
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const REPO_OWNER = 'JNeubau';
const REPO_NAME = 'PortfolioPageProject';

// Debug information - remove in production
console.log('GitHub API Client loaded');
console.log('Token exists:', !!GITHUB_TOKEN);
console.log('Token length:', GITHUB_TOKEN.length);
if (GITHUB_TOKEN.length > 0) {
  console.log('Token format check:', GITHUB_TOKEN.startsWith('ghp_') || GITHUB_TOKEN.startsWith('github_pat_'));
}

/**
 * Tests if the configured GitHub token is valid
 * 
 * @returns {Promise<boolean>} - True if token is valid, false otherwise
 */
export async function testGitHubToken() {
  if (!GITHUB_TOKEN) {
    console.warn('GitHub token is not set');
    return false;
  }
  
  // Basic format check
  const hasValidFormat = GITHUB_TOKEN.startsWith('ghp_') || GITHUB_TOKEN.startsWith('github_pat_');
  if (!hasValidFormat) {
    console.warn('GitHub token format appears to be invalid. Expected to start with ghp_ or github_pat_');
    // We'll still test it with the API to be sure
  }
  
  try {
    // Use a simple endpoint to test token validity
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.status === 200) {
      // If successful, get the user data to display in console for debugging
      const userData = await response.json();
      console.log('GitHub token is valid for user:', userData.login);
      return true;
    } else {
      console.warn('GitHub API returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error testing GitHub token:', error);
    return false;
  }
}

/**
 * Submit artwork data to GitHub repository via repository_dispatch event
 * 
 * @param {Object} artwork - The artwork data to be submitted
 * @returns {Promise<Object>} - Response from GitHub API
 */
export async function submitArtworkToGitHub(artwork) {
  try {
    // Check if token is set before making the request
    if (!GITHUB_TOKEN) {
      console.warn('GitHub token is not set. Please set VITE_GITHUB_TOKEN environment variable.');
      return { 
        success: false, 
        message: 'GitHub token is not configured. Your artwork was saved locally but not to the server.'
      };
    }
    
    // Validate token format (basic check)
    if (GITHUB_TOKEN.length < 30) {
      console.warn('GitHub token appears to be invalid (too short).');
      return {
        success: false,
        message: 'GitHub token appears to be invalid. Please check your configuration.'
      };
    }
    
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'artwork-submission',
        client_payload: {
          artwork: artwork
        }
      })
    });

    if (response.status === 204) {
      // 204 No Content is the expected successful response
      return { success: true, message: 'Artwork submitted successfully. It will be processed soon.' };
    } else if (response.status === 401) {
      // Unauthorized - invalid token
      console.error('GitHub API Error: Invalid token or insufficient permissions');
      return { 
        success: false, 
        message: 'GitHub authentication failed. Your token may be invalid or expired.'
      };
    } else if (response.status === 404) {
      // Not found - repository doesn't exist or token doesn't have access
      console.error(`GitHub API Error: Repository ${REPO_OWNER}/${REPO_NAME} not found or no access`);
      return {
        success: false,
        message: 'Repository not found or your token does not have access to it.'
      };
    } else {
      // Other errors
      let errorMessage = `GitHub API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        // If we can't parse the error, just use status code
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error submitting artwork to GitHub:', error);
    return { 
      success: false, 
      message: 'Error submitting artwork. Please try again later.',
      error: error.message
    };
  }
}
