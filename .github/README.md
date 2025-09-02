# Portfolio GitHub Actions Setup

This documentation explains how the GitHub Actions workflow is set up for the portfolio project to handle artwork submissions.

## Overview

The portfolio uses GitHub Actions to persist artwork data across sessions and users. When a user submits artwork through the form, it:

1. Saves the artwork data to localStorage for immediate display
2. Sends the data to the GitHub repository via the repository_dispatch API
3. A GitHub Actions workflow processes the submission and updates the data.json file
4. The updated data.json is committed back to the repository
5. When other users visit the site, they'll see the latest artwork data

## Files and Components

### 1. GitHub API Client (`src/api/github.js`)

This client handles the communication with GitHub's API to submit artwork data.

```javascript
// Important: You need to set your GitHub Personal Access Token here
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; 
```

### 2. Workflow File (`.github/workflows/process-artwork-submission.yml`)

This GitHub Actions workflow is triggered when the repository receives a `repository_dispatch` event with the type `artwork-submission`. It:

1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Processes the submission using the update script
5. Commits and pushes changes to data.json

### 3. Update Script (`.github/scripts/update-data.js`)

This script:
1. Reads the artwork submission data
2. Reads the existing data.json file
3. Adds the new artwork to the existing data
4. Writes the updated data back to data.json

### 4. AddArtPage Component (`src/AddArtPage.jsx`)

The form component has been updated to:
1. Save artwork data to localStorage for immediate use
2. Submit the data to GitHub via the API client
3. Show loading state during submission

### 5. ArtLayoutPage Component (`src/ArtLayoutPage.jsx`)

The gallery component has been updated to:
1. Try to fetch the latest data.json file first
2. Fall back to localStorage if the fetch fails
3. Fall back to default data if localStorage is empty
4. Show loading state during data fetching

## Setting Up Your GitHub Token

To make the GitHub API integration work, you need to set up a GitHub Personal Access Token. This token is used to authenticate with GitHub's API when submitting artwork.

### For Local Development

1. Go to GitHub > Settings > Developer settings > Personal access tokens > Generate new token
2. Give it a name and select the 'repo' scope
3. Copy the token
4. Create a `.env` file in the root of your project (copy from `.env.example`)
5. Add your token: `VITE_GITHUB_TOKEN=your_token_here`
6. Make sure `.env` is in your `.gitignore` to keep your token private

### For Production (GitHub Pages)

For GitHub Pages deployment, you should use GitHub Secrets to securely store your token:

1. Go to your repository on GitHub
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `VITE_GITHUB_TOKEN`
5. Value: Your GitHub Personal Access Token
6. Click "Add secret"

Then, update your GitHub Pages deployment workflow to include this environment variable:

```yaml
# .github/workflows/deploy.yml
jobs:
  build-and-deploy:
    # ... other configuration ...
    steps:
      # ... other steps ...
      - name: Build
        run: npm run build
        env:
          VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

## Testing the Integration

1. Make sure your repository has the `.github` directory with workflows and scripts
2. Set up your GitHub token in the API client
3. Submit artwork through the form
4. Check that the data.json file is updated in the repository
5. Verify that other users can see the artwork

## Troubleshooting

- If submissions aren't being processed, check your GitHub token permissions
- Ensure the repository_dispatch event is correctly configured
- Check the GitHub Actions logs for any errors
- Verify that the data.json file path in the update script matches your project structure
