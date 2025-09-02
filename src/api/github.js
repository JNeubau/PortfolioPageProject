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

/**
 * Submit artwork data to GitHub repository via repository_dispatch event
 * 
 * @param {Object} artwork - The artwork data to be submitted
 * @returns {Promise<Object>} - Response from GitHub API
 */
export async function submitArtworkToGitHub(artwork) {
  try {
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

    if (!GITHUB_TOKEN) {
      console.warn('GitHub token is not set. Please set VITE_GITHUB_TOKEN environment variable.');
      return { 
        success: false, 
        message: 'GitHub token is not configured. Your artwork was saved locally but not to the server.'
      };
    }

    if (response.status === 204) {
      // 204 No Content is the expected successful response
      return { success: true, message: 'Artwork submitted successfully. It will be processed soon.' };
    } else {
      const errorData = await response.json();
      throw new Error(`GitHub API Error: ${response.status} - ${JSON.stringify(errorData)}`);
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
