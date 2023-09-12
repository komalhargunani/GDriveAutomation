define([
  'qowtRoot/utils/cssManager'], function(
  CssManager) {

  'use strict';

  describe('utils/cssManager', function() {

    var _RULE_PREFIX = 'qowt-dyn-';
    var _selectorsToClean = [];
    function _addToCleanup(selector) {
      _selectorsToClean.push(selector);
    }

    beforeEach(function() {
      // Clean up any existing style rule that's going to invalidate
      // this test suite. Since its difficult to track down which unit test
      // may leave behind a bad state, its easier just clean up the bits of
      // the DOM that this unit test cares about.
      CssManager.removeAllRulesNow();
    });

    afterEach(function() {
      var s, i;
      // cleanup any style rules we made
      for (i = 0; i < _selectorsToClean.length; i++) {
        s = _selectorsToClean[i];
      }
      // now check there's nothing left over
      var styleElements = document.getElementsByTagName('head')[0].childNodes;
      var dynamicRuleFound = false;
      for (i = 0; i < styleElements.length; i++) {
        s = styleElements[i];
        if (s.tagName === 'STYLE') {
          if (s.id.substring(0, _RULE_PREFIX.length) === _RULE_PREFIX) {
            dynamicRuleFound = true;
            break;
          }
        }
      }
      expect(dynamicRuleFound).toBe(false);
    });

    it('should return a valid W3C element as the style element.', function() {
      var styleElement = CssManager.getStyleElement();
      expect(styleElement).toBeDefined();
    });

    it('should add new style elements in the head immediately if they ' +
        'did not exist', function() {
          var selector = '#foobar';
          _addToCleanup(selector);
          CssManager.addRuleNow(selector, {
            background: 'red',
            size: '14pt'
          });
          var styleElement = CssManager.getStyleElement(selector);
          expect(styleElement).not.toBe(null);
          expect(styleElement.textContent).toContain(
              '#foobar {background:red;size:14pt;} ');
        });

    it('should update existing style elements for a given selector',
       function() {
         var selector = '.foobar';
         _addToCleanup(selector);
         // Write the rule with some initial content.
         CssManager.addRuleNow(selector, {
           background: 'red'
         });
         // Now write the rule again with completely different content.
         CssManager.addRuleNow(selector, {
           color: 'yellow'
         });
         var styleElement = CssManager.getStyleElement(selector);
         var text = styleElement.textContent;
         expect(text).toContain('color:');
         expect(text).toContain('yellow');
         expect(text).not.toContain('background:');
         expect(text).not.toContain('red');
       });


    it('should create valid element id based on the selector', function() {
      var selector = '#selector .with .spaces';
      _addToCleanup(selector);
      CssManager.addRuleNow(selector, {
        background: 'red'
      });
      var styleElement = CssManager.getStyleElement(selector);
      // Valied element ids are 0-9, a-z, A-Z, '-' and '_'
      var patt1 = /[0-9a-z\-_]/gi;
      var test = styleElement.id.match(patt1);
      expect(test).not.toBe(null);
    });


    it('should be able to remove style elements from the head', function() {
      var selector = '#testSelector';
      _addToCleanup(selector);
      // Write the rule with some initial content.
      CssManager.addRule(selector, {
        background: 'red'
      });
      // remove the style
      CssManager.removeRuleNow(selector);
      // test the style is gone
      var styleElement = CssManager.getStyleElement(selector);
      expect(styleElement.textContent).toBe('');
    });


    it('should write style properties without new lines', function() {
      var selector = '#testSelector';
      _addToCleanup(selector);
      // Write the rule with some initial content.
      CssManager.addRule(selector, {
        background: 'red'
      });
      // test the style is gone
      var styleElement = CssManager.getStyleElement(selector);
      // should not match style textContent with \n
      expect(styleElement.textContent.indexOf('\\n')).toBe(-1);
    });


    it('should be able to handle selctors with spaces', function() {
      var selector = '#selector .with .spaces';
      _addToCleanup(selector);
      CssManager.addRuleNow(selector, {
        background: 'red'
      });
      var styleElement = CssManager.getStyleElement(selector);
      expect(styleElement).not.toBe(null);
      expect(styleElement.textContent).toBe(
          '#selector .with .spaces {background:red;} ');
    });

    it('should update style elements for a given selector', function() {
      var selector = '.foobar',
          styleElement = CssManager.getStyleElement(),
          text;

      jasmine.Clock.useMock();

      _addToCleanup(selector);
      // Write the rule with some initial content.
      CssManager.addRuleNow(selector, {
        background: 'red'
      });

      text = styleElement.textContent;
      expect(text).toContain('background:red');
      expect(text).not.toContain('color:yellow');

      // Now update the selector class by adding another rule.
      CssManager.updateRule(selector, {
        color: 'yellow'
      }, 2);

      jasmine.Clock.tick(3);
      text = styleElement.textContent;
      expect(text).toContain('color:yellow');
      expect(text).toContain('background:red');
    });
  });

  return {};

});
