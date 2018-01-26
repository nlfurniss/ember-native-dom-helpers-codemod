import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('first-and-get');

test('transforms first() correctly', function(assert) {
  assert.ok(find('.foo bar').first());

  const otherFirst = someOtherObj.first();
});

test('transforms get() correctly', function(assert) {
  assert.ok(find('.foo bar').get(3));

  const otherGet = someOtherObj.get(1);
});
