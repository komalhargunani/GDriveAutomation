define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests px to pt converter', function() {

    it('should correctly convert px values to pt', function() {
      assert.equal(Converter.px2pt(30), 22.5, '30');
      assert.equal(Converter.px2pt(2.5), 1.875, '2.5');
      assert.equal(Converter.px2pt(72), 54, '72');
      assert.equal(Converter.px2pt(12), 9, '12');
    });

    it('should throw error when input is not valid',
        function() {
      assert.throws(Converter.px2pt.bind(null, 'hello'));
      assert.throws(Converter.px2pt.bind(null, {}));
      assert.throws(Converter.px2pt.bind(null, function() {}));
      assert.throws(Converter.px2pt.bind(null, true));
      assert.throws(Converter.px2pt.bind(null, []));
    });

  });
});
