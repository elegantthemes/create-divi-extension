workflow "Code Lint (Syntax)" {
  on = "push"
  resolves = [
    "Lint PHP 5.2",
    "Lint PHP 5.6",
    "Lint PHP 7.3",
    "Lint JavaScript",
    "Check Lint Results",
  ]
}

action "Get Changed Files" {
  uses = "lots0logs/gh-action-get-changed-files@master"
  secrets = ["GITHUB_TOKEN"]
}

action "Lint PHP 5.2" {
  uses = "docker://elegantthemes/gh-action-lint-php:5.2.17"
  needs = ["Get Changed Files"]
}

action "Lint PHP 5.6" {
  uses = "docker://elegantthemes/gh-action-lint-php:5.6.39"
  needs = ["Get Changed Files"]
}

action "Lint PHP 7.3" {
  uses = "docker://elegantthemes/gh-action-lint-php:7.3.0"
  needs = ["Get Changed Files"]
}

action "Lint JavaScript" {
  uses = "docker://elegantthemes/gh-action-lint-js:latest"
  needs = ["Get Changed Files"]
}

action "Check Lint Results" {
  uses = "lots0logs/gh-action-conditional-failure@1.0.0"
  needs = [
    "Lint JavaScript",
    "Lint PHP 5.2",
    "Lint PHP 5.6",
    "Lint PHP 7.3",
  ]
  args = "--file-exists **/lint-failed/*"
  env = {
    success_msg = "Success! No syntax errors found."
    fail_msg = "Syntax errors found!"
  }
}

workflow "Housekeeping (PR)" {
  on = "pull_request"
  resolves = [
    "Maybe Close Issues",
  ]
}

action "Maybe Close Issues" {
  uses = "ldez/gha-mjolnir@v1.0.0"
  secrets = ["GITHUB_TOKEN"]
}

workflow "Housekeeping (push)" {
  on = "push"
  resolves = [
    "Send Webhook",
    "Branch Cleanup",
  ]
}

action "Branch Cleanup" {
  uses = "jessfraz/branch-cleanup-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    NO_BRANCH_DELETED_EXIT_CODE = "0"
  }
}

action "Filter Branch & Repo" {
  uses = "docker://elegantthemes/base:18.04"
  needs = ["Branch Cleanup"]
  runs = ["bash", "-c", "{ [[ ${GITHUB_REPOSITORY} = *'submodule'* ]] && exit 78; } || { [[ ${GITHUB_REF} != 'refs/heads/master' ]] && exit 78; } || exit 0"]
}

action "Send Webhook" {
  uses = "actions/bin/curl@master"
  secrets = ["ETSTAGING_TOKEN"]
  args = "-XPOST -H \"Authorization: Bearer ${ETSTAGING_TOKEN}\" -H \"Accept: application/vnd.github.everest-preview+json\" -H \"Content-Type: application/json\" https://api.github.com/repos/elegantthemes/meta/dispatches --data '{\"event_type\": \"submodule_commit\"}'"
  needs = ["Filter Branch & Repo"]
}

workflow "Slash Commands" {
  on = "issue_comment"
  resolves = ["/merge $branch"]
}

action "/rebase" {
  uses = "cirrus-actions/rebase@master"
  secrets = ["ETSTAGING_TOKEN"]
  runs = ["sh", "-c", "export GITHUB_TOKEN=${ETSTAGING_TOKEN}; /entrypoint.sh"]
}

action "/merge $branch" {
  uses = "lots0logs/gh-action-auto-merge@master"
  needs = ["/rebase"]
  secrets = ["ETSTAGING_TOKEN"]
  runs = "[\"sh\",\"-c\",\"export GITHUB_TOKEN=${ETSTAGING_TOKEN}; /entrypoint.sh\"]"
}
