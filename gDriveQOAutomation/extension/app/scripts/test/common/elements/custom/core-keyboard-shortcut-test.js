define([
    'third_party/lo-dash/lo-dash.min'
  ], function() {

  'use strict';

  describe('core-keyboard-shortcut', function() {
    var td, elm, result, keycombo, expected;

    beforeEach(function() {
      this.stampOutTempl('core-keyboard-shortcut-test-template');
      td = this.getTestDiv();
    });

    it('should generate a correct shortcut label using all modifiers',
        function() {
      elm = document.createElement('core-keyboard-shortcut');
      var result = elm.getShortcutLabel_("CMD+CTRL+SHIFT+ALT+B");

      expected = (window.__polymer_core_platform_info.isOsx) ?
          '\u2318\u2303\u21E7\u2325B':
          'Cmd+Ctrl+Shift+Alt+B';
      assert.strictEqual(result, expected, 'all modifiers');
    });

    it('should generate correct shortcut labels when specified using pound ' +
        'codes', function() {
      var keys = [
        ['9', '\u21E5', 'TAB'],
        ['13', '\u23CE', 'RETURN'],
        ['33', '\u21DE', 'PAGEUP'],
        ['34', '\u21DF', 'PAGEDOWN'],
        ['35', '\u21F2', 'END'],
        ['36', '\u21F1', 'HOME'],
        ['37', '\u2190', '\u2190'],
        ['38', '\u2191', '\u2191'],
        ['39', '\u2192', '\u2192'],
        ['40', '\u2193', '\u2193']];
      elm = document.createElement('core-keyboard-shortcut');

      keys.forEach(function(key) {
        result = elm.getShortcutLabel_('CTRL+#' + key[0]);
        expected = (window.__polymer_core_platform_info.isOsx) ?
            '\u2303' + key[1]:
            'Ctrl+' + key[2];
        assert.strictEqual(result, expected, 'shortcut key ' + key[0]);
      });
    });

    it('should generate an empty shortcut label when no combo is given',
        function() {
      keycombo = undefined;
      expected = '';
      assertKeycomboGeneratesExpectedLabel(keycombo, expected);
    });

    it('should use the string given if not a valid modifier',
        function() {
      keycombo = 'JAM+RED+C';
      expected = 'JAMREDC';
      assertKeycomboGeneratesExpectedLabel(keycombo, expected);
    });

    it('should remove whitespace from keycombo strings', function() {
      var assertNoWhitespace = function(keycombo) {
        assert.notInclude(keycombo, ' ', 'keycombo trims whitespace');
      };

      elm = td.querySelectorAll('core-keyboard-shortcut')[1];
      assertNoWhitespace(elm.platformShortcut_);
    });

    it('should match only the 1 keyevent combination matching the keycombo',
        function() {
      var matches = testShortcutKeyWithEvents(66);
      assert.equal(matches.length, 1, 'should only have 1 match');
      assertEventMatchedComboModifiers(matches[0], true, false, true, false);

    });

    it('should not generate a shortcut label when showShortcut if false',
        function() {
      elm = td.querySelectorAll('core-keyboard-shortcut')[2];
      assert.isFalse(elm.showShortcut, 'showShortcut');
      assert.equal(elm.shortcutLabel, '');
    });

    it('should fire a "keyboard-shortcut" event with this element as the ' +
        'item detail.', function() {
      var fakeEvent = {preventDefault: function() {return true;},
          stopPropagation: function() {return true;}};
      sinon.stub(elm, 'process_').returns(true);
      sinon.stub(elm, 'fire');

      elm.handleKey_(fakeEvent);
      sinon.assert.calledOnce(elm.fire);
      sinon.assert.calledWith(elm.fire, 'keyboard-shortcut', {item: elm});

      elm.fire.restore();
      elm.process_.restore();
    });

    /**
     * @param {String} keycombo Declarative keycombo string.
     * @param {String} expectedLabel The expected generated shortcut label.
     */
    function assertKeycomboGeneratesExpectedLabel(keycombo, expectedLabel) {
      elm = document.createElement('core-keyboard-shortcut');
      result = elm.getShortcutLabel_(keycombo);
      assert.strictEqual(result, expectedLabel, 'label for keycombo');
    }

    /**
     * @param {Object} evt Represents a keyboard event.
     * @param {Boolean} ctrl Expected ctrl modifier.
     * @param {Boolean} alt Expected alt modifier.
     * @param {Boolean} shift Expected shift modifier.
     * @param {Boolean} meta Expected meta modifier.
     */
    function assertEventMatchedComboModifiers(evt, ctrl, alt, shift, meta) {
      assert.strictEqual(evt.ctrlKey, ctrl, 'ctrl modifier');
      assert.strictEqual(evt.altKey, alt, 'alt modifier');
      assert.strictEqual(evt.shiftKey, shift, 'shift modifier');
      assert.strictEqual(evt.metaKey, meta, 'meta modifier');
    }

    /** @param {Integer} keycode to add to the fake key event. */
    function testShortcutKeyWithEvents(keyCode) {
      var results = [];
      var matched;
      var evt = {'keyCode': keyCode};
      for (var iter = 0; iter <= 16; iter++) {
        evt.metaKey = !!(iter & 1);
        evt.shiftKey = !!(iter & 2);
        evt.altKey = !!(iter & 4);
        evt.ctrlKey = !!(iter & 8);
        // Generate 16 events using all combinations of modifier keys with the
        // given key code and have the shortcut element check them for a match.
        matched = elm.process_(evt);
        if (matched) {
          results.push(_.cloneDeep(evt));
        }
      }
      return results;
    }
  });
  return {};
});
