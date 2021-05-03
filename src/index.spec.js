import { endent } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import execa from 'execa'
import { outputFile, readFile } from 'fs-extra'
import { toMatchImage } from 'jest-image-matcher'
import P from 'path'
import sharp from 'sharp'
import withLocalTmpDir from 'with-local-tmp-dir'

expect.extend({ toMatchImage })

export default {
  configure: () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { configureToMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self({ customSnapshotsDir: '__foo_image_snapshots__' }) })

        it('works', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })
      `
      )
      await execa.command('mocha --timeout 5000 index.spec.js')

      const snapshot = await readFile(
        P.join('__foo_image_snapshots__', 'index-spec-js-works-1-snap.png')
      )
      expect(snapshot).toMatchImage(
        await sharp({
          create: {
            background: { b: 0, g: 255, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
    }),
  'different existing snapshot': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self })

        it('works', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })
      `
      )
      await outputFile(
        P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png'),
        await sharp({
          create: {
            background: { b: 255, g: 0, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
      await expect(
        execa.command('mocha --timeout 5000 index.spec.js', { all: true })
      ).rejects.toThrow(
        'Expected image to match or be a close match to snapshot but was 100% different from snapshot (2304 differing pixels).'
      )
    }),
  'equal existing snapshot': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self })

        it('works', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })
      `
      )
      await outputFile(
        P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png'),
        await sharp({
          create: {
            background: { b: 0, g: 255, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
      await execa.command('mocha --timeout 5000 index.spec.js')
    }),
  'expect-mocha-snapshot': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')
        const toMatchSnapshot = require('${packageName`expect-mocha-snapshot`}')

        expect.extend({ toMatchImageSnapshot: self })
        expect.extend({ toMatchSnapshot })

        it('image snapshot', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })

        it('text snapshot', function () {
          expect('foo').toMatchSnapshot(this)
        })
      `
      )
      await execa.command('mocha --timeout 5000 index.spec.js')
    }),
  'multiple snapshots per test': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self })

        it('works', async function () {
          const img1 = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          const img2 = await sharp({
            create: {
              background: { b: 255, g: 0, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img1).toMatchImageSnapshot(this)
          expect(img2).toMatchImageSnapshot(this)
        })
      `
      )
      await execa.command('mocha --timeout 5000 index.spec.js')
      expect(
        await readFile(
          P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png')
        )
      ).toMatchImage(
        await sharp({
          create: {
            background: { b: 0, g: 255, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
      expect(
        await readFile(
          P.join('__image_snapshots__', 'index-spec-js-works-2-snap.png')
        )
      ).toMatchImage(
        await sharp({
          create: {
            background: { b: 255, g: 0, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
    }),
  'no existing snapshots': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self })

        it('works', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })
      `
      )
      await execa.command('mocha --timeout 5000 index.spec.js')
      expect(
        await readFile(
          P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png')
        )
      ).toMatchImage(
        await sharp({
          create: {
            background: { b: 0, g: 255, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
    }),
  'update existing snapshot': () =>
    withLocalTmpDir(async () => {
      await outputFile(
        'index.spec.js',
        endent`
        const sharp = require('${packageName`sharp`}')
        const expect = require('${packageName`expect`}')
        const { toMatchImageSnapshot: self } = require('../src')

        expect.extend({ toMatchImageSnapshot: self })

        it('works', async function () {
          const img = await sharp({
            create: {
              background: { b: 0, g: 255, r: 0 },
              channels: 3,
              height: 48,
              width: 48,
            },
          })
            .png()
            .toBuffer()
          expect(img).toMatchImageSnapshot(this)
        })
      `
      )
      await outputFile(
        P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png'),
        await sharp({
          create: {
            background: { b: 255, g: 0, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
      await execa.command('mocha --timeout 5000 index.spec.js', {
        env: { SNAPSHOT_UPDATE: true },
      })

      const snapshot = await readFile(
        P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png')
      )
      expect(snapshot).toMatchImage(
        await sharp({
          create: {
            background: { b: 0, g: 255, r: 0 },
            channels: 3,
            height: 48,
            width: 48,
          },
        })
          .png()
          .toBuffer()
      )
    }),
}
