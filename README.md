<!-- TITLE/ -->
# expect-mocha-image-snapshot
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/expect-mocha-image-snapshot">
      <img
        src="https://img.shields.io/npm/v/expect-mocha-image-snapshot.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/expect-mocha-image-snapshot/actions">
      <img
        src="https://github.com/dword-design/expect-mocha-image-snapshot/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/expect-mocha-image-snapshot">
      <img
        src="https://codecov.io/gh/dword-design/expect-mocha-image-snapshot/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/expect-mocha-image-snapshot">
      <img src="https://img.shields.io/david/dword-design/expect-mocha-image-snapshot" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/expect-mocha-image-snapshot">
      <img
        src="https://gitpod.io/button/open-in-gitpod.svg"
        alt="Open in Gitpod"
        width="114"
      >
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        width="114"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://sebastianlandwehr.com/images/paypal.svg"
        alt="PayPal"
        width="163"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://sebastianlandwehr.com/images/patreon.svg"
        alt="Patreon"
        width="163"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
A wrapper around jest-image-snapshot that makes it compatible to Mocha.
<!-- /DESCRIPTION -->

Snapshot testing is very Jest-centered. There are not too many solutions for other testing frameworks to test against snapshots. Even less for image snapshots. There is [expect-mocha-snapshot](https://www.npmjs.com/package/expect-mocha-snapshot) that enables snapshot testing with Mocha and [expect](https://www.npmjs.com/package/expect).

This package uses a similar approach to make [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) Mocha compatible, allowing Mocha users to do image snapshot testing.

<!-- INSTALL/ -->
## Install

```bash
# npm
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

it('works', async function () {
  ...
  const screenshot = await puppeteer.screenshot()
  expect(screenshot).toMatchImageSnapshot(this) // this is important here
});
```

Note that it is important to pass `this` to the matcher because it contains the test metadata.

Now you can run `mocha` as usual:

```bash
$ mocha
```

To update existing snapshots, pass the environment variable `SNAPSHOT_UPDATE` into the process:

```bash
$ SNAPSHOT_UPDATE=true mocha
```

Additional options can be passed as a second argument (see [jest-image-snapshot docs](https://www.npmjs.com/package/jest-image-snapshot)):

```js
expect(screenshot).toMatchImageSnapshot(this, { dumpDiffToConsole: true })
```

It is also possible to configure default options (see [jest-image-snapshot docs](https://www.npmjs.com/package/jest-image-snapshot)):

```js
import { configureToMatchImageSnapshot } from 'expect-mocha-image-snapshot'

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    customSnapshotsDir: '__foo_image_snapshots__',
  }),
})
```

<!-- LICENSE/ -->
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/expect-mocha-image-snapshot/issues) or a [pull request](https://github.com/dword-design/expect-mocha-image-snapshot/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      width="114"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://sebastianlandwehr.com/images/paypal.svg"
      alt="PayPal"
      width="163"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://sebastianlandwehr.com/images/patreon.svg"
      alt="Patreon"
      width="163"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## See also

* [output-files](https://github.com/dword-design/output-files): Output a tree of files and directories by providing an object. Especially useful for testing with real files.
* [with-local-tmp-dir](https://github.com/dword-design/with-local-tmp-dir): Creates a temporary folder inside cwd, cds inside the folder, runs a function, and removes the folder. Especially useful for testing.
* [jest-image-matcher](https://github.com/dword-design/jest-image-matcher): A Jest matcher for image comparisons based on pixelmatch. Can also be used with Mocha. Useful for visual regression testing.
* [unify-mocha-output](https://github.com/dword-design/unify-mocha-output): Adjusts a Mocha output so that it is consistent across platforms and can be used for snapshot testing. Basically adjusts the checkmark symbol and removes time values.
* [mock-argv](https://github.com/dword-design/mock-argv): Temporarily overrides the command line arguments. This is useful for testing.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://sebastianlandwehr.com)
<!-- /LICENSE -->
