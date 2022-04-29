# @nextcloud/auth

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

For more imformation check [nextcloud.github.io/nextcloud-auth](https://nextcloud.github.io/nextcloud-auth/index.html)
