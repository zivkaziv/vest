import suite from '..';
import { OPERATION_MODE_STATELESS } from '../../../constants/index';
import id from '../../../lib/id';
import runWithContext from '../../../lib/runWithContext';
import validateSuiteParams from '../../../lib/validateSuiteParams/index';

/**
 * Creates a suite and immediately invokes it.
 * @param {string} suiteName
 * @param {Function} tests
 */
const validate = (suiteName, tests) => {
  validateSuiteParams('validate', suiteName, tests);
  const suiteId = id();
  const res = runWithContext(
    {
      name: suiteName,
      suiteId,
      operationMode: OPERATION_MODE_STATELESS,
    },
    () => {
      const validationSuite = suite.create(suiteName, tests);
      if (typeof validationSuite === 'function') {
        return validationSuite();
      }
    }
  );
  suite.cleanupCompleted(suiteId);
  return res;
};

export default validate;
