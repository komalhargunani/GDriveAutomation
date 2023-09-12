 // TODO(jliebrand): rename dcp properties to something readable in dcp schema,
 // core and everywhere else (eg toolbar buttons, these observe functions etc)
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['shw'],

    observers: [
      'shwChanged_(model.rpr.shw)'
    ],

    get shw() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.shw);
    },

    set shw(value) {
      this.setInModel_('rpr.shw', value, [true, false]);
    },

    shwChanged_: function(current) {
      if (current) {
        this.classList.add(kCLASS_NAME_);
      } else {
        this.classList.remove(kCLASS_NAME_);
      }
    },

    computedDecorations_: {
      shw: function(/* computedStyles */) {
        // TODO(jliebrand): Some formatting is applied using a className,
        // this is fine for direct formatting but does not allow us to
        // determine formatting applied by styles.
        // For now this does not matter as the only clients of this
        // function are toolbar buttons.
        return this.classList.contains(kCLASS_NAME_);
      }
    }

  });

  var kCLASS_NAME_ = 'shadowText';

  return api_;
});
