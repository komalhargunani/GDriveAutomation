/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base mixin for decorators
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define(['third_party/lo-dash/lo-dash.min'], function() {

  'use strict';

  return {

    /**
     * Decorate the element given some formatting properties. By
     * default this will ensure the elements model is updated, but
     * any css changes will happen in the next micro task, unless
     * synchronously boolean is passed.
     * Note: will decorate the entire flow this element is part of
     *
     * @param {Object} properties the formatting properties. Should adhere to
     *                            dcp schemas
     * @param {boolean} synchronously boolean to indicate the actual css changes
     *                                should be applied synchronously within
     *                                this js turn rather than in a next
     *                                micro task
     */
    decorate: function(properties, synchronously) {
      var changedElements = [];
      for (var key in properties) {

        if (this.supports([key])) {
          // make sure we decorate the entire flow
          var iter = (this.supports && this.supports('flow')) ?
              this.flowStart() : this;

          while (iter) {
            // set the formatting property; eg this.jus = 'C'
            iter[key] = properties[key];
            changedElements.push(iter);
            iter = iter.flowInto;
          }
        }

        if (this.nodeName === 'P' && ['bld', 'itl', 'udl','str'].includes(key))
        {
          var qowtFormat = JSON.parse(this.getAttribute('qowt-format'));
          qowtFormat = qowtFormat || {};
          if (properties[key]) {
            qowtFormat[key] = properties[key];
          } else if (qowtFormat.hasOwnProperty(key)) {
            delete qowtFormat[key];
          }
          this.setAttribute('qowt-format', JSON.stringify(qowtFormat));
        }

      }
      if (synchronously && changedElements.length > 0) {
        for (var i = 0; i < changedElements.length; i++) {
          // we do not want to send dcp, so remove any dcpCache we
          // may have accumulated during the decorate
          // TODO(jliebrand): remove this once we fix http://crbug/404135
          delete changedElements[i].dcpCache;
        }
      }
    },

    /**
     * Uses window.getComputedStyle and all the mixed in decorators to
     * return a computed decorations object, which basically takes the
     * same format as the dcp schema used to decorate the element.
     * Note: these are thus not the styling of THIS element, but rather
     * the computed styling of this element based on cascaded styles from
     * it's parents. This can be used to determine set the state of
     * toolbar buttons to reflect things like bold, italic and underline etc
     *
     * @return {Ojbect} returns the object with the decorations for this element
     */
    getComputedDecorations: function() {
      var computedStyles = window.getComputedStyle(this);
      var decorations = {};
      for(var prop in this.computedDecorations_) {
        var propFunc = this.computedDecorations_[prop];
        decorations[prop] = propFunc.call(this, computedStyles);
      }
      return decorations;
    },

    // ------------------------- PRIVATE ---------------------------

    computedDecorations_: {},

    // usage: this.setInModel_('rpr.bld', value, [true, false]);
    setInModel_: function(posString, value, supportedValues) {
      // HACK: ultimately we should just be able to set/delete
      // properties in our model. The model changed observers
      // will be called correctly upon any change. However, since
      // we also need to have this hackDcpCache, we need to know HERE
      // if we actually made a change to the model... We can remove this
      // once http://crbug/404135 is resolved
      var modelCache = _.cloneDeep(this.model);

      var modelPosString = 'model.' + posString;
      var breadcrumb = modelPosString.split('.');
      var prop = breadcrumb.pop();
      var obj = this.guaranteeProps_(breadcrumb.join('.'));

      if (supportedValues && supportedValues.indexOf(value) === -1) {
        value = undefined;
      }

      if (value !== undefined) {
        //obj[prop] = value;
        // Note: Polymer 1.0 requires using this.set to enable observers
        // See: https://www.polymer-project.org/1.0/docs/devguide/
        //      data-binding.html#property-notification
        this.set(modelPosString, value);
      } else {
        // Note(elqursh): Enables notification by setting to undefined
        this.set(modelPosString, undefined);
        delete obj[prop];

        // if our parent object has become empty, delete it
        // Do not delete model itself
        while (obj && _.isEmpty(obj) && breadcrumb.length > 1) {
          // TODO(elqursh): Should we not notify the parents ?
          this.set(breadcrumb, undefined);

          prop = breadcrumb.pop();
          obj = this.guaranteeProps_(breadcrumb.join('.'));
          delete obj[prop];
        }
      }

      // Core doesn't support sending an entire model as a formatElement
      // payload. So for now we hack around this and keep track of
      // only the formatting changes, and send those.
      // TODO(jliebrand): remove once http://crbug/404135 is fixed
      if (!_.isEqual(modelCache, this.model)) {
        this.hackDcpCache_(posString, value);
      }
    },


    // TODO(jliebrand): once we fix http://crbug/404135,
    // we will no longer need this dcpCache
    // usage: this.hackDcpCache_('rpr.bld', value);
    hackDcpCache_: function(posString, value) {
      var prefix = (value !== undefined ? 'dcpCache.' : 'dcpCache.del_');
      posString = prefix + posString;

      var breadcrumb = posString.split('.');
      var prop = breadcrumb.pop();
      var obj = this.guaranteeProps_(breadcrumb.join('.'),
          value !== undefined ? 'object' : 'array');

      if (value !== undefined) {
        // add the value to the dcp cache
        obj[prop] = value;
      } else {
        // or push it on to our delete array
        obj.push(prop);
      }
    }

  };

});
