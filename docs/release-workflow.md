[日本語](/docs/release-workflow.ja.md)

# Release Workflow

This document explains how the EduQuest project manages releases.

## Overview

EduQuest relies on two GitHub Actions workflows:

1. **Create Release** (`.github/workflows/create-release.yml`): creates the GitHub Release.
2. **Terraform - prod** (`.github/workflows/terraform-prod.yml`): deploys to production when a release is published.

## How to Create a Release

### 1. Run the "Create Release" workflow

Trigger the workflow manually from the GitHub Actions UI:

1. Open the **Actions** tab of the repository.
2. Select **Create Release** from the list on the left.
3. Click **Run workflow**.
4. Choose the release type:
   - **major**: breaking changes (e.g., `v1.0.0` → `v2.0.0`)
   - **minor**: backward-compatible feature additions (e.g., `v1.0.0` → `v1.1.0`)
   - **patch**: backward-compatible bug fixes (e.g., `v1.0.0` → `v1.0.1`)
5. Click **Run workflow** to start the job.

### 2. What the workflow does

The Create Release workflow performs the following steps automatically:

1. **Fetch the latest tag:** finds the most recent SemVer tag (`v*.*.*`). Uses `v0.0.0` if no tags exist.
2. **Calculate the next version:** increments the version according to the selected release type.
3. **Generate release notes:**
   - First release: includes the entire commit history.
   - Subsequent releases: includes only commits since the previous tag.
4. **Publish the GitHub Release:** creates the release with the computed version and notes.

### 3. Deploy to production

When the release is created, the workflow triggers **Terraform - prod** via a `repository_dispatch` event:

1. Validate the SemVer tag.
2. Run `terraform plan` to detect infrastructure changes.
3. Run `terraform apply` when differences are found.

**Note:** `.github/workflows/terraform-prod.yml` also runs under these conditions:

- `push` with tags matching `v*.*.*` (deploys automatically).
- `repository_dispatch` with type `release-created` (fired by the Create Release workflow).
- `pull_request` targeting `main` (plan only).
- `workflow_dispatch` (manual trigger).

**Important:** Tags created by the default `GITHUB_TOKEN` do not trigger other workflows. The Create Release workflow therefore fires a `repository_dispatch` event explicitly to start `terraform-prod.yml`.

## Versioning Rules

EduQuest follows [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR:** backward-incompatible API changes.
- **MINOR:** backward-compatible feature additions.
- **PATCH:** backward-compatible bug fixes.

### Version format

- Format: `vMAJOR.MINOR.PATCH`
- Example: `v1.2.3`
- Pre-releases such as `v1.2.3-alpha.1` are currently unsupported.

## Troubleshooting

### Tags are not created

- Inspect the workflow logs for error messages.
- Confirm the GitHub Actions token has `contents: write` permission.

### Release notes are empty

- If there are no commits since the previous release, GitHub displays "No changes since last release".
- Push new commits and rerun the workflow.

### Terraform deployment fails

- Review the **Terraform - prod** workflow logs.
- Ensure infrastructure configuration and GitHub Secrets are correct.
- See `docs/github-secrets-setup.md` for secret configuration details.

## Related Documentation

- [GitHub Secrets Setup](./github-secrets-setup.md)
- [Local Development Environments](./local-dev.md)
