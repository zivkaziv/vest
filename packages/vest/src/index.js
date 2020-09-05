import enforce from '../../n4s/src/enforce';
import suite from './core/suite';
import test from './core/test';
import { draft, only, skip, warn, get, group } from './hooks';
import runWithContext from './lib/runWithContext';

export default {
  VERSION: VEST_VERSION,
  create: suite.create,
  draft,
  enforce,
  get,
  group,
  only,
  reset: suite.reset,
  runWithContext,
  skip,
  test,
  validate: suite.validate,
  warn,
};
