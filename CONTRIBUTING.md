# Contributing to Snipkit JavaScript SDK

Welcome to the Snipkit JavaScript SDK! We're excited to have you contribute. This guide will help you get started with the development process.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🛠️ Development Setup

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- Git
- (Optional) Docker (for containerized development)

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/snipkit-js.git
   cd snipkit-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Containerized Development (Recommended)

We recommend using [Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) for a consistent development environment.

We recommend using [Dev
Containers](https://code.visualstudio.com/docs/devcontainers/containers) to
provide a fully configured development environment.

1. Prerequisites
   1. Docker
   2. VS Code or a compatible editor.
   3. [Dev Container
      extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open in Dev Container
   1. Clone the repository
   2. Open the project in VS Code.
   3. When prompted, click "Reopen in Container" or run "Dev Containers: Open
      Folder in Container" command
   4. VS Code will build and start the dev container (this may take a few
      minutes the first time)
3. Ensure you have [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) enabled. We recommend 1Password's [Sign Git commits with SSH](https://developer.1password.com/docs/ssh/git-commit-signing/).

That's it! You're all set to start making changes.

## 🧩 Package Development

### Core Packages

Core packages are located in `/packages/core` and provide the foundation of the SDK. When working on core packages:

- Follow TypeScript best practices
- Write comprehensive tests
- Document public APIs with JSDoc
- Update relevant documentation

### Framework Adapters

Framework adapters are located in `/packages/frameworks`. When creating a new adapter:

1. Use the naming convention `snipkit-{framework}`
2. Follow the structure of existing adapters
3. Include comprehensive tests
4. Add an example application
5. Update documentation

### Utilities

Utility packages in `/packages/utils` should be:
- Focused on a single responsibility
- Well-tested
- Documented
- Framework-agnostic

## 📦 Creating a New Package

1. Create a new directory in the appropriate category (`core`, `frameworks`, `utils`, or `wasm`)
2. Initialize a new package:
   ```bash
   cd packages/{category}
   mkdir snipkit-new-package
   cd snipkit-new-package
   npm init -y
   ```
3. Update the generated `package.json` with proper metadata and scripts
4. Create the necessary source files in `src/`
5. Add tests in `test/`
6. Update the root `package.json` workspaces if needed

## 🔄 Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow the code style (enforced by ESLint)
   - Write tests for new functionality
   - Update documentation

3. **Run tests locally**
   ```bash
   # Run all tests
   npm test
   
   # Test a specific package
   cd packages/core/snipkit
   npm test
   ```

4. **Commit your changes**
   - Use [conventional commits](https://www.conventionalcommits.org/)
   - Sign your commits
   ```bash
   git commit -s -m "feat(package): add new feature"
   ```

5. **Push and create a pull request**
   - Reference any related issues
   - Follow the PR template
   - Request reviews from maintainers

## 🧪 Testing

We use Jest for testing. Follow these guidelines:

- Put test files next to the code they test with `.test.ts` extension
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error conditions

## 📚 Documentation

- Update relevant documentation when making changes
- Add JSDoc comments for public APIs
- Keep examples up to date
- Document breaking changes

## 🚀 Release Process

1. **Versioning**
   - Follow [Semantic Versioning](https://semver.org/)
   - Use `major.minor.patch` format
   - Update `CHANGELOG.md`

2. **Creating a Release**
   - Create a release branch from `main`
   - Update versions and changelog
   - Create a PR for the release
   - After merging, create a GitHub release

## 🆘 Getting Help

If you need help or have questions:

- Check the [documentation](https://docs-snipkit.khulnasoft.com)
- Open an [issue](https://github.com/snipkit/snipkit/issues)
- Join our [community Discord](https://discord.gg/snipkit)

## 🙏 Thank You!

Your contributions make Snipkit better for everyone. Thank you for your time and effort!

## Adapters

New adapters are added to the root of this monorepo in the format of
`snipkit-NAME_OF_ADAPTER` and the package name is `@snipkit/NAME_OF_ADAPTER`.

For example, `snipkit-sveltekit` is the directory for the `@snipkit/sveltekit`
package.

Each new adapter should come with an example application in this repository. See
[Examples](#examples) for guidance on creating an example.

New adapters must also be added to our Release Please configuration files so it
can be included in the next release. The two files that must be updated are
[.release-please-manifest.json](./.github/.release-please-manifest.json) and
[release-please-config.json](./.github/release-please-config.json). We can help
you make changes to these files if you need help.

## 🚀 Examples

Examples should be scaffolded using the scaffolding tool recommended by the framework. Each example should:

1. Be placed in the `/examples` directory
2. Have a descriptive name (e.g., `nextjs-basic`, `sveltekit-with-auth`)
3. Include a README.md with:
   - Description of what the example demonstrates
   - Prerequisites
   - Setup instructions
   - How to run the example
   - Any additional configuration needed

### Creating a New Example

1. **Scaffold the example**
   ```bash
   cd examples
   # Use the framework's CLI to create a new app
   npx create-next-app@latest my-example
   ```

2. **Add Snipkit integration**
   - Follow the framework's integration guide
   - Keep the implementation simple but complete
   - Add clear comments

3. **Add documentation**
   - Create a README.md
   - Document any environment variables needed
   - Include screenshots if helpful

4. **Test the example**
   - Verify it works as expected
   - Test different scenarios
   - Document any known issues

### Example Structure

```
examples/
  nextjs-basic/
    README.md
    package.json
    next.config.js
    # Other framework files
  sveltekit-with-auth/
    README.md
    package.json
    svelte.config.js
    # Other framework files
```

### Testing Examples

Each example should be tested to ensure it works with the latest changes. Add a test script to the root `package.json` to run all examples:

```json
"scripts": {
  "test:examples": "cd examples/nextjs-basic && npm run build && cd ../.. && cd examples/sveltekit-with-auth && npm run build"
}
```

## 🤝 Community

Join our community to ask questions, share ideas, and get help:

- [GitHub Discussions](https://github.com/snipkit/snipkit/discussions)
- [Discord](https://discord.gg/snipkit)
- [Twitter](https://twitter.com/snipkit)

## 📝 License

By contributing to Snipkit, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

---

Thank you for contributing to Snipkit! Your work helps make the web more secure for everyone. 💜

When adding an example, it needs to be added to the
[dependabot.yml](./.github/dependabot.yml) file and the
[reusable-examples.yml](./.github/workflows/reusable-examples.yml) workflow. If
the example does not have a build process to run in CI, it can be excluded from
the workflow file.
