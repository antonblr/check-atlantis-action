# Check Atlantis configuration

[![CI](https://github.com/antonblr/check-atlantis/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/antonblr/check-atlantis/actions/workflows/test.yml?query=branch:main)

A GitHub action to check [Atlantis](https://www.runatlantis.io/) (Terraform Pull Request Automation) configuration file (`atlantis.yaml`) for obsolete projects and projects ordering. Optionally commit the cleanup / sorting results back to PR.

### Usage

```yaml
- uses: actions/checkout@v3
- uses: antonblr/check-atlantis@v0
  with:
    commit-change: 'true'
    sort-by: 'name'
    token: ${{ secrets.GITHUB_TOKEN }}
```


### Action inputs

| Name              | Description                                                                                        | Default                                |
|-------------------|----------------------------------------------------------------------------------------------------|----------------------------------------|
| `atlantis-config` | Path to `atlantis.yaml` file. Can be relative to the project root or abosulte.                     | `./atlantis.yaml` in the projects root |
| `commit-change`   | Commit updated (sorted and cleaned-up) `atlantis.yaml` back to the PR that triggered the workflow. | `false`                                |
| `sort-by`         | Key name to sort atlantis projects by. Valid values are `dir` or `name`.                           | `dir`                                  |
| `token`           | `secrets.GITHUB_TOKEN` or a repo scoped Personal Access Token (PAT).                               |             |
