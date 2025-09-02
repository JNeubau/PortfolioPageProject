# GitHub Workflow Troubleshooting Guide

If your GitHub token is valid but the workflow is not running, this guide will help you diagnose and fix the issue.

## Testing the Workflow Directly

I've created a test utility that can directly test if your GitHub Actions workflow is being triggered properly:

1. Open a terminal and navigate to your project folder
2. Run the test utility:
   ```bash
   node test-workflow.js
   ```
3. Check the console output to see if the repository dispatch event was sent successfully
4. Check your GitHub repository's Actions tab to see if the workflow was triggered

## Common Workflow Issues

### 1. Repository Name/Owner Mismatch

**Symptoms:**
- 404 Not Found error when sending repository dispatch
- No workflow runs even with a valid token

**Solutions:**
- Double-check that the `REPO_OWNER` and `REPO_NAME` in `github.js` match your GitHub repository exactly
- The repository owner should be your GitHub username or organization name
- The repository name should be the exact name of your repository

Current settings in your code:
```javascript
const REPO_OWNER = 'JNeubau';
const REPO_NAME = 'PortfolioPageProject';
```

### 2. Missing Workflow File

**Symptoms:**
- Repository dispatch sends successfully (204 status)
- No workflow runs appear in GitHub Actions tab

**Solutions:**
- Make sure the workflow file exists in the correct location:
  `.github/workflows/process-artwork-submission.yml`
- Check that it's committed to the branch your repository is using
- Verify that the workflow file has the correct trigger:
  ```yml
  on:
    repository_dispatch:
      types: [artwork-submission]
  ```

### 3. Insufficient Permissions

**Symptoms:**
- Repository dispatch fails with 403 Forbidden
- GitHub token works for getting user data but not for repository dispatch
- Workflow runs but fails with "Permission to [repository] denied to github-actions[bot]"
- Error message: "remote: Permission to [...].git denied to github-actions[bot]"

**Solutions:**
- Make sure your token has the `repo` scope (for private repositories) or `public_repo` scope (for public repositories)
- For workflow files, the token also needs the `workflow` scope
- Generate a new token with all required scopes if needed
- For push permission issues:
  1. Go to repository settings on GitHub
  2. Navigate to "Settings" > "Actions" > "General"
  3. Scroll down to "Workflow permissions"
  4. Select "Read and write permissions"
  5. Save the changes
- Explicitly set permissions in the workflow file:
  ```yaml
  jobs:
    update-data:
      runs-on: ubuntu-latest
      permissions:
        contents: write
      steps:
        # ... workflow steps
  ```

### 4. Workflow Syntax Errors

**Symptoms:**
- Workflow file exists but isn't being triggered
- Error messages in GitHub Actions tab

**Solutions:**
- Check the GitHub Actions tab for any syntax errors in your workflow file
- Use the GitHub Actions workflow validator to check your workflow file
- Fix any syntax errors and commit the changes

### 5. ES Modules vs CommonJS Issues

**Symptoms:**
- Workflow is triggered but fails with `require is not defined in ES module scope` error
- Error mentions `"type": "module"` in package.json

**Solutions:**
- Your project is configured to use ES modules, but some scripts are using CommonJS
- Update your scripts to use ES modules syntax:
  - Change `const fs = require('fs')` to `import fs from 'fs'`
  - Change `const path = require('path')` to `import path from 'path'`
  - Use `import { fileURLToPath } from 'url'` and `const __dirname = path.dirname(fileURLToPath(import.meta.url))` for __dirname
- Or run Node.js with the `--experimental-modules` flag in your workflow

## Verifying the Repository Dispatch

You can also manually verify that the repository dispatch API is working using curl:

```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/JNeubau/PortfolioPageProject/dispatches \
  -d '{"event_type":"artwork-submission","client_payload":{"test":true}}'
```

If this command returns no output with a 204 status, the repository dispatch was sent successfully.

## After Fixing the Issue

Once you've identified and fixed the issue:

1. Try submitting artwork through your application again
2. Check the GitHub Actions tab to see if the workflow runs
3. Verify that the data.json file is updated with the new artwork
4. Check that the artwork appears in your application for all users

## Verifying the Repository Dispatch

You can also manually verify that the repository dispatch API is working using curl:

```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/JNeubau/PortfolioPageProject/dispatches \
  -d '{"event_type":"artwork-submission","client_payload":{"test":true}}'
```

If this command returns no output with a 204 status, the repository dispatch was sent successfully.

## After Fixing the Issue

Once you've identified and fixed the issue:

1. Try submitting artwork through your application again
2. Check the GitHub Actions tab to see if the workflow runs
3. Verify that the data.json file is updated with the new artwork
4. Check that the artwork appears in your application for all users
