# Changelog

## [1.0.0-beta.7](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.6...@snipkit/node-v1.0.0-beta.7) (2025-05-06)


### 🪲 Bug Fixes

* **snipkit-node:** Ensure `process.env.RENDER` is surfaced ([#3969](https://github.com/snipkit/snipkit/issues/3969)) ([18f7383](https://github.com/snipkit/snipkit/commit/18f7383f672eee31fbc42bdc2db4b46a60a19e87)), closes [#3899](https://github.com/snipkit/snipkit/issues/3899)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/headers bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/ip bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/logger bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/protocol bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/transport bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/body bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * snipkit bumped from 1.0.0-beta.6 to 1.0.0-beta.7
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/rollup-config bumped from 1.0.0-beta.6 to 1.0.0-beta.7
    * @snipkit/tsconfig bumped from 1.0.0-beta.6 to 1.0.0-beta.7

## [1.0.0-beta.6](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.5...@snipkit/node-v1.0.0-beta.6) (2025-04-17)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/headers bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/ip bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/logger bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/protocol bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/transport bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/body bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * snipkit bumped from 1.0.0-beta.5 to 1.0.0-beta.6
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/rollup-config bumped from 1.0.0-beta.5 to 1.0.0-beta.6
    * @snipkit/tsconfig bumped from 1.0.0-beta.5 to 1.0.0-beta.6

## [1.0.0-beta.5](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.4...@snipkit/node-v1.0.0-beta.5) (2025-03-27)


### 🚀 New Features

* Support CIDR strings as proxies ([#3577](https://github.com/snipkit/snipkit/issues/3577)) ([2964ca7](https://github.com/snipkit/snipkit/commit/2964ca7ce02ee35dca14043fd90ad942b0f1cd73)), closes [#2402](https://github.com/snipkit/snipkit/issues/2402)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/headers bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/ip bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/logger bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/protocol bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/transport bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/body bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * snipkit bumped from 1.0.0-beta.4 to 1.0.0-beta.5
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/rollup-config bumped from 1.0.0-beta.4 to 1.0.0-beta.5
    * @snipkit/tsconfig bumped from 1.0.0-beta.4 to 1.0.0-beta.5

## [1.0.0-beta.4](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.3...@snipkit/node-v1.0.0-beta.4) (2025-03-14)


### ⚠ BREAKING CHANGES

* Upgrade packages to eslint 9 ([#3531](https://github.com/snipkit/snipkit/issues/3531))

### deps

* Upgrade packages to eslint 9 ([#3531](https://github.com/snipkit/snipkit/issues/3531)) ([84826b5](https://github.com/snipkit/snipkit/commit/84826b51f0c7925ede7a889499bed3a188e48e65)), closes [#539](https://github.com/snipkit/snipkit/issues/539)


### 🪲 Bug Fixes

* **snipkit-node:** Wrap `process.env` access with a getter object ([#3559](https://github.com/snipkit/snipkit/issues/3559)) ([134588b](https://github.com/snipkit/snipkit/commit/134588bc4e91aaa0086d53044249abd1a1aef1bb))


### 🧹 Miscellaneous Chores

* Only log development mode IP address warning once ([#3527](https://github.com/snipkit/snipkit/issues/3527)) ([36e0596](https://github.com/snipkit/snipkit/commit/36e0596332341d923dbeb755e2a8c26fd8d28e7c)), closes [#1781](https://github.com/snipkit/snipkit/issues/1781)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/headers bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/ip bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/logger bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/protocol bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/transport bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/body bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * snipkit bumped from 1.0.0-beta.3 to 1.0.0-beta.4
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/rollup-config bumped from 1.0.0-beta.3 to 1.0.0-beta.4
    * @snipkit/tsconfig bumped from 1.0.0-beta.3 to 1.0.0-beta.4

## [1.0.0-beta.3](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.2...@snipkit/node-v1.0.0-beta.3) (2025-03-05)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/headers bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/ip bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/logger bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/protocol bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/transport bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/body bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * snipkit bumped from 1.0.0-beta.2 to 1.0.0-beta.3
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/rollup-config bumped from 1.0.0-beta.2 to 1.0.0-beta.3
    * @snipkit/tsconfig bumped from 1.0.0-beta.2 to 1.0.0-beta.3

## [1.0.0-beta.2](https://github.com/snipkit/snipkit/compare/v1.0.0-beta.1...@snipkit/node-v1.0.0-beta.2) (2025-02-04)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/headers bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/ip bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/logger bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/protocol bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/transport bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/body bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * snipkit bumped from 1.0.0-beta.1 to 1.0.0-beta.2
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/rollup-config bumped from 1.0.0-beta.1 to 1.0.0-beta.2
    * @snipkit/tsconfig bumped from 1.0.0-beta.1 to 1.0.0-beta.2

## [1.0.0-beta.1](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.34...@snipkit/node-v1.0.0-beta.1) (2025-01-15)


### 🧹 Miscellaneous Chores

* Switch most test harnesses to node:test ([#2479](https://github.com/snipkit/snipkit/issues/2479)) ([8a71bbc](https://github.com/snipkit/snipkit/commit/8a71bbc3d1fa6b63586f1bae7fa6f0f8d4fbad66))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/headers bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/ip bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/logger bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/protocol bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/transport bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/body bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * snipkit bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/rollup-config bumped from 1.0.0-alpha.34 to 1.0.0-beta.1
    * @snipkit/tsconfig bumped from 1.0.0-alpha.34 to 1.0.0-beta.1

## [1.0.0-alpha.34](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.33...@snipkit/node-v1.0.0-alpha.34) (2024-12-03)


### 🚀 New Features

* Support trusted proxy configuration on each adapter ([#2394](https://github.com/snipkit/snipkit/issues/2394)) ([f9587d8](https://github.com/snipkit/snipkit/commit/f9587d8ec6bd0327cb34ac19e52aeecbf6b79cf3)), closes [#2346](https://github.com/snipkit/snipkit/issues/2346)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/headers bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/ip bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/logger bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/protocol bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/transport bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/body bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * snipkit bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/rollup-config bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34
    * @snipkit/tsconfig bumped from 1.0.0-alpha.33 to 1.0.0-alpha.34

## [1.0.0-alpha.33](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.32...@snipkit/node-v1.0.0-alpha.33) (2024-11-29)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/headers bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/ip bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/logger bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/protocol bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/transport bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/body bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * snipkit bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/rollup-config bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33
    * @snipkit/tsconfig bumped from 1.0.0-alpha.32 to 1.0.0-alpha.33

## [1.0.0-alpha.32](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.31...@snipkit/node-v1.0.0-alpha.32) (2024-11-26)


### ⚠ BREAKING CHANGES

* Stop publishing TypeScript source files ([#2326](https://github.com/snipkit/snipkit/issues/2326))

### 🪲 Bug Fixes

* Stop publishing TypeScript source files ([#2326](https://github.com/snipkit/snipkit/issues/2326)) ([f8f6a2d](https://github.com/snipkit/snipkit/commit/f8f6a2d998220d9705ecda8f10d3c5e14b47cad6)), closes [#1836](https://github.com/snipkit/snipkit/issues/1836)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/headers bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/ip bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/logger bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/protocol bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/transport bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/body bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * snipkit bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/rollup-config bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32
    * @snipkit/tsconfig bumped from 1.0.0-alpha.31 to 1.0.0-alpha.32

## [1.0.0-alpha.31](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.30...@snipkit/node-v1.0.0-alpha.31) (2024-11-22)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/headers bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/ip bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/logger bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/protocol bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/transport bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/body bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * snipkit bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/rollup-config bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31
    * @snipkit/tsconfig bumped from 1.0.0-alpha.30 to 1.0.0-alpha.31

## [1.0.0-alpha.30](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.29...@snipkit/node-v1.0.0-alpha.30) (2024-11-20)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/headers bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/ip bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/logger bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/protocol bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/transport bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/body bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * snipkit bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/rollup-config bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30
    * @snipkit/tsconfig bumped from 1.0.0-alpha.29 to 1.0.0-alpha.30

## [1.0.0-alpha.29](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.28...@snipkit/node-v1.0.0-alpha.29) (2024-11-19)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/headers bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/ip bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/logger bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/protocol bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/transport bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/body bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * snipkit bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/rollup-config bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29
    * @snipkit/tsconfig bumped from 1.0.0-alpha.28 to 1.0.0-alpha.29

## [1.0.0-alpha.28](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.27...@snipkit/node-v1.0.0-alpha.28) (2024-10-23)


### ⚠ BREAKING CHANGES

* **ip:** Accept Request or IncomingMessage directly ([#2018](https://github.com/snipkit/snipkit/issues/2018))

### 🚀 New Features

* **ip:** Accept Request or IncomingMessage directly ([#2018](https://github.com/snipkit/snipkit/issues/2018)) ([1704da8](https://github.com/snipkit/snipkit/commit/1704da87a6791c824cc5ddf6b10a11d5e0786a39)), closes [#1904](https://github.com/snipkit/snipkit/issues/1904)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/headers bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/ip bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/logger bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/protocol bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/transport bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/body bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * snipkit bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/rollup-config bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28
    * @snipkit/tsconfig bumped from 1.0.0-alpha.27 to 1.0.0-alpha.28

## [1.0.0-alpha.27](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.26...@snipkit/node-v1.0.0-alpha.27) (2024-10-01)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/headers bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/ip bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/logger bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/protocol bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/transport bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/body bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * snipkit bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/rollup-config bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27
    * @snipkit/tsconfig bumped from 1.0.0-alpha.26 to 1.0.0-alpha.27

## [1.0.0-alpha.26](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.25...@snipkit/node-v1.0.0-alpha.26) (2024-09-16)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/headers bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/ip bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/logger bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/protocol bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/transport bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/body bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * snipkit bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/rollup-config bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26
    * @snipkit/tsconfig bumped from 1.0.0-alpha.25 to 1.0.0-alpha.26

## [1.0.0-alpha.25](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.24...@snipkit/node-v1.0.0-alpha.25) (2024-09-10)


### 🧹 Miscellaneous Chores

* Update READMEs with latest examples ([#1542](https://github.com/snipkit/snipkit/issues/1542)) ([8969486](https://github.com/snipkit/snipkit/commit/8969486cc01dac6fc01289672744744913eaab01))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/headers bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/ip bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/logger bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/protocol bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/transport bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/body bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * snipkit bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/rollup-config bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25
    * @snipkit/tsconfig bumped from 1.0.0-alpha.24 to 1.0.0-alpha.25

## [1.0.0-alpha.24](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.23...@snipkit/node-v1.0.0-alpha.24) (2024-09-05)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/headers bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/ip bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/logger bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/protocol bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/transport bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/body bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * snipkit bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/rollup-config bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24
    * @snipkit/tsconfig bumped from 1.0.0-alpha.23 to 1.0.0-alpha.24

## [1.0.0-alpha.23](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.22...@snipkit/node-v1.0.0-alpha.23) (2024-09-02)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/headers bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/ip bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/logger bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/protocol bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/transport bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/body bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * snipkit bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/rollup-config bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23
    * @snipkit/tsconfig bumped from 1.0.0-alpha.22 to 1.0.0-alpha.23

## [1.0.0-alpha.22](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.21...@snipkit/node-v1.0.0-alpha.22) (2024-08-26)


### 🚀 New Features

* add detect sensitive info rule ([#1300](https://github.com/snipkit/snipkit/issues/1300)) ([006e344](https://github.com/snipkit/snipkit/commit/006e34449a1af0768fe2c265c40161e0ecf90d82))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/headers bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/ip bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/logger bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/protocol bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/transport bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/body bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * snipkit bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/rollup-config bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22
    * @snipkit/tsconfig bumped from 1.0.0-alpha.21 to 1.0.0-alpha.22

## [1.0.0-alpha.21](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.20...@snipkit/node-v1.0.0-alpha.21) (2024-08-05)


### 🚀 New Features

* Abstract transports into package to leverage conditional exports ([#1221](https://github.com/snipkit/snipkit/issues/1221)) ([27776f7](https://github.com/snipkit/snipkit/commit/27776f742ef94212ac4164d3feb21b5b5f1681db))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/headers bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/ip bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/logger bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/protocol bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/transport bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * snipkit bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/rollup-config bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21
    * @snipkit/tsconfig bumped from 1.0.0-alpha.20 to 1.0.0-alpha.21

## [1.0.0-alpha.20](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.19...@snipkit/node-v1.0.0-alpha.20) (2024-07-24)


### 📦 Dependencies

* **dev:** bump @rollup/wasm-node from 4.18.1 to 4.19.0 ([#1160](https://github.com/snipkit/snipkit/issues/1160)) ([7062ca0](https://github.com/snipkit/snipkit/commit/7062ca00012dd73b2e80f0679609be6e45ec5f5d))
* **dev:** bump typescript from 5.5.3 to 5.5.4 ([#1166](https://github.com/snipkit/snipkit/issues/1166)) ([644e3a6](https://github.com/snipkit/snipkit/commit/644e3a6e69d092626fdf4f356aaa8e8f974ae46b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/headers bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/ip bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/logger bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/protocol bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * snipkit bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/rollup-config bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20
    * @snipkit/tsconfig bumped from 1.0.0-alpha.19 to 1.0.0-alpha.20

## [1.0.0-alpha.19](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.18...@snipkit/node-v1.0.0-alpha.19) (2024-07-15)


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.18.0 to 4.18.1 ([#1092](https://github.com/snipkit/snipkit/issues/1092)) ([ffc298a](https://github.com/snipkit/snipkit/commit/ffc298ad030721519af02c6c2da26fd2bd3fbdbd))
* **dev:** Bump typescript from 5.5.2 to 5.5.3 ([#1065](https://github.com/snipkit/snipkit/issues/1065)) ([ef05395](https://github.com/snipkit/snipkit/commit/ef053953cf4a6cba621b778cba2e0dd4e114b626))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/headers bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/ip bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/logger bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/protocol bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * snipkit bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/rollup-config bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19
    * @snipkit/tsconfig bumped from 1.0.0-alpha.18 to 1.0.0-alpha.19

## [1.0.0-alpha.18](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.17...@snipkit/node-v1.0.0-alpha.18) (2024-07-01)


### 🪲 Bug Fixes

* **env:** Always rely on isDevelopment & remove isProduction helper ([#998](https://github.com/snipkit/snipkit/issues/998)) ([43423c6](https://github.com/snipkit/snipkit/commit/43423c650cb5b6f2e992af961faad52a4fcdd24f))
* **sdk:** Inform type signature of protect via global characteristics ([#1043](https://github.com/snipkit/snipkit/issues/1043)) ([1ae4a89](https://github.com/snipkit/snipkit/commit/1ae4a89637c02dffd7801becdf519ce4f911dc6d)), closes [#1042](https://github.com/snipkit/snipkit/issues/1042)


### 📦 Dependencies

* **dev:** Bump typescript from 5.4.5 to 5.5.2 ([#1011](https://github.com/snipkit/snipkit/issues/1011)) ([c17a101](https://github.com/snipkit/snipkit/commit/c17a101c5729db44ddf8a7e14d5e4184dcf38949))


### 🧹 Miscellaneous Chores

* Warn when IP is empty, even if we override it in development ([#1000](https://github.com/snipkit/snipkit/issues/1000)) ([da14bcb](https://github.com/snipkit/snipkit/commit/da14bcb67f3bd5ffff9cc17bdbac4d2217a1bf36)), closes [#987](https://github.com/snipkit/snipkit/issues/987) [#216](https://github.com/snipkit/snipkit/issues/216)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/headers bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/ip bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/logger bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/protocol bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * snipkit bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/rollup-config bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18
    * @snipkit/tsconfig bumped from 1.0.0-alpha.17 to 1.0.0-alpha.18

## [1.0.0-alpha.17](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.16...@snipkit/node-v1.0.0-alpha.17) (2024-06-17)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/headers bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/ip bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/logger bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/protocol bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * snipkit bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/rollup-config bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17
    * @snipkit/tsconfig bumped from 1.0.0-alpha.16 to 1.0.0-alpha.17

## [1.0.0-alpha.16](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.15...@snipkit/node-v1.0.0-alpha.16) (2024-06-14)


### 🧹 Miscellaneous Chores

* **@snipkit/node:** Synchronize snipkit-js versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/headers bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/ip bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/logger bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/protocol bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * snipkit bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/rollup-config bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16
    * @snipkit/tsconfig bumped from 1.0.0-alpha.15 to 1.0.0-alpha.16

## [1.0.0-alpha.15](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.14...@snipkit/node-v1.0.0-alpha.15) (2024-06-12)


### ⚠ BREAKING CHANGES

* Move client into protocol and rename builders in adapters ([#932](https://github.com/snipkit/snipkit/issues/932))

### 🧹 Miscellaneous Chores

* Move client into protocol and rename builders in adapters ([#932](https://github.com/snipkit/snipkit/issues/932)) ([ea1c2b2](https://github.com/snipkit/snipkit/commit/ea1c2b25d146be10056cbc616180abeac75f9a01))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/headers bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/ip bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/logger bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/protocol bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * snipkit bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/rollup-config bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15
    * @snipkit/tsconfig bumped from 1.0.0-alpha.14 to 1.0.0-alpha.15

## [1.0.0-alpha.14](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.13...@snipkit/node-v1.0.0-alpha.14) (2024-06-10)


### ⚠ BREAKING CHANGES

* Move all environment lookup into separate package ([#897](https://github.com/snipkit/snipkit/issues/897))
* **ip:** Allow platform to be specified when looking up IP ([#896](https://github.com/snipkit/snipkit/issues/896))
* Add fallback IP in each adapter ([#895](https://github.com/snipkit/snipkit/issues/895))
* Create runtime package and remove from SDK ([#871](https://github.com/snipkit/snipkit/issues/871))
* Allow SnipkitContext extension via new argument to core `protect()` ([#841](https://github.com/snipkit/snipkit/issues/841))
* Separate `@snipkit/headers` package from core ([#824](https://github.com/snipkit/snipkit/issues/824))

### 🚀 New Features

* Add fallback IP in each adapter ([#895](https://github.com/snipkit/snipkit/issues/895)) ([0f23cff](https://github.com/snipkit/snipkit/commit/0f23cff62214462504a21b84e00b258721e31ead)), closes [#51](https://github.com/snipkit/snipkit/issues/51) [#885](https://github.com/snipkit/snipkit/issues/885)
* Allow SnipkitContext extension via new argument to core `protect()` ([#841](https://github.com/snipkit/snipkit/issues/841)) ([96bbe94](https://github.com/snipkit/snipkit/commit/96bbe941b2f1613bc870e8f6073db919c1f41a7e))
* Create runtime package and remove from SDK ([#871](https://github.com/snipkit/snipkit/issues/871)) ([4e9e216](https://github.com/snipkit/snipkit/commit/4e9e2169e587ab010ff587a915ae8e1416c9b8f5))
* **ip:** Allow platform to be specified when looking up IP ([#896](https://github.com/snipkit/snipkit/issues/896)) ([c9f54bb](https://github.com/snipkit/snipkit/commit/c9f54bbe0561b13dbb2dbc6f58087a1b25218504))
* Move all environment lookup into separate package ([#897](https://github.com/snipkit/snipkit/issues/897)) ([a5bb8ca](https://github.com/snipkit/snipkit/commit/a5bb8ca6bad9d831b3f67f12b3ef87048ced25bb))
* Separate `@snipkit/headers` package from core ([#824](https://github.com/snipkit/snipkit/issues/824)) ([c8364f4](https://github.com/snipkit/snipkit/commit/c8364f464b99b5b66749ea776e29c728257a2d74))


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.17.2 to 4.18.0 ([#803](https://github.com/snipkit/snipkit/issues/803)) ([e6321af](https://github.com/snipkit/snipkit/commit/e6321afbad7127442d78b9c760c0e4c1ef73a77c))


### 📝 Documentation

* Add quick start links & update Bun example ([#870](https://github.com/snipkit/snipkit/issues/870)) ([ee3079f](https://github.com/snipkit/snipkit/commit/ee3079f21484ed3b5cf67ae03a45cb9d07b3d911))
* Remove wording that implies is Shield is added by default ([#796](https://github.com/snipkit/snipkit/issues/796)) ([a85d18c](https://github.com/snipkit/snipkit/commit/a85d18ca6f6da589cfad58d3167b1c8a4b1edc55))


### 🧹 Miscellaneous Chores

* **docs:** Add live example app to READMEs ([#823](https://github.com/snipkit/snipkit/issues/823)) ([8b1c811](https://github.com/snipkit/snipkit/commit/8b1c81188b0035cfde810917239ea584e6ce3b3d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/env bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * @snipkit/headers bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * @snipkit/ip bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * @snipkit/logger bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * snipkit bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * @snipkit/rollup-config bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14
    * @snipkit/tsconfig bumped from 1.0.0-alpha.13 to 1.0.0-alpha.14

## [1.0.0-alpha.13](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.12...@snipkit/node-v1.0.0-alpha.13) (2024-05-20)


### 🚀 New Features

* Filter cookie headers when normalizing with SnipkitHeaders ([#773](https://github.com/snipkit/snipkit/issues/773)) ([99b3e1f](https://github.com/snipkit/snipkit/commit/99b3e1fd1f104824642817e2f22bc78d308e2fb1))


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.14.3 to 4.17.2 ([#708](https://github.com/snipkit/snipkit/issues/708)) ([6e548bf](https://github.com/snipkit/snipkit/commit/6e548bf30743d06615dc9a0b46b3cbdabd6a89e4))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/ip bumped from 1.0.0-alpha.12 to 1.0.0-alpha.13
    * snipkit bumped from 1.0.0-alpha.12 to 1.0.0-alpha.13
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.12 to 1.0.0-alpha.13
    * @snipkit/rollup-config bumped from 1.0.0-alpha.12 to 1.0.0-alpha.13
    * @snipkit/tsconfig bumped from 1.0.0-alpha.12 to 1.0.0-alpha.13

## [1.0.0-alpha.12](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.11...@snipkit/node-v1.0.0-alpha.12) (2024-04-18)


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.14.1 to 4.14.3 ([#597](https://github.com/snipkit/snipkit/issues/597)) ([598adf0](https://github.com/snipkit/snipkit/commit/598adf0b3d61b9e9bce046c7c3e8ddef2802a37c))
* **dev:** Bump typescript from 5.4.4 to 5.4.5 ([#557](https://github.com/snipkit/snipkit/issues/557)) ([16af391](https://github.com/snipkit/snipkit/commit/16af3914d66f05eb3b0d79a9623d2c5ade52bddd))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/ip bumped from 1.0.0-alpha.11 to 1.0.0-alpha.12
    * snipkit bumped from 1.0.0-alpha.11 to 1.0.0-alpha.12
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.11 to 1.0.0-alpha.12
    * @snipkit/rollup-config bumped from 1.0.0-alpha.11 to 1.0.0-alpha.12
    * @snipkit/tsconfig bumped from 1.0.0-alpha.11 to 1.0.0-alpha.12

## [1.0.0-alpha.11](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.10...@snipkit/node-v1.0.0-alpha.11) (2024-04-08)


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.13.0 to 4.13.2 ([#472](https://github.com/snipkit/snipkit/issues/472)) ([0268e51](https://github.com/snipkit/snipkit/commit/0268e51eb8967b2379014c1d16c65d1fbca13186))
* **dev:** Bump @rollup/wasm-node from 4.13.2 to 4.14.0 ([#493](https://github.com/snipkit/snipkit/issues/493)) ([ac14f3f](https://github.com/snipkit/snipkit/commit/ac14f3fb12157f9b2306ce2e703f80c081dcd9bc))
* **dev:** Bump @rollup/wasm-node from 4.14.0 to 4.14.1 ([#519](https://github.com/snipkit/snipkit/issues/519)) ([f859c0e](https://github.com/snipkit/snipkit/commit/f859c0eb071fcd83c68c8c94b60071217a600b3a))
* **dev:** Bump typescript from 5.4.2 to 5.4.3 ([#412](https://github.com/snipkit/snipkit/issues/412)) ([a69b76b](https://github.com/snipkit/snipkit/commit/a69b76b011a58bad21dc0763661927003c6b2a2e))
* **dev:** Bump typescript from 5.4.3 to 5.4.4 ([#509](https://github.com/snipkit/snipkit/issues/509)) ([8976fb1](https://github.com/snipkit/snipkit/commit/8976fb1b49f06b50b2a1d52b8a4619548993c737))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/ip bumped from 1.0.0-alpha.10 to 1.0.0-alpha.11
    * snipkit bumped from 1.0.0-alpha.10 to 1.0.0-alpha.11
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.10 to 1.0.0-alpha.11
    * @snipkit/rollup-config bumped from 1.0.0-alpha.10 to 1.0.0-alpha.11
    * @snipkit/tsconfig bumped from 1.0.0-alpha.10 to 1.0.0-alpha.11

## [1.0.0-alpha.10](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.9...@snipkit/node-v1.0.0-alpha.10) (2024-03-13)


### 📦 Dependencies

* **dev:** Bump @rollup/wasm-node from 4.12.0 to 4.12.1 ([#320](https://github.com/snipkit/snipkit/issues/320)) ([7f07a8f](https://github.com/snipkit/snipkit/commit/7f07a8f78e2f2bf67ab0eba032eeb311704c4eee))
* **dev:** Bump @rollup/wasm-node from 4.12.1 to 4.13.0 ([#359](https://github.com/snipkit/snipkit/issues/359)) ([8658316](https://github.com/snipkit/snipkit/commit/8658316b252f9224069d5c11b8fc6acb6681c90e))
* **dev:** Bump typescript from 5.3.3 to 5.4.2 ([#321](https://github.com/snipkit/snipkit/issues/321)) ([e0c2914](https://github.com/snipkit/snipkit/commit/e0c2914ab868d4a3e571c959f4b00284bbbc3050))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/ip bumped from 1.0.0-alpha.9 to 1.0.0-alpha.10
    * snipkit bumped from 1.0.0-alpha.9 to 1.0.0-alpha.10
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.9 to 1.0.0-alpha.10
    * @snipkit/rollup-config bumped from 1.0.0-alpha.9 to 1.0.0-alpha.10
    * @snipkit/tsconfig bumped from 1.0.0-alpha.9 to 1.0.0-alpha.10

## [1.0.0-alpha.9](https://github.com/snipkit/snipkit/compare/v1.0.0-alpha.8...@snipkit/node-v1.0.0-alpha.9) (2024-03-04)


### 🚀 New Features

* Implement initial nodejs SDK ([#268](https://github.com/snipkit/snipkit/issues/268)) ([6273296](https://github.com/snipkit/snipkit/commit/627329633c1a4eb764cdb2ef61bcd58ce1cd016b))


### 📝 Documentation

* Add node SDK and move core to utility section ([#290](https://github.com/snipkit/snipkit/issues/290)) ([b6683a5](https://github.com/snipkit/snipkit/commit/b6683a594edfaed17e675bc26bec51f735769b55))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @snipkit/ip bumped from 1.0.0-alpha.8 to 1.0.0-alpha.9
    * snipkit bumped from 1.0.0-alpha.8 to 1.0.0-alpha.9
  * devDependencies
    * @snipkit/eslint-config bumped from 1.0.0-alpha.8 to 1.0.0-alpha.9
    * @snipkit/rollup-config bumped from 1.0.0-alpha.8 to 1.0.0-alpha.9
    * @snipkit/tsconfig bumped from 1.0.0-alpha.8 to 1.0.0-alpha.9
