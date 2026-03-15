Feature: Team Collaboration and Sharing
  As a team that uses AI-assisted development
  I want prompt logs to be shareable across the team via git
  So that we accumulate shared knowledge without relying on any external service

  Background:
    Given the prompt-log skill is installed in a shared git repository
    And the repository has a remote named origin

  # ---------------------------------------------------------------------------
  # Git-native sharing
  # ---------------------------------------------------------------------------

  Scenario: Log entries are committed to version control automatically after writing
    Given push_after_write is not configured
    When the user invokes /prompt-log "implemented rate limiting in the worker"
    Then the skill stages the new entry file with git add
    And it creates a git commit with the message:
      """
      prompt-log: implemented rate limiting in the worker
      """
    And the commit is made on the current branch
    And the user is informed of the commit SHA

  Scenario: Automatic commit uses git identity from the environment
    Given git config user.name is "Alice Smith" and user.email is "alice@example.com"
    When the skill writes and commits an entry
    Then the commit author is Alice Smith <alice@example.com>
    And the skill does not alter the global git config

  Scenario: Log entries are pushed to a shared remote after writing when configured
    Given .prompt-log.yml contains:
      """
      push_after_write: true
      push_remote: origin
      push_branch: ai-log
      """
    When the user invokes /prompt-log "updated CSP policy"
    Then after writing and committing the entry the skill runs "git push origin HEAD:ai-log"
    And the skill reports whether the push succeeded
    And a push failure does not delete the local entry or commit

  Scenario: Entries from multiple authors are merged cleanly
    Given Alice and Bob each write entries on the same day
    When both entries are pushed to the shared branch
    Then there are no merge conflicts because each entry has a unique filename
    And both entries appear in INDEX.md after a git pull and index rebuild

  Scenario: Index file regeneration resolves conflicts after concurrent writes
    Given two team members each wrote an entry and both updated INDEX.md
    When the conflict is detected on git merge or rebase
    Then the user can invoke /prompt-log reindex to regenerate INDEX.md from all entry files
    And the regenerated index contains every entry regardless of the conflict

  # ---------------------------------------------------------------------------
  # Dedicated log branch
  # ---------------------------------------------------------------------------

  Scenario: Log entries can be isolated to a dedicated orphan branch
    Given .prompt-log.yml contains:
      """
      push_branch: ai-log
      orphan_branch: true
      """
    When the skill sets up the log branch for the first time
    Then it creates an orphan branch named ai-log containing only the .prompt-log/ directory
    And no application source code is present on the ai-log branch
    And the ai-log branch can be browsed independently via git checkout ai-log

  Scenario: Entries on a dedicated branch do not appear in the main branch history
    Given log entries are written to the ai-log orphan branch
    When a team member runs git log on the main branch
    Then no prompt-log commits appear in the main branch history
    And the application diff history remains clean

  # ---------------------------------------------------------------------------
  # Sharing across repositories and teams
  # ---------------------------------------------------------------------------

  Scenario: A team can share entries by adding the log branch as a git remote
    Given Team A's log is hosted at git@git.example.com:team-a/logs.git
    When a member of Team B adds that as a remote and fetches the ai-log branch
    Then Team B can read Team A's entries without any shared infrastructure
    And no account or API key is required beyond git read access

  Scenario: The skill supports exporting entries as a tar archive for sharing without git
    When the user invokes /prompt-log export --output team-log-2026-02.tar.gz
    Then the skill creates a gzip-compressed tar archive of all entries in the log directory
    And the archive contains the INDEX.md and all .md entry files
    And the archive can be extracted and read on any machine with standard tools

  # ---------------------------------------------------------------------------
  # Author attribution and identity
  # ---------------------------------------------------------------------------

  Scenario: Each entry clearly records which team member authored it
    Given three team members Alice, Bob, and Carol write entries
    When entries are collected in a shared branch
    Then each entry's frontmatter contains an author field matching that member's git identity
    And the INDEX.md shows the author column for every row

  Scenario: An entry can be attributed to a team or role rather than an individual
    Given .prompt-log.yml contains author: "platform-team"
    When any member of the team writes an entry in this repository
    Then the author field is "platform-team" rather than the individual's git name
    And the individual's git identity is still recorded in the git commit metadata

  Scenario: An entry can be flagged as sensitive and excluded from shared pushes
    When the user invokes /prompt-log "explored unreleased feature approach" --private
    Then the entry is written locally and committed to the current branch
    And the entry frontmatter contains private: true
    And when push_after_write is enabled, the skill skips pushing entries flagged as private
    And the INDEX.md on the shared branch does not list the private entry

  # ---------------------------------------------------------------------------
  # Review workflow
  # ---------------------------------------------------------------------------

  Scenario: A team member can review and annotate an existing entry
    When the user invokes /prompt-log annotate 2026-02-28-added-strict-csp.md
    Then the skill opens the entry and prompts the user to add a comment
    And the comment is appended to a Comments section at the bottom of the entry
    And the comment is prefixed with the annotator's name and the current date
    And the annotation is committed as a separate git commit so the diff is traceable

  Scenario: Entries can be linked to pull requests or issues
    When the user invokes /prompt-log "fixed memory leak" --pr 142 --issue 98
    Then the entry frontmatter contains pull_request: 142 and issue: 98
    And the Summary section includes a generated line: "Related to PR #142, Issue #98"
    And these fields are indexed so /prompt-log search --pr 142 returns the linked entry
