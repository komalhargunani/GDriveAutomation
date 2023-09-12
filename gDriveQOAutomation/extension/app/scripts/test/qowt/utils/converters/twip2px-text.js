define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests twip to px converter', function() {

    it('should correctly convert twip values to px', function() {
      assert.equal(Converter.twip2px(15), 1, '15');
      assert.equal(Converter.twip2px(1), 0.07, '1');
      assert.equal(Converter.twip2px(0), 0, '0');
      assert.equal(Converter.twip2px(50), 3.33, '50');
    });

    it('should correctly convert px values to twip', function() {
      assert.equal(Converter.px2twip(1), 15, '1');
      assert.equal(Converter.px2twip(50), 750, '50');
      assert.equal(Converter.px2twip(0), 0, '0');
      assert.equal(Converter.px2twip(3.33), 50, '3.33');
    });

    it('should throw error when input is not valid', function() {
      assert.throws(Converter.twip2px.bind(null, 2.5));
      assert.throws(Converter.twip2px.bind(null, 'hello'));
      assert.throws(Converter.twip2px.bind(null, {}));
      assert.throws(Converter.twip2px.bind(null, function() {}));
      assert.throws(Converter.twip2px.bind(null, true));
      assert.throws(Converter.twip2px.bind(null, []));

      assert.throws(Converter.px2twip.bind(null, 'hello'));
      assert.throws(Converter.px2twip.bind(null, {}));
      assert.throws(Converter.px2twip.bind(null, function() {}));
      assert.throws(Converter.px2twip.bind(null, true));
      assert.throws(Converter.px2twip.bind(null, []));
    });
  });
});
