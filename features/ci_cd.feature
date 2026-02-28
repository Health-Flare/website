Feature: CI/CD Pipelines — GitHub Actions and Gitea Actions
  As a maintainer of the HealthFlare website
  I want automated build and deploy pipelines on both GitHub Actions and Gitea Actions
  So that every push to the main branch produces a validated, deployed artefact on both platforms

  # ---------------------------------------------------------------------------
  # Shared pipeline behaviour
  # ---------------------------------------------------------------------------

  Scenario: Pipeline is triggered on push to main
    Given a commit is pushed to the main branch
    When the CI/CD platform detects the push event
    Then a pipeline run is started automatically
    And the run begins within 60 seconds of the push being received

  Scenario: Pipeline is triggered on pull request targeting main
    Given a pull request is opened or synchronised against the main branch
    When the CI/CD platform detects the pull_request event
    Then a pipeline run is started for the pull request head commit
    And the run performs build and lint checks but does not deploy to production

  Scenario: Pipeline fails fast on lint or build error
    Given a commit introduces a syntax error or lint violation
    When the pipeline reaches the lint or build step
    Then the step exits with a non-zero code
    And subsequent steps in the same job do not execute
    And the pipeline is marked as failed
    And a notification or status check is reported back to the repository

  Scenario: Pipeline steps run in an isolated, reproducible environment
    When a pipeline job runs
    Then it uses a pinned container image or runner version specified in the workflow file
    And no state is shared between pipeline runs unless explicitly cached
    And the job produces the same output given the same input regardless of when it runs

  Scenario: Secrets are never echoed to pipeline logs
    Given API tokens and deploy keys are stored as encrypted secrets in the CI/CD platform
    When the pipeline runs and uses a secret
    Then the secret value does not appear in any log line
    And the workflow file does not contain the secret value in plain text

  # ---------------------------------------------------------------------------
  # Build step
  # ---------------------------------------------------------------------------

  Scenario: Build step produces a reproducible static site artefact
    When the build step runs
    Then it installs dependencies from a lockfile without network access to unexpected registries
    And it runs the site build command defined in the project
    And the output directory is created and contains at least one HTML file
    And the build completes without warnings treated as errors

  Scenario: Build artefact is uploaded for use by subsequent jobs
    After the build step completes successfully
    Then the output directory is uploaded as a workflow artefact or passed to a deploy job
    And the artefact is available for download for a minimum of 30 days

  # ---------------------------------------------------------------------------
  # Lint and quality checks
  # ---------------------------------------------------------------------------

  Scenario: HTML is validated during the pipeline
    When the lint step runs
    Then an HTML validator checks all generated HTML files
    And the step fails if any error-level validation issues are found

  Scenario: Accessibility is checked during the pipeline
    When the accessibility check step runs
    Then an automated tool such as axe-cli or pa11y scans the built HTML
    And the step fails if any WCAG 2.2 Level AA violations are found

  Scenario: Links are checked during the pipeline
    When the link-check step runs
    Then all internal links in the built site are verified to resolve to existing files
    And the step fails if any internal link is broken
    And external links are checked against a timeout and reported but do not fail the build

  # ---------------------------------------------------------------------------
  # GitHub Actions — Deploy to GitHub Pages
  # ---------------------------------------------------------------------------

  Scenario: GitHub Actions deploys to GitHub Pages on successful main build
    Given the build and lint steps have passed on the main branch
    When the deploy job runs on GitHub Actions
    Then it uses the actions/deploy-pages action or an equivalent
    And it publishes the build artefact to the gh-pages branch or the configured Pages source
    And the deployment is completed before the workflow run is marked as succeeded

  Scenario: GitHub Actions workflow uses minimal permissions
    When the GitHub Actions workflow file is inspected
    Then the top-level permissions key restricts all permissions to "none" by default
    And only the pages: write and id-token: write permissions are granted to the deploy job
    And no job has write access to repository contents unless explicitly required

  Scenario: GitHub Actions workflow pins all action versions to a full commit SHA
    When the workflow YAML is inspected
    Then every uses: clause references a full 40-character commit SHA
    And no uses: clause references a mutable tag such as @v3 or @latest

  Scenario: GitHub Actions deploy job depends on build job success
    When the workflow is parsed
    Then the deploy job declares a needs: dependency on the build job
    And the deploy job has an environment block specifying the GitHub Pages environment
    And the environment includes a URL pointing to the deployed site

  # ---------------------------------------------------------------------------
  # GitHub Actions — Deploy to Cloudflare Workers
  # ---------------------------------------------------------------------------

  Scenario: GitHub Actions deploys to Cloudflare Workers on successful main build
    Given the build and lint steps have passed on the main branch
    When the Cloudflare deploy job runs on GitHub Actions
    Then it uses the Wrangler CLI with a CLOUDFLARE_API_TOKEN secret
    And it runs "wrangler deploy" or equivalent against the built output directory
    And the deployment URL is output as a step summary or job output

  Scenario: Cloudflare deploy job targets the correct account and project
    When the Wrangler command is executed
    Then the CLOUDFLARE_ACCOUNT_ID is read from an encrypted secret
    And the worker name and routes are read from the wrangler.toml in the repository
    And no account ID or zone ID is hard-coded in the workflow YAML

  # ---------------------------------------------------------------------------
  # Gitea Actions — Deploy to GitHub Pages
  # ---------------------------------------------------------------------------

  Scenario: Gitea Actions workflow is syntactically equivalent to the GitHub Actions workflow
    When both workflow files are compared
    Then the on: triggers are identical
    And the jobs and steps use the same commands and tools
    And differences are limited to platform-specific action names or syntax where unavoidable

  Scenario: Gitea Actions deploys built output to GitHub Pages via API
    Given the build step has produced a valid artefact on Gitea Actions
    When the Gitea deploy job runs
    Then it authenticates to the GitHub API using a repository secret containing a GitHub token
    And it pushes the built output to the gh-pages branch of the GitHub-hosted mirror repository
    And the deployment is confirmed by checking the GitHub Pages deployment status via the API

  Scenario: Gitea Actions uses self-hosted or Gitea-native runners
    When the Gitea workflow file is inspected
    Then the runs-on: value specifies a Gitea-compatible runner label
    And the runner does not require access to GitHub Actions infrastructure

  # ---------------------------------------------------------------------------
  # Gitea Actions — Deploy to Cloudflare Workers
  # ---------------------------------------------------------------------------

  Scenario: Gitea Actions deploys to Cloudflare Workers using Wrangler
    Given the build step has produced a valid artefact on Gitea Actions
    When the Cloudflare deploy step runs in the Gitea workflow
    Then Wrangler is installed from the npm registry or a local cache
    And the CLOUDFLARE_API_TOKEN is read from a Gitea repository secret
    And "wrangler deploy" is executed against the built output directory
    And a non-zero exit code causes the step and job to fail

  # ---------------------------------------------------------------------------
  # Cache and dependency management
  # ---------------------------------------------------------------------------

  Scenario: Dependency installation is cached between pipeline runs
    When the dependency install step runs on a subsequent pipeline run
    Then the cache hit rate is reported in the step logs
    And a cache hit causes dependencies to be restored rather than re-downloaded
    And the cache key includes the dependency lockfile hash to bust the cache on lockfile changes

  Scenario: Build cache is invalidated when source files change
    Given the pipeline has run successfully once
    When a source file is modified and a new pipeline run starts
    Then the build step does not use a stale cached output
    And the new build output reflects the modified source file
