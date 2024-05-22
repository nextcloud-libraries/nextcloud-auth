<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: GPL-3.0-or-later
-->
# @nextcloud/auth

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-auth)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-auth)
[![npm](https://img.shields.io/npm/v/@nextcloud/auth.svg)](https://www.npmjs.com/package/@nextcloud/auth)
[![Documentation](https://img.shields.io/badge/Documentation-online-brightgreen)](https://nextcloud-libraries.github.io/nextcloud-auth/index.html)

Nextcloud helpers related to authentication and the current user

## Install

```sh
yarn add @nextcloud/auth
```

```sh
npm install @nextcloud/auth --save
```

## Usage

```ts
import {
  getRequestToken,
  getCurrentUser,
  onRequestTokenUpdate,
} from '@nextcloud/auth'

const user = getCurrentUser()

if (user.isAdmin) {
  // do something
}
```

For more imformation check [nextcloud-libraries.github.io/nextcloud-auth](https://nextcloud-libraries.github.io/nextcloud-auth/index.html)
