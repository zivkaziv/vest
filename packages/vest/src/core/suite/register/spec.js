import suite from '..';
import resetState from '../../../../testUtils/resetState';
import runRegisterSuite from '../../../../testUtils/runRegisterSuite';
import { OPERATION_MODE_STATEFUL } from '../../../constants';
import * as state from '../../state';

const suiteName = 'suite_1';
const suiteId = 'suiteId_1';

let context;
describe('registerSuite', () => {
  let prevSuiteState;

  beforeEach(() => {
    resetState();
    context = {
      name: suiteName,
      suiteId,
      operationMode: OPERATION_MODE_STATEFUL,
    };
  });

  describe('When suite does not exist in state', () => {
    it('Should create initial suite without prevState', () => {
      expect(state.getSuite(suiteId)).toBeUndefined();
      runRegisterSuite(context);
      expect(state.getSuite(suiteId)).toHaveLength(2);
      expect(state.getSuite(suiteId)[1]).toBeUndefined();
      expect(state.getSuite(suiteId)[0]).toMatchSnapshot();
    });
  });

  describe('When suite exists in state', () => {
    let suiteState;
    beforeEach(() => {
      runRegisterSuite(context);
      suiteState = state.getSuite(suiteId);
      prevSuiteState = suiteState[0];
      runRegisterSuite({ ...context });
    });
    it('Should move prev prevSuiteState into second array cell', () => {
      expect(state.getSuite(suiteId)[1]).toBe(prevSuiteState);
    });

    describe('Prev state data handling', () => {
      describe('When lagging and/or pending exist in the previous state', () => {
        let pending, lagging;
        beforeEach(() => {
          pending = [jest.fn(), jest.fn(), jest.fn()];
          lagging = [jest.fn(), jest.fn(), jest.fn()];
          suite.patch(suiteId, state => ({
            ...state,
            pending,
            lagging,
          }));
          runRegisterSuite(context);
        });
        it('Should merge previous pending and lagging into lagging', () => {
          expect(suiteState[0].lagging).isDeepCopyOf([...pending, ...lagging]);
        });

        it('Should match snapshot', () => {
          expect(suiteState).toMatchSnapshot();
        });
      });
      it('Should nullify prevState pending and lagging', () => {
        expect(suiteState[1].lagging).toBeNull();
        expect(suiteState[1].pending).toBeNull();
      });
    });

    it('Should match snapshot', () => {
      expect(suiteState).toMatchSnapshot();
    });
  });
});
