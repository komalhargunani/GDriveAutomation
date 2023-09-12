define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-ole-object',
    etp: 'oleObject'
  };

  window.QowtOleObject = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      api_));

  return {};
});
