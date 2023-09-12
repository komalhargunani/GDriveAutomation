define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'],
function(MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-page-break',
    extends: 'span',

    etp: 'brk',

    hostAttributes: {
      'break-after': '',
      'contentEditable': 'false'
    },

    created: function() {
      var DIV_TYPE = 'qowt-pagebreak';
      var PAGE_BREAK = 'data-mpb';
      this.setAttribute(PAGE_BREAK, 'true');
      this.setAttribute('qowt-divtype', DIV_TYPE);
    }

  };

  window.QowtPageBreak = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      api_));

  return {};
});
