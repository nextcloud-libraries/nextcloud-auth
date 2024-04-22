# Changelog

All notable changes to this project will be documented in this file.

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
