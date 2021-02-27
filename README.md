<!-- TITLE/ -->
# expect-mocha-image-snapshot
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/expect-mocha-image-snapshot.svg)](https://npmjs.org/package/expect-mocha-image-snapshot)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://github.com/undefined/workflows/build/badge.svg)](https://github.com/undefined/actions)
[![Coverage status](https://img.shields.io/coveralls/undefined)](https://coveralls.io/github/undefined)
[![Dependency status](https://img.shields.io/david/undefined)](https://david-dm.org/undefined)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

<a href="https://gitpod.io/#https://github.com/dword-design/bar">
  <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
</a><a href="https://www.buymeacoffee.com/dword">
  <img
    src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
    alt="Buy Me a Coffee"
    height="32"
  >
</a><a href="https://paypal.me/SebastianLandwehr">
  <img
    src="https://dword-design.de/images/paypal.svg"
    alt="PayPal"
    height="32"
  >
</a><a href="https://www.patreon.com/dworddesign">
  <img
    src="https://dword-design.de/images/patreon.svg"
    alt="Patreon"
    height="32"
  >
</a>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
A wrapper around jest-image-snapshot that makes it compatible to Mocha.
<!-- /DESCRIPTION -->

Snapshot testing is very Jest-centered. There are not too many solutions for other testing frameworks to test against snapshots. Even less for image snapshots. There is [expect-mocha-snapshot](https://www.npmjs.com/package/expect-mocha-snapshot) that enables snapshot testing with Mocha and [expect](https://www.npmjs.com/package/expect).

This package uses a similar approach to make [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) Mocha compatible, allowing Mocha users to do image snapshot testing.

<!-- INSTALL/ -->
## Install

```bash
# NPM
$ npm install expect-mocha-image-snapshot

# Yarn
$ yarn add expect-mocha-image-snapshot
```
<!-- /INSTALL -->

## Usage

```js
import expect from 'expect'
import { toMatchImageSnapshot } from 'expect-mocha-image-snapshot'

expect.extend({ toMatchImageSnapshot })

it('works', function () {
  ...
  const screenshot = await puppeteer.screenshot()
  expect(screenshot).toMatchSnapshot(this) // this is important here
});
```

Note that it is important to pass `this` to the matcher because it contains the test metadata.

It is also possible to configure default options:

```js
import { configureToMatchImageSnapshot } from 'expect-mocha-image-snapshot'

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    customSnapshotsDir: '__foo_image_snapshots__',
  }),
})
```
See the [jest-image-snapshot docs](https://www.npmjs.com/package/jest-image-snapshot) for details.

<!-- LICENSE/ -->
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
