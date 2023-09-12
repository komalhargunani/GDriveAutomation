define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'],
function(MixinUtils, QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-column-break',
    extends: 'span',

    etp: 'brk',

    hostAttributes: {
      'break-after': ''
    }

  };

  window.QowtColumnBreak = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
