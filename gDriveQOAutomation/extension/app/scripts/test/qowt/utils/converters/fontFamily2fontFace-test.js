define([
  'qowtRoot/utils/converters/converter'
], function(Converter) {

  'use strict';

  describe('tests fontFamily to fontFace converter', function() {

    // note: we also test that it strips the quotes from the fontFace!
    it('should correctly convert fontFamily strings to font face', function() {
      assert.equal(Converter.fontFamily2fontFace('Papyrus, cursive'),
          'Papyrus', 'Papyrus');
      assert.equal(Converter.fontFamily2fontFace('Parchment, cursive'),
          'Parchment', 'Parchment');
      assert.equal(Converter.fontFamily2fontFace('"Perpetua Titling", ' +
          '"Felix Titling", serif'), 'Perpetua Titling', 'Perpetua Titling');
      assert.equal(Converter.fontFamily2fontFace('Perpetua, serif'),
          'Perpetua', 'Perpetua');
      assert.equal(Converter.fontFamily2fontFace('Plantagenet Cherokee'),
          'Plantagenet Cherokee', 'Plantagenet Cherokee');
    });

    it('should throw error when input is not valid',
        function() {
      assert.throws(Converter.fontFamily2fontFace.bind(null, {}));
      assert.throws(Converter.fontFamily2fontFace.bind(null, function() {}));
      assert.throws(Converter.fontFamily2fontFace.bind(null, true));
      assert.throws(Converter.fontFamily2fontFace.bind(null, []));
    });

  });
});
