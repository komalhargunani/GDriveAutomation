define([
  'qowtRoot/utils/mockKeyboard/keyCodes'], function(
  KeyCodes) {
  'use strict';

  describe('Mock Keyboard - Key Codes', function() {

    it('platform & locale should be read only properties, ' +
       'undefined until first call to lookup method', function() {
      expect(KeyCodes.platform).not.toBeDefined();
      expect(KeyCodes.locale).not.toBeDefined();
      KeyCodes.lookup('a');
      expect(KeyCodes.platform).toBeDefined();
      expect(KeyCodes.locale).toBeDefined();
      var lastPlatform = KeyCodes.platform,
          lastLocale = KeyCodes.locale;
      expect(function() {
        KeyCodes.platform = 'XXX';
        KeyCodes.locale = 'XXX';
      }).toThrow();
      expect(KeyCodes.platform).toBe(lastPlatform);
      expect(KeyCodes.locale).toBe(lastLocale);
    });

    it('should return a keycode object for a valid key, ' +
       'and undefined for an invalid key', function() {
      var valid = KeyCodes.lookup('x'),
          invalid = KeyCodes.lookup('§');
      expect(valid).toBeDefined();
      expect(valid.name).toBeDefined();
      expect(valid.textInput).toBeDefined();
      expect(valid.charCode).toBeDefined();
      expect(valid.keyCode).toBeDefined();
      expect(valid.keyIdentifier).toBeDefined();
      expect(valid.which).toBeDefined();
      expect(invalid).not.toBeDefined();
    });

  });

  return {};
});
