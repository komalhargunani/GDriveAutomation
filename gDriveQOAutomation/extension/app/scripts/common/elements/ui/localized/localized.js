/**
 * @fileoverview API for the qowt-localized element.
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/utils/i18n'
  ], function(
    MixinUtils,
    QowtElement,
    I18n) {

  'use strict';

  var api_ = {
    is: 'qowt-localized',

    attached: function() {
      this.parseI18nKeys();
    },

    /**
     * Searches through all text nodes contained in the qowt-localized node for
     * all strings that are contained within double underscores. The string
     * contained will be passed into the I18n module to be translated and then
     * the result will replace the matched area. This will happen even if the
     * response from the I18n module is an empty string.
     */
    parseI18nKeys: function() {
      this.normalize();

      var iterator = document.createNodeIterator(this, NodeFilter.SHOW_TEXT);
      var node = iterator.nextNode();
      while (node) {
        var currentText = node.nodeValue;
        var translated = currentText.replace(/__([^\s-]+)__/g,
          function(/* match, p1 */) {
            var p1 = arguments[1];
            return I18n.getMessage(p1);
          }
        );
        node.nodeValue = translated;

        node = iterator.nextNode();
      }
    }
  };

  window.QowtLocalized = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
