import suite from '..';
import { OPERATION_MODE_STATEFUL } from '../../../constants';
import runWithContext from '../../../lib/runWithContext';
import throwError from '../../../lib/throwError';

/**
 * Resets suite to its initial state
 * @param {String} suiteId
 */
const reset = suiteId => {
  if (!suiteId) {
    throwError('`vest.reset` must be called with suiteId.');
  }

  let name = suiteId;
  try {
    name = suite.getState(suiteId).name;
    suite.remove(suiteId);
  } catch {
    /* */
  }

  runWithContext(
    { name, suiteId, operationMode: OPERATION_MODE_STATEFUL },
    suite.register
  );
};

export default reset;
