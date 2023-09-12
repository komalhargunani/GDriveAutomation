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
    is: 'qowt-footer',
    behaviors: [
      HeaderFooterBaseBehavior
    ],
    hostAttributes: {
      contenteditable: 'false'
    }
  };

  window.QowtFooter = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
