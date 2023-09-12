/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview small utility module to provide
 * a mixin function so that we can easily extend
 * element behaviour by mixing in various auxilary
 * behaviours to element APIs.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define(['third_party/lo-dash/lo-dash.min'], function() {

  'use strict';

  var api_ = {

    /**
     * Utility function to merge a mixin in to a given API.
     * It special cases array properties by concatenating the two. This
     * allows one module to have for example
     *   this.supports_ = ['someBehaviour']
     *   BehaviourX.supports_ = ['behaviourX']
     *
     * Which will then result in:
     *   this.supports_ = ['someBehaviour', 'behaviourX']
     *
     * Similarly if the mixin has an object, it too will be "merged",
     * thereby enabling each mixin to have it's own "observe" object
     * and ensure all observed properties will be accurately watched.
     *
     * usage:
     * var proto = MixinUtils.mergeMixin(BaseBehaviour, OtherBehaviour, api_);
     *
     * @param {[object]} pass in as many mixins (Objects) as you like, with
     *                   your own API being the last one. Subsequent sources
     *                   will overwrite property assignments of previous
     *                   sources; except for arrays which will get concatenated
     */
    mergeMixin: function() {
      var newApi = {};
      var mainArguments = Array.prototype.slice.call(arguments);

      for (var i = 0; i < mainArguments.length; i++) {
        var mixin = mainArguments[i];
        for (var prop in mixin) {
          if (_.isArray(mixin[prop])) {
            var existingArray = newApi[prop] || [];
            // To avoid duplication, merge only those prop values which are not
            // present in existingArray
            newApi[prop] = existingArray.concat(mixin[prop].filter(
                function(item) {
                  return existingArray.indexOf(item) < 0;
                }));
          } else if (_.isPlainObject(mixin[prop])) {
            newApi[prop] = api_.mergeMixin(newApi[prop] || {}, mixin[prop]);
          } else {
            var def = Object.getOwnPropertyDescriptor(mixin, prop);
            Object.defineProperty(newApi, prop, def);
          }
        }
      }
      return newApi;
    }

  };
  return api_;
});