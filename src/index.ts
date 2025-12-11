import {
  type MatchImageSnapshotOptions,
  toMatchImageSnapshot as jestToMatchImageSnapshot,
} from 'jest-image-snapshot';
import { SnapshotState } from 'jest-snapshot';
import type { Context, Runnable, Suite } from 'mocha';

const makeTestTitle = (test: Runnable) => {
  let next: Runnable | Suite = test;
  const title = [];

  for (;;) {
    if (!next.parent) {
      break;
    }

    title.push(next.title);
    next = next.parent;
  }

  return title.reverse().join(' ');
};

export const configureToMatchImageSnapshot =
  (common: MatchImageSnapshotOptions = {}) =>
  (received: Buffer, context: Context, options: MatchImageSnapshotOptions) => {
    if (!context || !context.test) {
      throw new Error(
        'Missing `context` argument for .toMatchImageSnapshot().\n' +
          'Did you forget to pass `this` into expect().toMatchImageSnapshot(this)?',
      );
    }

    if (!context.imageSnapshotState) {
      context.imageSnapshotState = new SnapshotState('', {
        rootDir: process.cwd(),
        snapshotFormat: {},
        updateSnapshot: process.env.SNAPSHOT_UPDATE ? 'all' : 'new',
      });
    }

    const matcher = jestToMatchImageSnapshot.bind({
      currentTestName: makeTestTitle(context.test),
      snapshotState: context.imageSnapshotState,
      testPath: context.test.file,
    });

    const result = matcher(received, { ...common, ...options });
    return result;
  };

export const toMatchImageSnapshot = configureToMatchImageSnapshot();
