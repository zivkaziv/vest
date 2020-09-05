import { dummyTest } from '../../../testUtils/testDummy';
import produce from '../../core/produce';
import suite from '../../core/suite';
import get from '.';

const suiteId = 'form-name';

const validation = () =>
  suite.create(suiteId, () => {
    dummyTest.passing('f1', 'msg');
    dummyTest.failing('f2', 'msg');
    dummyTest.failingWarning('f2', 'msg');
  });

describe('hook: vest.get()', () => {
  describe('When called without suite id', () => {
    it('Should throw an error', () => {
      expect(get).toThrow(
        '[Vest]: `get` hook was called without a suite name.'
      );
    });
  });

  describe('When suite id does not exist', () => {
    it('Should throw an error', () => {
      expect(() => get('I do not exist')).toThrow();
    });
  });

  describe('When suite exists', () => {
    let validate;

    beforeEach(() => {
      validate = validation();
    });

    afterEach(() => {
      suite.remove(suiteId);
    });

    it('Should return produced result', () => {
      validate();
      expect(produce(suite.getState(suiteId), { draft: true })).toBe(
        get(suiteId)
      );
      expect(get(suiteId)).toMatchSnapshot();
    });
  });
});
