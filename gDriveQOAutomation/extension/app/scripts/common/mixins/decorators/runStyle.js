/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview element decorator mixin
 *
 * TODO(jliebrand): once core supports .formatting rather than .ppr and .rpr
 * we can have one generic style decorator, rather than one per object which
 * we need today because we have ppr.stl, rpr.stl
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/decoratorBase'], function(
  MixinUtils,
  DecoratorBase) {

  'use strict';

  var api_ = MixinUtils.mergeMixin(DecoratorBase, {

    supports_: ['runStyleId'],

    observers: [
      'runStyleIdChanged_(model.rpr.runStyleId)'
    ],

    get runStyleId() {
      return (this.model &&
              this.model.rpr &&
              this.model.rpr.runStyleId);
    },

    set runStyleId(value) {
      this.setInModel_('rpr.runStyleId', value);
    },

    runStyleIdChanged_: function(current) {
      var officeStyles = document.getElementById('qowtOfficeStyles');
      if (officeStyles) {
        if (this.previousRunStyleId_) {
          var previousCss = officeStyles.getCssClassName(
              this.previousRunStyleId_);
          this.classList.remove(previousCss);
        }
        if (current) {
          var newCss = officeStyles.getCssClassName(current);
          this.classList.add(newCss);
        }
      }
      this.previousRunStyleId_ = current;
    },

    // NOTE: does not us the computedStyles object
    // because at the moment we only support an element having one
    // style; ie it doesn't inherit
    computedDecorations_: {
      runStyleId: function(/* computedStyles */) {
        return this.model.rpr && this.model.rpr.runStyleId;
      }
    }

  });

  return api_;

});
