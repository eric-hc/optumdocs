# Contributing to *OptumDocs*

## Introduction

### Welcome to OptumDocs!

>Thank you for considering a contribution to *OptumDocs*. Your support of this project will assist the broader open source community as we strive to better document Optum open source communities.

# Contribution Guidelines

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms. Please also review our [Contributor License Agreement ("CLA")](INDIVIDUAL_CONTRIBUTOR_LICENSE.md) prior to submitting changes to the project.  You will need to attest to this agreement following the instructions in the [Paperwork for Pull Requests](#paperwork-for-pull-requests) section below.

---
## How to Contribute

### Requirements
- [Node.js](https://nodejs.org/en/download/) version >= 10.9.0 or above (which can be checked by running node -v). You can use nvm for managing multiple Node versions on a single machine installed
- [Yarn](https://classic.yarnpkg.com/en/) version >= 1.5 (which can be checked by running yarn version). Yarn is a performant package manager for JavaScript and replaces the npm client. It is not strictly necessary but highly encouraged.


1. Clone this repository.
1. Navigate to the ```optumdocs``` folder inside the cloned OptumDocs repo
1. ```yarn install```
1. ```yarn start```
1. Use your local development environment to make and test changes.
1. When ready, submit a PR against the ```gh-pages-source``` branch so your changes can be reviewed.
1. OptumDocs maintainers will build and deploy your changes once accepted.


### Issues

We track our work using Issues in GitHub. Feel free to open up your own issue to point out areas for improvement or to suggest your own new experiment. If you are comfortable with signing the waiver linked above and contributing code or documentation, grab your own issue and start working.

### Pull Requests

If you've gotten as far as reading this section, then thank you for your suggestions.

### Paperwork for Pull Requests

* Please read this guide and make sure you agree with our [Contributor License Agreement ("CLA")](INDIVIDUAL_CONTRIBUTOR_LICENSE.md).
* Make sure git knows your name and email address:
   ```
   $ git config user.name "J. Random User"
   $ git config user.email "j.random.user@example.com"
   ```
>The name and email address must be valid as we cannot accept anonymous contributions.
* Write good commit messages.
> Concise commit messages that describe your changes help us better understand your contributions.
* The first time you open a pull request in this repository, you will see a comment on your PR with a link that will allow you to sign our Contributor License Agreement (CLA) if necessary.
> The link will take you to a page that allows you to view our CLA.  You will need to click the `Sign in with GitHub to agree button` and authorize the cla-assistant application to access the email addresses associated with your GitHub account.  Agreeing to the CLA is also considered to be an attestation that you either wrote or have the rights to contribute the code.  All committers to the PR branch will be required to sign the CLA, but you will only need to sign once.  This CLA applies to all repositories in the Optum org.

### General Guidelines

Ensure your pull request (PR) adheres to the following guidelines:

* Try to make the name concise and descriptive.
* Give a good description of the change being made. Since this is very subjective, see the [Updating Your Pull Request (PR)](#updating-your-pull-request-pr) section below for further details.
* Every pull request should be associated with one or more issues. If no issue exists yet, please create your own.
* Make sure that all applicable issues are mentioned somewhere in the PR description. This can be done by typing # to bring up a list of issues.

#### Updating Your Pull Request (PR)

A lot of times, making a PR adhere to the standards above can be difficult. If the maintainers notice anything that we'd like changed, we'll ask you to edit your PR before we merge it. This applies to both the content documented in the PR and the changed contained within the branch being merged. There's no need to open a new PR. Just edit the existing one.

[email]: mailto:opensource@optum.com
