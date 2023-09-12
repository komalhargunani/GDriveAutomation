define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
    MixinUtils,
    DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['sbt'],

    observers: [
      'sbtChanged_(model.sbt)'
    ],

    get sbt() {
      return (this.model && this.model.sbt);
    },

    set sbt(value) {
      this.setInModel_('sbt', value);
    },

    sbtChanged_: function(current) {
      // NOTE: we do not support even/odd page section breaks;
      // we treat them as "next page" breaks.
      // TODO(jliebrand): the test document has all types, but
      // i only ever see "cp", "ep", "none" and undefined come
      // up... that doesn't sound right. Judging from old code
      // the "none" represents a continuous break; but that sounds
      // odd wrt "cp"...
      // Also: section breaks are BEFORE their content; so it's a bit
      // unclear how to deal with them as a parent of content?? Especially
      // looking at the test doc, it doesn't look right.
      // For now we have to
      // use a mixture by only breaking on not "none", EXCEPT the
      // very first section... this is not right! need to chase this!
      if (current) {
        var allSections = document.querySelectorAll('qowt-section');
        if (allSections.length > 0 && current !== 'none') {
          this.setAttribute('break-before', '');
        }
      }
    },

    computedDecorations_: {
      sbt: function() {
        return (this.model && this.model.sbt);
      }
    }

  });

  return api_;

});
