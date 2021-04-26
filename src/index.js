import { toMatchImageSnapshot as jestToMatchImageSnapshot } from 'jest-image-snapshot'
import jestSnapshot from 'jest-snapshot'

const makeTestTitle = test => {
  let next = test

  const title = []
  for (;;) {
    if (!next.parent) {
      break
    }
    title.push(next.title)
    next = next.parent
  }

  return title.reverse().join(' ')
}

export const configureToMatchImageSnapshot = common => (
  received,
  context,
  options
) => {
  if (!context || !context.test) {
    throw new Error(
      'Missing `context` argument for .toMatchImageSnapshot().\n' +
        'Did you forget to pass `this` into expect().toMatchImageSnapshot(this)?'
    )
  }
  if (!context.imageSnapshotState) {
    context.imageSnapshotState = new jestSnapshot.SnapshotState(undefined, {
      updateSnapshot: process.env.SNAPSHOT_UPDATE ? 'all' : 'new',
    })
  }

  const matcher = jestToMatchImageSnapshot.bind({
    currentTestName: makeTestTitle(context.test),
    snapshotState: context.imageSnapshotState,
    testPath: context.test.file,
  })

  const result = matcher(received, { ...common, ...options })

  return result
}

export const toMatchImageSnapshot = configureToMatchImageSnapshot()
