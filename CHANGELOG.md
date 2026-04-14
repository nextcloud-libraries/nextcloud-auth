<!--
  - SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: GPL-3.0-or-later
-->
# Changelog

All notable changes to this project will be documented in this file.

## 2.6.0 - 2026-04-14
### Added
* feat: add `setRequestToken` and `fetchRequestToken` methods \([\#900](https://github.com/nextcloud-libraries/nextcloud-auth/pull/900)\)

### Changed
* Bump `@nextcloud/event-bus` to 3.3.3
* chore: use correct package metadata \([\#924](https://github.com/nextcloud-libraries/nextcloud-auth/pull/924)\)
* chore: revert ESLint to v9 to fix linter \([\#901](https://github.com/nextcloud-libraries/nextcloud-auth/pull/901)\)
* chore: update Node and NPM dev versions to align with apps \([\#854](https://github.com/nextcloud-libraries/nextcloud-auth/pull/854)\)
* ci: update all workflow templates from organization template repository \([\#918](https://github.com/nextcloud-libraries/nextcloud-auth/pull/918)\)

## 2.5.3 - 2025-10-07
### Changed
* chore(deps): Bump `@nextcloud/browser-storage` to 0.5.0
* chore(deps): various minor/patch upgrades \([#827](https://github.com/nextcloud-libraries/nextcloud-auth/pull/827)\)
* ci: update reuse.yml workflow from template \([#825](https://github.com/nextcloud-libraries/nextcloud-auth/pull/825)\)
* ci: update npm-publish.yml workflow from template \([#826](https://github.com/nextcloud-libraries/nextcloud-auth/pull/826)\)

## 2.5.2 - 2025-07-07
### Fixed
* fix(files_sharing): fallback self.crypto.randomUUID \([#822](https://github.com/nextcloud-libraries/nextcloud-auth/pull/822)\)

### Changed
* chore: fix date in CHANGELOG.md \([#807](https://github.com/nextcloud-libraries/nextcloud-auth/pull/807)\)
* chore: update supported node versions \([#823](https://github.com/nextcloud-libraries/nextcloud-auth/pull/823)\)
* Update development dependencies

## 2.5.1 - 2025-05-13
### Fixed
* fix: listen to guest changes \([\#803](https://github.com/nextcloud-libraries/nextcloud-auth/pull/803)\)

## 2.5.0 - 2025-05-12
### Added
* feat: add guest user \([\#795](https://github.com/nextcloud-libraries/nextcloud-auth/pull/795)\)

### Fixed
* fix: returns `NextcloudUser` instead of `GuestUser` \([\#799](https://github.com/nextcloud-libraries/nextcloud-auth/pull/799)\)

### Changed
* chore: Update workflows \([\#678](https://github.com/nextcloud-libraries/nextcloud-auth/pull/678)\)
* chore(deps): Bump @nextcloud/event-bus from 3.3.1 to 3.3.2
* Updated development dependencies

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
- Current user and CSRF token are now initialized on first usage
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
