/**
 * @fileoverview Unit test for the qowt-localized element.
 */

require([
  'qowtRoot/utils/i18n',
  'common/elements/ui/localized/localized'],
  function(I18n) {

  'use strict';

  describe('QowtLocalized Polymer Element prototype chain', function() {

    var element;
    beforeEach(function() {
      element = new QowtLocalized();
    });
    afterEach(function() {
      element = undefined;
    });

    it('should be a QowtLocalized instance.', function() {
      assert.instanceOf(element, QowtLocalized, 'be a QowtLocalized.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(element.isQowtElement, 'should be a QowtElement.');
    });
  });

  describe('Simple QowtLocalized Polymer Element', function() {

    var element, stub, beforeText, afterText;
    beforeEach(function() {
      beforeText = 'example_action_copy';
      afterText = 'Copy';
      stub = sinon.stub(I18n, 'getMessage');
      stub.withArgs(beforeText).returns(afterText);
      this.stampOutTempl('qowt-localized-simple-test-template');
      element = this.getTestDiv().querySelector('qowt-localized');
    });
    afterEach(function() {
      I18n.getMessage.restore();
      stub = undefined;
      element = undefined;
      beforeText = undefined;
      afterText = undefined;
    });

    it('should replace text with translated value', function() {
      assert.strictEqual(element.childNodes.length, 1);
      var stripped = element.childNodes[0].nodeValue.replace(/\s/g, '');
      assert.strictEqual(stripped, afterText);
    });
  });

  describe('QowtLocalized Polymer Element nesting text', function() {

    var stub, elements;
    beforeEach(function() {
      stub = sinon.stub(I18n, 'getMessage');
      stub.withArgs('example_action_cut').returns('Cut');
      stub.withArgs('example_action_copy').returns('Copy');
      stub.withArgs('example_action_paste').returns('Paste');
      this.stampOutTempl('qowt-localized-nesting-test-template');
      elements = this.getTestDiv().querySelectorAll('[id^=example-]');
    });
    afterEach(function() {
      I18n.getMessage.restore();
      stub = undefined;
      elements = undefined;
    });

    it('should translate all nested textnode keys', function() {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        assert.isTrue(element.childNodes.length >= 1);
        var splitId = element.id.split('-');
        var translatedText = splitId[splitId.length - 1].replace(/_/g, ' ');
        var nodeValue = element.childNodes[0].nodeValue;
        var stripped = nodeValue.replace(/^\s*|\s*$/g, '');
        if (translatedText === 'None') {
          assert.strictEqual(stripped, '');
        } else {
          assert.strictEqual(stripped, translatedText);
        }
      }
    });
  });
});