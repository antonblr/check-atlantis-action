# Check Atlantis configuration

[![CI](https://github.com/antonblr/check-atlantis-action/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/antonblr/check-atlantis-action/actions/workflows/test.yml?query=branch:main)

A GitHub action to check [Atlantis](https://www.runatlantis.io/) (Terraform Pull Request Automation) configuration file (`atlantis.yaml`) for obsolete projects and projects ordering. Optionally commit the cleanup / sorting results back to PR.

### Usage

```yaml
- uses: actions/checkout@v3
  with:
    # https://github.com/actions/checkout/issues/719
    fetch-depth: 0
    ref: ${{ github.event.pull_request.head.ref }}

- uses: antonblr/check-atlantis-action@v0
  with:
    commit-change: 'true'
    sort-by: 'name'
```

### Action inputs

| Name             | Description                                                                                                                                            | Default           |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `atlantis-config` | Path to `atlantis.yaml` file, relative to `$GITHUB_WORKSPACE` (projects' root).                                                                        | `./atlantis.yaml` |
| `commit-change`  | Commit updated (sorted and cleaned-up) `atlantis.yaml` back to the PR that triggered the workflow using the built-in Personal access token (PAT) token | `false`           |
| `sort-by`        | Key name to sort atlantis projects by. Valid values are `dir` or `name`.                                                                               | `dir`             |


### Resources

https://github.com/runatlantis/atlantis
