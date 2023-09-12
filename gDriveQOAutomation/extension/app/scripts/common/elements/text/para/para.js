define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/text/addBrIfNeeded'
], function(
    MixinUtils,
    QowtElement,
    AddBrIfNeeded) {

  'use strict';

  var api_ = {
    /**
     * Override the default isEmpty.
     *
     * @return {boolean} returns true if we are empty and is smart enough
     *                   to know we are empty if we only have a <br> that
     *                   contentEditable might have put there
     */
    isEmpty: function() {
      // select all children which are NOT <br> AND <br>s that have qowt-divtype
      var children =
          this.querySelectorAll(':scope > :not(br), ' +
              ':scope > span[is=qowt-line-break]');
      return children.length === 0;
    }
  };

  return MixinUtils.mergeMixin(
      // basic functionality
      QowtElement,
      AddBrIfNeeded,

      // and finally our own api
      api_);
});
