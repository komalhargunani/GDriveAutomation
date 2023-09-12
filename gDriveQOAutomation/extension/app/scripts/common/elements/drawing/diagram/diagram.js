define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'
], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  var diagramProto = {
    is: 'qowt-diagram',
    etp: 'dgm'
  };

  window.QowtDiagram = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      diagramProto));

  return {};
});
