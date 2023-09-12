define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests cssSize to pt converter', function() {

    it('should correctly convert cssSize strings to pt', function() {
      assert.equal(Converter.cssSize2pt('30px'), 22.5, '30px');
      assert.equal(Converter.cssSize2pt('2.5cm'), 708.66141725, '2.5cm');
      assert.equal(Converter.cssSize2pt('72pt'), 72, '72pt');
      assert.equal(Converter.cssSize2pt('12mm'), 34.015748028, '12mm');
      assert.equal(Converter.cssSize2pt('x-small'), 7.5, 'x-small');
      assert.equal(Converter.cssSize2pt('small'), 10, 'small');
      assert.equal(Converter.cssSize2pt('medium'), 12, 'medium');
      assert.equal(Converter.cssSize2pt('large'), 13.5, 'large');
      assert.equal(Converter.cssSize2pt('x-large'), 18, 'x-large');
      assert.equal(Converter.cssSize2pt('xx-large'), 24, 'xx-large');
    });

    it('should throw error when input is not valid',
        function() {
      assert.throws(Converter.cssSize2pt.bind(null, 'hello'));
      assert.throws(Converter.cssSize2pt.bind(null, {}));
      assert.throws(Converter.cssSize2pt.bind(null, function() {}));
      assert.throws(Converter.cssSize2pt.bind(null, true));
      assert.throws(Converter.cssSize2pt.bind(null, []));
    });

  });
});
