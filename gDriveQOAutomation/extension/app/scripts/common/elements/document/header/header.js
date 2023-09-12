define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/elements/document/headerFooterBase/headerFooterBaseBehavior'
  ], function(
  MixinUtils,
  QowtElement
  ) {

  'use strict';

  var api_ = {
    is: 'qowt-header',
    behaviors: [
      HeaderFooterBaseBehavior
    ],
    hostAttributes: {
      contenteditable: 'false'
    }
  };

  window.QowtHeader = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
