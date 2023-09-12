define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement'], function(
    MixinUtils,
    QowtElement) {

  'use strict';

  var api_ = {
    is: 'qowt-background',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'background',

    attached: function() {
      this.fire('background-changed');
    },

    // Get header item for specific type (eg odd/even/both/first-page)
    // used by dcp handler to grab the right target for items
    getBackgroundColor: function() {
      return (this.model &&
              this.model.formatting &&
              this.model.formatting.backgroundcolor);
    }
  };

  window.QowtBackground = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
