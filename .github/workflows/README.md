# GitHub Workflow Configuration

## Repository Permissions

For the GitHub Actions workflow to successfully push changes to the repository, you need to ensure proper permissions are set:

1. Go to your repository settings on GitHub
2. Navigate to "Settings" > "Actions" > "General"
3. Scroll down to "Workflow permissions"
4. Select "Read and write permissions"
5. Save the changes

This allows the GitHub Actions bot to push changes to your repository.

## Using Personal Access Token (Alternative Method)

If the default `GITHUB_TOKEN` doesn't have sufficient permissions, you can use a Personal Access Token (PAT) instead:

1. Create a new PAT with the `repo` scope at https://github.com/settings/tokens
2. Store this token as a repository secret named `PAT`
3. Update the workflow to use this token:

```yaml
- name: Checkout code
  uses: actions/checkout@v3
  with:
    token: ${{ secrets.PAT }}

# And in the git push step
- name: Commit and push if changes
  run: |
    # ... git commands
    git push
  env:
    GITHUB_TOKEN: ${{ secrets.PAT }}
```

## Troubleshooting

If you continue to experience permission issues:

1. Make sure the branch is not protected or update branch protection rules
2. Verify the GitHub Actions bot has write access to the repository
3. Check if your organization has any restrictions on GitHub Actions
