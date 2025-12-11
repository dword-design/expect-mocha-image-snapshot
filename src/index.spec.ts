import endent from 'endent';
import { test, expect } from '@playwright/test';
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import fs from 'fs-extra'
import { toMatchImage } from 'jest-image-matcher'
import P from 'path'
import sharp from 'sharp'

expect.extend({ toMatchImage })

test.beforeEach(async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(P.join(cwd, '.mocharc.json'), JSON.stringify({
    "$schema": "https://json.schemastore.org/mocharc.json",
    "require": "tsx"
  }));
});

test('configure', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { configureToMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self({ customSnapshotsDir: '__foo_image_snapshots__' }) });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      });
    `,
  );
  await execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })

  const snapshot = await fs.readFile(
    P.join(cwd, '__foo_image_snapshots__', 'index-spec-ts-works-1-snap.png'),
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
      .toBuffer(),
  )
});

test('different existing snapshot', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      });
    `,
  )
  await fs.outputFile(
    P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
    await sharp({
      create: {
        background: { b: 255, g: 0, r: 0 },
        channels: 3,
        height: 48,
        width: 48,
      },
    })
      .png()
      .toBuffer(),
  )
  await expect(
    execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })
  ).rejects.toThrow(
    'Expected image to match or be a close match to snapshot but was 100% different from snapshot (2304 differing pixels).',
  )
});

test('equal existing snapshot', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      });
    `,
  )
  await fs.outputFile(
    P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
    await sharp({
      create: {
        background: { b: 0, g: 255, r: 0 },
        channels: 3,
        height: 48,
        width: 48,
      },
    })
      .png()
      .toBuffer(),
  )
  await execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })
});

test('expect-mocha-snapshot', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';
      import toMatchSnapshot from '${packageName`expect-mocha-snapshot`}';

      expect.extend({ toMatchImageSnapshot: self });
      expect.extend({ toMatchSnapshot });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      })

      it('text snapshot', function () {
        expect('foo').toMatchSnapshot(this);
      });
    `,
  );
  await execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })
});

test('multiple snapshots per test', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self });

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
          .toBuffer();
        expect(img1).toMatchImageSnapshot(this);
        expect(img2).toMatchImageSnapshot(this);
      });
    `,
  )
  await execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })
  expect(
    await fs.readFile(
      P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
    ),
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
      .toBuffer(),
  )
  expect(
    await fs.readFile(
      P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-2-snap.png'),
    ),
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
      .toBuffer(),
  )
});

test('no existing snapshots', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      });
    `,
  )
  await execaCommand('mocha --timeout 5000 index.spec.ts', { cwd })
  expect(
    await fs.readFile(
      P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
    ),
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
      .toBuffer(),
  )
});

test('update existing snapshot', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();
  await fs.outputFile(
    P.join(cwd, 'index.spec.ts'),
    endent`
      import sharp from '${packageName`sharp`}';
      import { expect } from '${packageName`expect`}';
      import { toMatchImageSnapshot as self } from '../../src';

      expect.extend({ toMatchImageSnapshot: self });

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
          .toBuffer();
        expect(img).toMatchImageSnapshot(this);
      });
    `,
  )
  await fs.outputFile(
    P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
    await sharp({
      create: {
        background: { b: 255, g: 0, r: 0 },
        channels: 3,
        height: 48,
        width: 48,
      },
    })
      .png()
      .toBuffer(),
  )
  await execaCommand('mocha --timeout 5000 index.spec.ts', {
    env: { SNAPSHOT_UPDATE: 'true' },
    cwd,
  })

  const snapshot = await fs.readFile(
    P.join(cwd, '__image_snapshots__', 'index-spec-ts-works-1-snap.png'),
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
      .toBuffer(),
  )
});
