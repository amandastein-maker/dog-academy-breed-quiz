# GitHub ownership and editing

This package is ready to commit, but it has NOT been pushed to GitHub. GitHub is source control; putting files there alone does not change DA hosting or SEO.

## Repository choice

Use the existing DA application repository when the team maintains site features there. Alternatively use a new **private**, team-owned repository for the tool and copy its built output into the site's release workflow. Do not create a public repository without the team's approval.

Keep the handoff's structure if using the included optional workflow. It expects `native/` at the repository root. For an existing repository, adapt paths to the feature's actual location and preserve existing history/configuration.

## New empty repository: developer commands

Authenticate using the team's normal GitHub/SSH/CLI process. Never paste a token into this document, source code, a remote URL or chat.

```sh
# Run inside the unzipped handoff directory, not a parent repository.
git init -b main
git add .
git commit -m "Add Dog Academy quiz source and native website integration"
# Replace OWNER and REPOSITORY with the exact approved destination.
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Do not use these initialization commands for an existing repository. Instead create a feature branch there, copy the required files, review the diff, then open a pull request through the team's established process. Do not force-push.

## Optional checks

Copy `github-workflow/native-quiz.yml` to `.github/workflows/native-quiz.yml` when approved. It installs locked dependencies, builds and tests on pull requests and pushes to main. It has read-only repository permissions and **does not deploy**. Confirm current dependency/action security requirements before enabling it.

Give Luka and DA's developer access using the repository owner's normal permissions workflow. Connecting a GitHub plugin in ChatGPT does not itself select a repository, grant organization permission or publish these files. Repository access and a destination URL must be confirmed before an assistant can push.

## Future edits

Edit native source, rebuild, run tests, review in a browser on staging, and publish via DA's release process. The original-source snapshot is reference material; do not independently edit both implementations and expect automatic synchronization.
