# @nextcloud/auth

Nextcloud helpers related to authentication and the current user

[![npm](https://img.shields.io/npm/v/@nextcloud/auth.svg)](https://www.npmjs.com/package/@nextcloud/auth)
[![Documentation](https://img.shields.io/badge/Documentation-online-brightgreen)](https://nextcloud.github.io/nextcloud-auth/index.html)

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

For more imformation check [nextcloud.github.io/nextcloud-auth](https://nextcloud.github.io/nextcloud-auth/index.html)
