[日本語](/docs/github-secrets-setup.ja.md)

# GitHub Secrets Setup Guide

## Overview

This guide explains how to configure the GitHub Secrets that power the production Terraform deployments.

## Required Secrets

Add the following secrets to the GitHub repository.

### GCP

| Secret name                      | Description                                                   | Example                                                                             |
| -------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `GCP_PROJECT_ID`                 | GCP project ID                                                | `portfolio`                                                                         |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | GCP Workload Identity Provider (used for GitHub Actions OIDC) | `projects/123456789/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_SERVICE_ACCOUNT`            | Service account that runs Terraform                           | `terraform@your-project.iam.gserviceaccount.com`                                    |

### Cloudflare

| Secret name             | Description                                             | Example           |
| ----------------------- | ------------------------------------------------------- | ----------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token (requires access to Workers/D1/KV) | `your-api-token`  |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID                                   | `your-account-id` |

### Domain registration contact info

| Secret name                   | Description                       | Example                              |
| ----------------------------- | --------------------------------- | ------------------------------------ |
| `CONTACT_COUNTRY_CODE`        | Country code (ISO 3166-1 alpha-2) | `JP`                                 |
| `CONTACT_POSTAL_CODE`         | Postal code                       | `1234567`                            |
| `CONTACT_ADMINISTRATIVE_AREA` | State / prefecture                | `Tokyo`                              |
| `CONTACT_LOCALITY`            | City                              | `Shibuya`                            |
| `CONTACT_ADDRESS_LINES`       | Street address (comma separated)  | `1-2-3 Example Street,Building Name` |
| `CONTACT_RECIPIENT`           | Recipient name                    | `Your Name`                          |
| `CONTACT_EMAIL`               | Email address                     | `your-email@example.com`             |
| `CONTACT_PHONE`               | Phone number in E.164 format      | `+81.312345678`                      |

### Domain pricing info

| Secret name             | Description                      | Example |
| ----------------------- | -------------------------------- | ------- |
| `YEARLY_PRICE_CURRENCY` | Currency code for the annual fee | `USD`   |
| `YEARLY_PRICE_UNITS`    | Annual price (integer portion)   | `12`    |

**Important:** `yearly_price` values are required when registering a domain through GCP Cloud Domains. Confirm the price beforehand:

1. **Check in the GCP Console**

   ```bash
   gcloud domains registrations search-domains edu-quest.app
   ```

2. **Review the Cloud Domains pricing page**
   - <https://cloud.google.com/domains/pricing>

Terraform will fail during `apply` if these values do not match the actual price.

## How to Add Secrets

1. Open the repository on GitHub.
2. Navigate to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Enter the secret name and value, then click **Add secret**.
5. Repeat until all secrets above are defined.

## Notes and Tips

### Phone numbers

Use the E.164 format when setting `CONTACT_PHONE`.

- Japan: start with `+81.` and drop the leading zero from the area code.
- Example: `03-1234-5678` becomes `+81.312345678`.

### Address formatting

Provide `CONTACT_ADDRESS_LINES` as a comma-separated list when multiple lines are required.

- Example: `1-2-3 Example Street,Building Name`

### Pricing references

The GCP Cloud Domains documentation lists pricing details: <https://cloud.google.com/domains/pricing>

### Configuring GCP Workload Identity

Follow these steps to obtain `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT`.

#### 1. Create the service account

```bash
# Set the project ID
export GCP_PROJECT_ID="your-project-id"

# Create the service account
gcloud iam service-accounts create github-actions-terraform \
  --project="${GCP_PROJECT_ID}" \
  --display-name="GitHub Actions Terraform"

# Capture the service account email (this becomes GCP_SERVICE_ACCOUNT)
export SERVICE_ACCOUNT="github-actions-terraform@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
echo "GCP_SERVICE_ACCOUNT: ${SERVICE_ACCOUNT}"
```

#### 2. Grant permissions to the service account

```bash
# Cloud Domains admin access
gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/domains.admin"

# Service Usage Consumer (required to enable APIs)
gcloud projects add-iam-policy-binding "${GCP_PROJECT_ID}" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/serviceusage.serviceUsageConsumer"
```

#### 3. Create the Workload Identity Pool

```bash
# Create the pool
gcloud iam workload-identity-pools create "github" \
  --project="${GCP_PROJECT_ID}" \
  --location="global" \
  --display-name="GitHub Actions"

# Retrieve the project number
export PROJECT_NUMBER=$(gcloud projects describe "${GCP_PROJECT_ID}" --format="value(projectNumber)")
```

#### 4. Create the Workload Identity Provider

```bash
# Create the provider for GitHub
gcloud iam workload-identity-pools providers create-oidc "github" \
  --project="${GCP_PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner == 'YOUR_GITHUB_USERNAME'" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Capture the provider ID (this becomes GCP_WORKLOAD_IDENTITY_PROVIDER)
export WORKLOAD_IDENTITY_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/providers/github"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER: ${WORKLOAD_IDENTITY_PROVIDER}"
```

**Important:** Replace `YOUR_GITHUB_USERNAME` with the actual GitHub user or organization name.

#### 5. Allow GitHub Actions to use the service account

```bash
# Grant Workload Identity User permissions
gcloud iam service-accounts add-iam-policy-binding "${SERVICE_ACCOUNT}" \
  --project="${GCP_PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_GITHUB_USERNAME/eduquest"
```

**Important:** Replace `YOUR_GITHUB_USERNAME/eduquest` with the actual `<owner>/<repository>` path.

#### 6. Register the values in GitHub Secrets

```bash
# Copy these values into the GitHub Secrets UI
echo "GCP_WORKLOAD_IDENTITY_PROVIDER: ${WORKLOAD_IDENTITY_PROVIDER}"
echo "GCP_SERVICE_ACCOUNT: ${SERVICE_ACCOUNT}"
```

## Running Terraform locally

When running `terraform plan` for `infra/terraform/envs/prod/domain` on your machine, authenticate with GCP first:

```bash
# Select the GCP project
gcloud config set project ${GCP_PROJECT_ID}

# Authenticate with Application Default Credentials
gcloud auth application-default login
```

Then execute Terraform commands:

```bash
cd infra/terraform/envs/prod/domain
terraform init
terraform plan
```

> GitHub Actions uses OIDC authentication, so these manual steps are not required in CI.

## Verification

After saving the secrets, open a PR against `main` to trigger the **Terraform - prod** workflow.

1. Confirm the workflow runs on the PR and posts the `terraform plan` output as a comment.
2. After merging, verify that `terraform apply` completes successfully.

## Troubleshooting

### `terraform.auto.tfvars` generation errors

- Double-check that every secret listed above exists.
- Ensure the secret names have no typos.

### Terraform plan failures

- Confirm the GCP project exists and is reachable.
- Verify the Cloudflare API token has the required permissions.
- Review the contact information fields for correct formatting.

## References

- <https://docs.github.com/en/actions/security-guides/encrypted-secrets>
- <https://cloud.google.com/domains/docs>
- <https://developers.cloudflare.com/fundamentals/api/get-started/create-token/>
