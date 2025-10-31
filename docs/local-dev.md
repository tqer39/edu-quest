[🇯🇵 日本語](/docs/local-dev.ja.md)

# Local Development Environments

The repository provides two primary local development modes:

- **Node local (lightweight):** run `apps/api` and `apps/web` locally.
- **Edge SSR (Cloudflare Workers emulation):** run `apps/edge` via Wrangler.

## Initial Setup (required)

**Important:** Complete the following steps before running `make bootstrap`.

### 1. Configure Cloudflare credentials

```shell
# Grant access first
cf-vault add edu-quest
cf-vault list
```

This enables local access to Cloudflare resources.

### 2. Run the Terraform bootstrap

Initialize the AWS resources (IAM roles, etc.).

```shell
just tf -chdir=dev/bootstrap init -reconfigure
just tf -chdir=dev/bootstrap validate
just tf -chdir=dev/bootstrap plan
just tf -chdir=dev/bootstrap apply -auto-approve
```

These commands provision the AWS resources for the development environment.

### 3. Run the Terraform databases stack

Initialize Cloudflare resources (D1, KV, Turnstile, etc.).

**Important:** Wait 5–10 minutes after the bootstrap step to avoid Cloudflare API rate limits.

```shell
just tf -chdir=dev/databases init -reconfigure
just tf -chdir=dev/databases validate
just tf -chdir=dev/databases plan
just tf -chdir=dev/databases apply -auto-approve
```

This provisions the Cloudflare resources for development.

### 4. Optional: provision production Terraform stacks

After the development environment is ready, you can optionally initialize the production resources.

#### 4.1 Bootstrap (AWS resources)

```shell
just tf -chdir=prod/bootstrap init -reconfigure
just tf -chdir=prod/bootstrap validate
just tf -chdir=prod/bootstrap plan
just tf -chdir=prod/bootstrap apply -auto-approve
```

#### 4.2 Databases (Cloudflare resources)

**Important:** Wait 5–10 minutes after the bootstrap step.

```shell
just tf -chdir=prod/databases init -reconfigure
just tf -chdir=prod/databases validate
just tf -chdir=prod/databases plan
just tf -chdir=prod/databases apply -auto-approve
```

Ensure you have the correct permissions and accounts before provisioning production infrastructure.

## Prerequisites

- pnpm is installed (`pnpm --version`).
- Cloudflare Wrangler is installed via mise (`wrangler --version` succeeds after `mise install`).
- Install dependencies on first run: `pnpm install` from the repository root.

## 1) Node local mode (fastest)

- **Recommended:** `just dev-node`
  - API: <http://localhost:8787>
  - Web: <http://localhost:8788>
- **Manual launch:**
  - Terminal A: `pnpm --filter @edu-quest/api run dev`
  - Terminal B: `pnpm --filter @edu-quest/web run dev`
  - The web app expects the API at `http://localhost:8787`; update the client endpoint if you change the port.
- **Smoke tests:**
  - Health check: `curl http://localhost:8787/healthz`
  - Open the web app at <http://localhost:8788>

## 2) Edge SSR (Workers) mode

Wrangler emulates Cloudflare Workers locally, including KV and D1.

- **Start the dev server**

  - `pnpm --filter @edu-quest/edge run dev`
  - or `just dev-edge`
  - Visit the local URL shown by Wrangler.
  - Live reload is enabled in local mode, so the browser refreshes automatically when files change.
  - Wrangler stores debug logs under `apps/edge/.wrangler/logs/` to avoid writing outside the repository.
  - Authentication defaults to a mock user without Better Auth; set `USE_MOCK_USER=false` to disable the mock.

- **Prepare KV namespaces (optional)**

  - `wrangler kv namespace create KV_FREE_TRIAL`
  - `wrangler kv namespace create KV_AUTH_SESSION`
  - `wrangler kv namespace create KV_RATE_LIMIT`
  - `wrangler kv namespace create KV_IDEMPOTENCY`
  - When you run `wrangler dev`, preview namespaces are created automatically, but you can define them explicitly and wire the IDs in `wrangler.toml` if preferred.

- **Prepare D1 (optional)**

  - Create the database: `wrangler d1 create eduquest`
  - Copy the generated `database_id` into the `d1_databases` section of `apps/edge/wrangler.toml`.
  - Apply migrations: `wrangler d1 migrations apply DB --local --config apps/edge/wrangler.toml`
    - `DB` refers to the `binding` name defined in `wrangler.toml`. Using `--config` runs the SQL files under `infra/migrations`.
    - The `--local` flag ensures migrations run against the local SQLite instance, leaving the remote preview untouched.
  - When the schema changes, run `pnpm drizzle:generate` to create SQL files and apply them with the command above.

- **Persist data locally (optional)**
  - Run `wrangler dev --persist` to keep KV/D1 data under the `.wrangler` directory.
  - Wrangler also stores preview data under `~/.wrangler/state/`; delete the directory if you need a clean slate.

## Recommended commands

Run these before opening a PR:

- `just lint`
- `pnpm test` (if the workspace contains tests)
- `pnpm typecheck`

## Frequently Asked Questions (FAQ)

- **Change the ports**
  - API: `PORT=8080 pnpm --filter @edu-quest/api run dev`
  - Update the API base URL in `apps/web/public/main.js` to match the new port.
- **CORS errors**
  - The API already enables CORS; confirm the request origin and URL are correct.
- **pre-commit hook failures**
  - Run `just lint` for details and fix formatting issues or add new words to `cspell.json` as needed.

## Formatting with Prettier

- Format all supported files: `just format`
- Format staged files only: `just format-staged`

The extended Prettier hook covers `js/ts/tsx/json/css/html/md/yaml` files through pre-commit.

## Troubleshooting

### Wrangler cannot authenticate

- Re-run `cf-vault add edu-quest` and confirm credentials with `cf-vault list`.
- Ensure `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are present in the environment.

### D1 migrations fail locally

- Confirm the `database_id` in `wrangler.toml` matches the local database.
- Delete `apps/edge/.wrangler/state/` and rerun the migrations.

### KV namespaces not found

- Run `wrangler kv namespace list` to verify the namespace IDs.
- Update the IDs in `wrangler.toml` if they changed.

## Related documentation

- [GitHub Secrets Setup](./github-secrets-setup.md)
- [Release Workflow](./release-workflow.md)
