import suite from '..';
/**
 * Removes completed "stateless" suite from state storage.
 * @param {string} suiteId
 */
const cleanupCompleted = suiteId => {
  const state = suite.getState(suiteId);

  if (suite.hasRemainingTests(state)) {
    return;
  }
  suite.remove(suiteId);
};

export default cleanupCompleted;
