define([
  'common/mixins/decorators/link',
  'common/mixins/flowChildren',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
], function(
    Link,
    FlowChildren,
    MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-hyperlink',
    extends: 'a',

    hostAttributes: {
       'contenteditable': 'false'
    },

    etp: 'hlk',

    getHyperlinkTarget: function() {
      return this.getAttribute('href');
    }

  };

  window.QowtHyperlink = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      Link,
      FlowChildren,

      api_));

  return {};
});
