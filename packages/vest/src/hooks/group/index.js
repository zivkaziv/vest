import Context from '../../core/Context';
import suite from '../../core/suite';
import runWithContext from '../../lib/runWithContext';
import validateSuiteParams from '../../lib/validateSuiteParams';
import { isGroupExcluded } from '../exclusive';

/**
 * Registers a group in state.
 * @param {string} groupName
 */
const registerGroup = groupName => {
  const context = Context.use();
  suite.patch(context.suiteId, state => {
    const nextState = { ...state };
    nextState.groups[groupName] = state.groups[groupName] || {};
    return nextState;
  });
};

/**
 * Runs a group callback.
 * @param {string} groupName
 * @param {Function} tests
 */
const group = (groupName, tests) => {
  validateSuiteParams('group', groupName, tests);

  const ctx = Context.use();
  const state = suite.getState(ctx.suiteId);

  if (!isGroupExcluded(state, groupName)) {
    registerGroup(groupName);
  }

  runWithContext(
    {
      groupName,
    },
    () => tests()
  );
};

export default group;
