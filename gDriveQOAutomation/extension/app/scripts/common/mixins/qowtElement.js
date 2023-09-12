/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base mixin module for all our custom elements.
 * Provides some generic functions so that all our elements
 * can use them without having to check if they support said
 * functions.
 *
 * Note: this is a mixin rather than a base element to avoid
 * problematic double inheritance issues on our elements.
 *
 * Note: NEVER use this module on it's own; it's not intended
 * as a singleton (which is how it would act if used directly).
 * As noted above, it's intended to be used as a mixin!
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/widgets/factory',

  'third_party/lo-dash/lo-dash.min',
  'qowtRoot/third_party/mutationSummary/mutation_summary'
  ], function(
    MixinUtils,
    ArrayUtils,
    WidgetFactory

  /* lo-dash provides utility methods on the global '_' object */
  /* Mutation summary library */
  ) {

  "use strict";

  return {

    /**
     * Simple boolean to make it easy for code to identify
     * our qowt custom elements
     */
    isQowtElement: true,

    properties: {
      isQowtElement: {
        type: Boolean,
        value: true
      },
      model: {
        type: 'Object',
        value: function() {
          return {etp: this.etp};
        }
      }
    },

    /**
     * Simple array of strings to outline what type of
     * actions and other behaviours the element supports
     * NOTE: merging mixins will ensure these arrays are
     * concatenated; but once the element is created, we
     * make a clone of the array, so that it is mutable
     * per element!
     */
    supports_: [],

    // NOTE(elqursh): This was removed from Polymer 1.0. Adding here to minimize
    //                code changes.
    /**
     * Register a one-time callback when a child-list or sub-tree mutation
     * occurs on node.
     *
     * For persistent callbacks, call onMutation from your listener.
     *
     * @method onMutation
     * @param Node {Node} node Node to watch for mutations.
     * @param Function {Function} listener Function to call on mutation.
     *     The function is invoked as `listener.call(this, observer, mutations);
     *     ` where `observer` is the MutationObserver that triggered the
     *     notification, and `mutations` is the native mutation list.
     */
    onMutation: function(node, listener) {
      var observer = new MutationObserver(function(mutations) {
        listener.call(this, observer, mutations);
        observer.disconnect();
      }.bind(this));
      observer.observe(node, {childList: true, subtree: true});
    },

    /**
     * Custom element lifecycle callback; this is called when
     * an element instance is created. Since this is a mixin, the
     * actual elements can override this callback but they must
     * ensure they basecall this mixin function, eg:
     *
     *   MyElement: {
     *     created: function() {
     *       QowtElement.created.call(this);
     *       ...
     *       // do whatever
     *     }
     *   ...
     *   }
     *
     *
     * @param {boolean} name argument for x y z
     */
    created: function() {
      // make sure our supportedActions array is unique
      // per _instance_ of our element!
      this.supports_ = _.cloneDeep(this.supports_);
    },


    /**
     * Query function to determine if the element
     * supports a specific behaviour/action
     *
     * @param {String} behaviour either a string or an array of strings to check
     * @return {boolean} returns true if the elements supports the requested
     *                   actions/behaviours
     */
    supports: function(behaviour) {
      behaviour = behaviour || [];

      if (!(_.isArray(behaviour))) {
        behaviour = [behaviour];
      }

      return (ArrayUtils.subset(behaviour, this.supports_));
    },

    /**
     * Set the eid property on this element. This will ensure
     * the 'qowt-eid' attribute is set, as well as the 'id' and
     * it will also update the eid in this.model.
     * NOTE: one should only ever call this on a REAL element, not
     * on one of the nodes within the flow. Ie only on the flowStart element!
     *
     * @param {string} eid the eid for the element.
     */
    setEid: function(eid) {
      this.setAttribute('qowt-eid', eid);
      this.id = eid;
      this.model.eid = eid;
    },

    /**
     * Return this elements eid
     *
     * @return {string} the core element id
     */
    getEid: function() {
      return this.model.eid;
    },

    /**
     * Set the (formatting) model for this element. This function
     * has a little bit of sugar to ignore any 'elm' properties
     * on the object being passed in. This makes it easier to call
     * setModel using the dcp.el object received in the dcp handlers.
     *
     * It makes a deep clone of the object passed in.
     *
     * @param {Object} model object containing all model properties
     */
    setModel: function(model) {
      // Note: Used MixinUtils.mergeMixin over _.merge for efficiency.
      var newModel = MixinUtils.mergeMixin(_.omit(model, 'elm'),
          _.omit(this.model, 'data'));

      // Note(elqursh): In Polymer 1.0 only the observer at the current level
      // is invoked. Example this.model = .. will only invoke the observers for
      // model and none of the nested properties. Here artificially enable
      // invocation of the properties.
      function setDeep(path, properties) {
        // Some elements listen to this.model.someProperty (say level 0)
        // and others listen to this.model.someProperty.itsSubProperty (say
        // level 1; a leaf). While setting deep we set both, so that elements
        // listening at level 0 and level 1 are invoked.
        // TODO(umesh.kadam): check if it is possible to refactor elements to
        // listen to either leaf property or the parent property and not both.
        // Refer listItem.js and paragraphBackground.js for discrepancy
        this.set(path, properties);
        if (_.isPlainObject(properties)) {
          for (var key in properties) {
            path.push(key);
            setDeep.call(this, path, properties[key]);
            path.pop();
          }
        }
      }

      for (var key in newModel) {
        setDeep.call(this, ['model', key], newModel[key]);
      }
    },

    /**
     * Sugar function to determine if the element is empty. This is
     * used by various parts of the code base to make decisions during
     * edit. Some elements may wish to override this function with
     * their own custom implementation.
     *
     * @return {boolean} returns true if the element is "empty"
     */
    isEmpty: function() {
      if (['A','P'].includes(this.nodeName)) {
        return (this.children.length === 0);
      }
      return (Polymer.dom(this).children.length === 0);
    },

    /**
     * Clone this element. Does not clone the children, and resets
     * the ID of the clone. Ensures the model is cloned (minus eid)
     * so that the clone will have the same style and formatting model
     * as the original.
     * You MUST base call this function if you are overriding it, or
     * at least make sure you set the right variables. Since ContentEditable
     * clones nodes differently on linux vs mac, it is imperative that we
     * can distinguish how the new node was cloned. Thus this function
     * sets the rather quirky .__clonedByQowt flag...
     * See the TextTool's newElement cleaner for more details.
     *
     * @return {HTMLElement} cloned copy
     */
    cloneMe: function(opt_import) {
      // override if needed - but be sure to base call!
      var clone = opt_import ? document.importNode(this, false) :
         this.cloneNode(false);

      /**
       * In shady DOM, cloneNode is cloning all the children which results
       * in having duplicate elements after cloning the node. Hence, removing
       * childNodes explicitly from the cloned node.
       */
      if(clone && clone.hasChildNodes()){
        while(clone.firstChild) {
          clone.removeChild(clone.firstChild);
        }
      }
      if (clone.is === 'qowt-word-para') {
        var listType = this.getAttribute('qowt-list-type');
        if (listType === 'b' || listType === 'n') {
          clone.className = clone.className.replace(
            /[\s]qowt-word-para-[\d]+/g, '');
        }
      }
      clone.setModel(this.model);
      clone.removeAttribute('id');
      clone.removeAttribute('qowt-eid');
      delete clone.model.eid;

      // IMPORTANT! See newElement.js cleaner in TextTool for more info
      clone.__clonedByQowt = true;
      return clone;
    },


    /**
     * Helper function to guarantee properties are available.
     * Helps to keep code DRY, instead of:
     *
     *  this.model = this.model || {};
     *  this.model.something = this.model.something || {};
     *  this.model.something.else = this.model.something.else || {};
     *
     * simply do:
     *
     *  this.guaranteeProps_('model.something.else');
     *
     * @param {String} strRep string representation of the properties
     * @param {String} opt_type either 'object' or 'array' to dictate what
     *                 the ultimate property in the strRep should be
     * @param {Object} returns a reference to the object represented by strRep
     *                 in the above example it would return a reference to
     *                 this.model.something.else
     */
    guaranteeProps_: function(strRep, opt_type) {
      opt_type = opt_type || 'object';
      var prop;
      var props = strRep.split('.');
      var iter = this;
      while ((prop = props.shift())) {
        if (opt_type === 'array') {
          iter[prop] = iter[prop] || [];
        } else {
          iter[prop] = iter[prop] || {};
        }
        iter = iter[prop];
      }
      return iter;
    },


    /**
     * Backward compatible function. For widgets, one can request
     * the actual html node to be returned. Now that we are
     * mixing widgets and elements (until we deprecate and remove
     * ALL use of widgets), we need to ensure elements have a similar
     * API to widgets. So for this we simply return ourselves
     * TODO(jliebrand): remove this once we have transitioned all widgets
     * to polymer elements
     */
    getWidgetElement: function() {
      return this;
    },

    /**
     * See comment on getWidgetElement() above.
     * TODO(jliebrand): remove this once we have transitioned all widgets
     * to polymer elements
     */
    getNode: function() {
      return this;
    },

    /**
     * Return either the element at the given offset, or if
     * said element is not a QowtElement, then attempt to
     * create a widget around that element. This is mainly for
     * backward compatibily with old legacy code. New code should
     * simply use el.children[offset] (once all legacy widgets have
     * been changed to polymer elements)
     * TODO(jliebrand): remove this once we have no more legacy widgets
     *
     * @param {Number} offset the offset within this elements children
     */
    getContentWidget: function(offset) {
      var el = this.children[offset];
      if (el && !el.isQowtElement) {
        el = WidgetFactory.create({
          fromNode: el,
          strict: true
        });
      }
      return el;
    }

  };
});
