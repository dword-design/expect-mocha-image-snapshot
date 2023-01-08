import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import fs, { outputFile } from 'fs-extra'
import { toMatchImage } from 'jest-image-matcher'
import P from 'path'
import sharp from 'sharp'

expect.extend({ toMatchImage })

export default tester(
  {
    configure: async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { configureToMatchImageSnapshot as self } from '../src/index.js'

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
      await execaCommand('mocha --timeout 5000 index.spec.js')

      const snapshot = await fs.readFile(
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
    },
    'different existing snapshot': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'

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
      await fs.outputFile(
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
        execaCommand('mocha --timeout 5000 index.spec.js', { all: true })
      ).rejects.toThrow(
        'Expected image to match or be a close match to snapshot but was 100% different from snapshot (2304 differing pixels).'
      )
    },
    'equal existing snapshot': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'

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
      await fs.outputFile(
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
      await execaCommand('mocha --timeout 5000 index.spec.js')
    },
    'expect-mocha-snapshot': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'
      import toMatchSnapshot from '${packageName`expect-mocha-snapshot`}'

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
      await execaCommand('mocha --timeout 5000 index.spec.js')
    },
    'multiple snapshots per test': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'

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
      await execaCommand('mocha --timeout 5000 index.spec.js')
      expect(
        await fs.readFile(
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
        await fs.readFile(
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
    },
    'no existing snapshots': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'

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
      await execaCommand('mocha --timeout 5000 index.spec.js')
      expect(
        await fs.readFile(
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
    },
    'update existing snapshot': async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
      import sharp from '${packageName`sharp`}'
      import { expect } from '${packageName`expect`}'
      import { toMatchImageSnapshot as self } from '../src/index.js'

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
      await fs.outputFile(
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
      await execaCommand('mocha --timeout 5000 index.spec.js', {
        env: { SNAPSHOT_UPDATE: true },
      })

      const snapshot = await fs.readFile(
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
    },
  },
  [
    testerPluginTmpDir(),
    {
      beforeEach: () =>
        outputFile('package.json', JSON.stringify({ type: 'module' })),
    },
  ]
)
