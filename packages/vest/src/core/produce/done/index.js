import suite from '../../suite';

/**
 * Registers done callbacks.
 * @param {Object} state
 * @param {string} [fieldName]
 * @param {Function} doneCallback
 * @register {Object} Vest output object.
 */
const done = (state, produce, ...args) => {
  const { length, [length - 1]: callback, [length - 2]: fieldName } = args;

  const output = produce(state);

  // If we do not have any tests for current field
  const shouldSkipRegistration = fieldName && !output.tests[fieldName];

  if (typeof callback !== 'function' || shouldSkipRegistration) {
    return output;
  }

  // This won't be cached. Because we do not know where in the
  // Lifecycle of our validations this produce will run, the test may be
  // outdated and we might even not have a reference for it, so we're spreading
  // to skip the cache.
  const cb = () => callback(produce({ ...state }, { draft: true }));
  const isFinishedTest =
    fieldName && !suite.hasRemainingTests(state, fieldName);
  const isSuiteFinished = !suite.hasRemainingTests(state);
  const shouldRunCallback = isFinishedTest || isSuiteFinished;
  if (shouldRunCallback) {
    cb();
    return output;
  }

  suite.patch(state.suiteId, state => {
    if (fieldName) {
      state.fieldCallbacks[fieldName] = [].concat(
        ...(state.fieldCallbacks[fieldName] || []),
        cb
      );
    } else {
      state.doneCallbacks.push(cb);
    }
    return state;
  });

  return output;
};

export default done;
