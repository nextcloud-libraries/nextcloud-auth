<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: GPL-3.0-or-later
-->
# Changelog

All notable changes to this project will be documented in this file.

## 2.5.0 - 2025-05-12
### Added
* feat: add guest user by @skjnldsv in https://github.com/nextcloud-libraries/nextcloud-auth/pull/795

### Fixed
* fix: returns `NextcloudUser` instead of `GuestUser` by @skjnldsv in https://github.com/nextcloud-libraries/nextcloud-auth/pull/799

### Changed
* chore: Update workflows by @susnux in https://github.com/nextcloud-libraries/nextcloud-auth/pull/678
* chore(deps-dev): Bump @nextcloud/eslint-config from 8.4.1 to 8.4.2 by @dependabot
* chore(deps-dev): Bump @nextcloud/vite-config from 2.2.2 to 2.3.5 by @dependabot
* chore(deps-dev): Bump @vitest/coverage-v8 from 2.0.5 to 2.1.8 by @dependabot
* chore(deps-dev): Bump elliptic from 6.5.5 to 6.6.0 by @dependabot
* chore(deps-dev): Bump eslint from 8.57.0 to 8.57.1 by @dependabot
* chore(deps-dev): Bump happy-dom from 14.12.3 to 17.4.4 by @dependabot
* chore(deps-dev): Bump typedoc from 0.26.10 to 0.28.4 by @dependabot
* chore(deps-dev): Bump typescript from 5.5.4 to 5.8.3 by @dependabot
* chore(deps-dev): Bump vite from 5.4.0 to 5.4.10 by @dependabot
* chore(deps): Bump @nextcloud/event-bus from 3.3.1 to 3.3.2 by @dependabot
* chore(deps): Bump rollup from 4.21.0 to 4.22.4 by @dependabot
**Full Changelog**: https://github.com/nextcloud-libraries/nextcloud-auth/compare/v2.4.0...v2.5.0

## 2.4.0 - 2024-08-13
### Added
* feat: Add CSP nonce handling (`getCSPNonce`)
* feat: add guest nickname handling

### Changed
* Add SPDX headers
* docs: Fix link to online docs
* test: Add missing tests for request token
* chore(deps): Bump @nextcloud/event-bus to 3.3.1
* Updated development dependencies

## 2.3.0 - 2024-04-22
### Added
* feat: Use vite for transpiling and vitest for testing

### Changed
* Update NPM version to LTS version 10
* Bump @nextcloud/event-bus from 3.1.0 to 3.2.0
* Updated development dependencies

## 2.2.0 - 2023-09-20
### Added
* Use the original property instead of depending on `OC` API for `isAdmin`

### Changed
* Update node engines to next LTS
* Bump tough-cookie from 4.1.2 to 4.1.3
* Bump semver from 6.3.0 to 6.3.1
* Updated development dependencies

## 2.1.0 - 2023-05-19
### Fixed
- Fixed invalid typings for `NextcloudUser` interface
- Use explicit file extensions for ES module files

### Changed
- Current user and CSRF token are now initilized on first usage
- Dependency updates

## 2.0.0 - 2022-08-11
### Added
- Rollup as bundler
- ESM bundle

### Changed
- Remove core-js
- Remove babel
- Remove unnecessary dev dependencies
- README.md

## 1.3.0 - 2020-06-04
### Added
- isAdmin prop to the user object
### Changed
- Dependency updates

## 1.2.3 - 2020-04-06
### Changed
- Dependency updates
### Fixed
- Update vulnerable packages

## 1.2.2 - 2020-03-19
### Changed
- Dependency updates
### Fixed
- Update vulnerable packages

## 1.2.1 - 2020-01-10
### Fixed
- Bug in @nextcloud/event-bus dependency

## 1.2.0 - 2020-01-07
### Changed
- Updated dependencies
