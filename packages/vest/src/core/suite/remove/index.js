import suite from '..';
import throwError from '../../../lib/throwError';
import { setSuites } from '../../state';
import { setCanceled } from '../../test/lib/canceled';

/**
 * Cleans up a suite from state.
 * @param {string} suiteId
 */
const remove = suiteId => {
  if (!suiteId) {
    throwError('`vest.remove` must be called with suiteId.');
  }

  const suiteState = suite.getState(suiteId);
  if (!suiteState) {
    return;
  }

  setCanceled(...(suiteState.pending || []));
  setCanceled(...(suiteState.lagging || []));

  setSuites(state => {
    delete state[suiteId];
    return state;
  });
};

export default remove;
