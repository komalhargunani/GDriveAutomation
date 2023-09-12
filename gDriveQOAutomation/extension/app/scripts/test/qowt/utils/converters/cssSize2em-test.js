define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests cssSize to em converter', function() {

    // NOTE: cssSize2em ultimately uses pt2em which relies heavily on the
    // EnvModel for point. So these tests are really here to spot regressions
    // rather than ensuring that we always correctly convert to em (eg we do
    // not for example walk the tree for em conversions today!)

    it('should correctly convert cssSize strings to em', function() {
      assert.equal(Converter.cssSize2em('30px'), 1.875, '30px');
      assert.equal(Converter.cssSize2em('2.5cm'), 59.05511810416667, '2.5cm');
      assert.equal(Converter.cssSize2em('72pt'), 6, '72pt');
      assert.equal(Converter.cssSize2em('12mm'), 2.834645669, '12mm');
    });

    it('should throw error when input is not valid',
        function() {
      assert.throws(Converter.cssSize2em.bind(null, 'hello'));
      assert.throws(Converter.cssSize2em.bind(null, {}));
      assert.throws(Converter.cssSize2em.bind(null, function() {}));
      assert.throws(Converter.cssSize2em.bind(null, true));
      assert.throws(Converter.cssSize2em.bind(null, []));
    });

  });
});
