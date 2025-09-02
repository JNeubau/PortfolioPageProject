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
    // First try the rate limit endpoint which requires less permissions
    console.log('Testing token with rate_limit endpoint...');
    const rateResponse = await fetch('https://api.github.com/rate_limit', {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (rateResponse.status === 200) {
      console.log('Rate limit check passed, token is valid');
      
      // Now check if we can access the repository
      console.log('Testing repository access...');
      const repoResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
        method: 'GET',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (repoResponse.status === 200) {
        console.log('Repository access check passed');
        
        // Try to check token scopes
        const scopes = rateResponse.headers.get('x-oauth-scopes') || 'none';
        console.log('Token scopes:', scopes);
        
        // Check for required scopes
        if (!scopes.includes('repo') && !scopes.includes('public_repo')) {
          console.warn('WARNING: Token is missing repo/public_repo scope, which is required for repository_dispatch');
        }
        
        return true;
      } else {
        console.warn('Repository access check failed with status:', repoResponse.status);
        return false;
      }
    } else {
      console.warn('Rate limit check failed with status:', rateResponse.status);
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
    
    // First verify repository access before attempting dispatch
    const repoCheckResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (repoCheckResponse.status !== 200) {
      console.error(`Cannot access repository: ${REPO_OWNER}/${REPO_NAME} (${repoCheckResponse.status})`);
      return {
        success: false,
        message: `Cannot access repository. Please check if '${REPO_OWNER}/${REPO_NAME}' exists and your token has access.`
      };
    }
    
    // Token encoding debug information
    console.log('Token prefix check:', GITHUB_TOKEN.startsWith('ghp_') || GITHUB_TOKEN.startsWith('github_pat_'));
    console.log('Using authorization header format:', `token ${GITHUB_TOKEN.substring(0, 3)}...`);
    
    // Prepare headers with correct token format
    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
    
    // Debug headers (without exposing full token)
    console.log('Request headers:', {
      'Authorization': headers.Authorization.substring(0, 9) + '...',
      'Accept': headers.Accept,
      'Content-Type': headers['Content-Type']
    });
    
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        event_type: 'artwork-submission',
        client_payload: {
          artwork: artwork
        }
      })
    });

    if (response.status === 204) {
      // 204 No Content is the expected successful response
      console.log('Repository dispatch succeeded with status 204');
      return { success: true, message: 'Artwork submitted successfully. It will be processed soon.' };
    } else if (response.status === 401) {
      // Unauthorized - invalid token
      console.error('GitHub API Error: Invalid token or insufficient permissions (401)');
      console.error('This may be due to an incorrect token encoding or an invalid token');
      return { 
        success: false, 
        message: 'GitHub authentication failed. Your token may be invalid or expired.'
      };
    } else if (response.status === 404) {
      // Not found - repository doesn't exist or token doesn't have access
      console.error(`GitHub API Error: Repository ${REPO_OWNER}/${REPO_NAME} not found or no access to dispatches endpoint (404)`);
      
      // Since we already verified repo access, this is likely a permissions issue
      return {
        success: false,
        message: 'Your token may not have permission to trigger workflows. Please ensure it has the "repo" and "workflow" scopes.'
      };
    } else if (response.status === 403) {
      // Forbidden - token doesn't have sufficient permissions
      console.error('GitHub API Error: Insufficient permissions (403)');
      console.error('Your token does not have the required scopes for this operation');
      return {
        success: false,
        message: 'Your GitHub token does not have sufficient permissions for this operation.'
      };
    } else {
      // Other errors
      let errorMessage = `GitHub API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
        console.error('Full error details:', errorData);
      } catch (e) {
        // If we can't parse the error, just use status code
        try {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
        } catch (textError) {
          console.error('Could not read error response body');
        }
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
