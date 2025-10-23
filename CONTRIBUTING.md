# Contributing to EduQuest

Thank you for your interest in contributing to EduQuest! We welcome pull requests of all sizes, from quick fixes to new features. This guide outlines how to get started and what to expect during the contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Community and Support](#community-and-support)

## Code of Conduct

We are committed to providing a welcoming environment for everyone. Be respectful, inclusive, and supportive in all interactions. Harassment, discrimination, or inappropriate behavior is not tolerated. If you encounter issues, please contact the maintainers so we can help.

## Getting Started

1. **Fork the repository** on GitHub and clone your fork locally.
2. **Install dependencies** using our preferred package manager:

   ```bash
   pnpm install
   ```

3. **Run the setup command** to prepare your environment:

   ```bash
   just setup
   ```

4. **Create a new branch** for your change. Use a descriptive name such as `feature/quest-selector` or `fix/math-typo`.

## Development Workflow

1. Review the [project documentation](./docs/README.md) to familiarize yourself with the architecture and conventions.
2. Make focused changes that address a single issue or feature. Keep commits small and meaningful.
3. Use the provided scripts to aid development:
   - `pnpm dev:edge` to run the main application locally.
   - `pnpm dev:web` for the local web server.
   - `pnpm dev:api` for the local API server.
4. Frequently run quality checks:

   ```bash
   just lint
   ```

5. Stage and commit your changes with clear commit messages that describe what you changed and why.

## Coding Standards

- Follow existing coding patterns and naming conventions in the repository.
- Use TypeScript for new code whenever possible.
- Prefer functional, reusable components and avoid introducing unnecessary dependencies.
- Keep user-facing text accessible and inclusive.
- Update or add unit tests when you modify behavior or add new functionality.

## Testing

Before submitting a pull request, ensure the relevant tests pass:

```bash
just lint
pnpm test
```

If you introduce new features, consider adding or updating tests to cover them.

## Documentation

- Update README files, inline comments, or other documentation when your change affects behavior or developer workflows.
- Keep documentation concise and easy to follow. Include code snippets or commands where helpful.

## Submitting a Pull Request

1. Push your branch to your fork and open a pull request against the `main` branch.
2. Provide a clear title and description summarizing the change and its motivation.
3. Reference related issues or discussions when applicable.
4. Confirm in your PR description that you have run `just lint` and any relevant tests.
5. Be responsive to review feedback. We appreciate collaboration and may request changes before merging.

## Community and Support

- Check existing issues or discussions for context before starting new work.
- If you need help, open a GitHub Discussion or reach out via the preferred channel noted in the repository README.
- We value contributions of all kinds—bug fixes, documentation improvements, feature requests, and community support.

Thank you for helping us build EduQuest!
