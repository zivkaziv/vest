import createCache from '../../lib/cache';
import copy from '../../lib/copy';
import {
  SEVERITY_GROUP_ERROR,
  SEVERITY_GROUP_WARN,
} from '../test/lib/VestTest/constants';
import done from './done';
import genTestsSummary, { countFailures } from './genTestsSummary';
import get from './get';
import getByGroup from './getByGroup';
import has from './has';
import hasByGroup from './hasByGroup';

const cache = createCache(20);

/**
 * @returns {Object} with only public properties.
 */
const extract = ({ groups, tests, name }) => ({
  groups,
  tests,
  name,
});

/**
 * @param {Object} state
 * @param {Object} Options
 * @param {boolean} [Options.draft]
 * @returns Vest output object.
 */

const produce = (state, { draft } = {}) =>
  cache(
    [state, draft],
    () =>
      state
      |> copy
      |> genTestsSummary
      |> extract
      |> countFailures
      |> (transformedState =>
        Object.defineProperties(
          transformedState,
          [
            ['hasErrors', has.bind(null, state, SEVERITY_GROUP_ERROR)],
            ['hasWarnings', has.bind(null, state, SEVERITY_GROUP_WARN)],
            ['getErrors', get.bind(null, state, SEVERITY_GROUP_ERROR)],
            ['getWarnings', get.bind(null, state, SEVERITY_GROUP_WARN)],
            [
              'hasErrorsByGroup',
              hasByGroup.bind(null, state, SEVERITY_GROUP_ERROR),
            ],
            [
              'hasWarningsByGroup',
              hasByGroup.bind(null, state, SEVERITY_GROUP_WARN),
            ],
            [
              'getErrorsByGroup',
              getByGroup.bind(null, state, SEVERITY_GROUP_ERROR),
            ],
            [
              'getWarningsByGroup',
              getByGroup.bind(null, state, SEVERITY_GROUP_WARN),
            ],
          ]
            .concat(draft ? [] : [['done', done.bind(null, state, produce)]])
            .reduce((properties, [name, value]) => {
              properties[name] = {
                configurable: true,
                enumerable: true,
                value,
                writeable: true,
              };
              return properties;
            }, {})
        ))
  );

export default produce;
