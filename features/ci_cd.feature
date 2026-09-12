Feature: CI/CD Pipeline — GitHub Actions
  As a maintainer of the HealthFlare website
  I want automated build, lint, and deploy pipelines on GitHub Actions
  So that every push produces a validated, deployed artefact

  # Cloudflare Workers and Gitea Actions scenarios that previously lived here
  # were removed: neither exists in this repository (GitHub Actions + GitHub
  # Pages is the only pipeline that has ever been built), so testing them
  # would mean faking the result. So were "isolated, reproducible environment"
  # (would require pinning an exact runner OS image, which buys little for a
  # static marketing site) and "build cache is invalidated on change" (not
  # meaningfully distinguishable from the dependency-caching scenario below —
  # both exercise the same `cache: npm` mechanism). Action-SHA-pinning was
  # also removed: verifying it correctly requires knowing each action's real
  # published commit SHA, which isn't something to guess at.

  # ---------------------------------------------------------------------------
  # Shared pipeline behaviour
  # ---------------------------------------------------------------------------

  Scenario: Pipeline is triggered on push to main
    When the workflow files are inspected
    Then a workflow triggers on push to the main branch

  Scenario: Pipeline is triggered on pull request targeting main
    When the workflow files are inspected
    Then the CI workflow triggers on pull requests targeting the main branch
    And the CI workflow only builds and lints, without a deploy step

  Scenario: Pipeline fails fast on lint or build error
    When the workflow files are inspected
    Then no step in the CI workflow sets continue-on-error

  Scenario: Secrets are never echoed to pipeline logs
    When the workflow files are inspected
    Then no workflow file contains a hard-coded secret value

  # ---------------------------------------------------------------------------
  # Build step
  # ---------------------------------------------------------------------------

  Scenario: Build step produces a reproducible static site artefact
    When the build step runs
    Then it installs dependencies from a lockfile
    And the output directory is created and contains at least one HTML file

  Scenario: Build artefact is uploaded for use by subsequent jobs
    When the workflow files are inspected
    Then the deploy workflow uploads the build output as a Pages artefact

  # ---------------------------------------------------------------------------
  # Lint and quality checks
  # ---------------------------------------------------------------------------

  Scenario: HTML is validated during the pipeline
    When the workflow files are inspected
    Then the CI workflow runs an HTML validation step

  Scenario: Accessibility is checked during the pipeline
    When the workflow files are inspected
    Then the CI workflow runs the Cucumber test suite that includes axe-core accessibility scenarios

  Scenario: Internal links resolve to real pages
    When the built site is inspected
    Then every internal link and asset reference resolves to a file that exists in the build output

  # ---------------------------------------------------------------------------
  # Deploy to GitHub Pages
  # ---------------------------------------------------------------------------

  Scenario: GitHub Actions deploys to GitHub Pages on successful main build
    When the workflow files are inspected
    Then the deploy workflow uses actions/deploy-pages
    And the deploy job declares a needs dependency on the build job
    And the deploy job has an environment block naming the GitHub Pages environment

  Scenario: GitHub Actions workflows use minimal permissions
    When the workflow files are inspected
    Then each workflow declares an explicit top-level permissions block
    And the CI workflow does not request write access to repository contents

  # ---------------------------------------------------------------------------
  # Cache and dependency management
  # ---------------------------------------------------------------------------

  Scenario: Dependency installation is cached between pipeline runs
    When the workflow files are inspected
    Then each workflow's Node.js setup step enables npm dependency caching
