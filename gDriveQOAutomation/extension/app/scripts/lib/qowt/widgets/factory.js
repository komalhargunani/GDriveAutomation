// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview Abstract widget factory;
 * Widget factories register themselves with this abstract factory.
 * This abstract factory can then create an instance of a widget based on a
 * configuration object passed into the create function. The configuration
 * object details the requirements for the widget, this factory will interrogate
 * each registered widget factory to determine which it should use to produce
 * the widget that fulfils the requested configuration.
 *
 * @author dtilley@google.com (Dan Tilley)
 * @author jliebrand@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/typeUtils'], function(
    TypeUtils) {

  'use strict';

  var api_ = {

    /**
     * Register a widget factory with this factory.
     *
     * @param {Object} widget The widget factory,
     *        API should include create & confidence methods.
     */
    register: function(widget) {
      // Only register the widget if it has the correct API.
      if (widget && widget.create && widget.confidence) {
        widgets_.push(widget);
        if (widget.type) {
          widgetsByType_[widget.type] = widget;
        }
      } else {
        console.warn('Attempt to register a widget that does not ' +
            'support confidence');
      }
    },

    /**
     * Unregister all widgets.
     * Note: Used only for unit tests.
     */
    unregisterWidgets: function() {
      widgets_ = [];
      widgetsByType_ = {};
    },


    /**
     * DEPRECATED!!!! Only use for legacy widgets. For polymer-elements
     * just create the element you need, or use .find above
     *
     * Create a new widget instance based on the given config object.
     *
     * @param config {object} configuration object, can consist of:
     *        config.fromNode {HTML Element} construct widget module from an
     *               existing fromNode
     *        config.fromId {String} construct widget module from an existing
     *               node id
     *        config.supportedActions {Array} a list of actions the widget must
     *               support
     *               TODO: Initially this is just string data but we should
     *                     upgrade this at some point to handle maintenance
     *                     better and possibly tie into actions
     *        config.strict {Boolean} If true this function will only create
     *               widgets if the match the config exactly, ie. return a
     *               confidence score of 100
     *        config.type {string} construct a new widget based on type
     *               (eg 'button')
     */
    create: function(config) {
      /**
       * TODO: Find a way to remove this code ASAP
       * Jelte: Perhaps when sheet move to using the generic selection manager
       *
       * NOTE: This is ugly but until we harmonize how the widgets are
       * created, we have to hardcode the ugly stuff somewhere.
       */
      if (config && config.contentType === "text" && config.startContainer) {
        config.fromNode = config.startContainer;
      }
      else if (config && config.newSelection &&
          config.newSelection.contentType === "sheetCell") {
        config.anchor = config.newSelection.anchor;
      }
      else if (config && config.newSelection &&
        config.newSelection.contentType === "sheetText") {
        // A text editor is in use - we want the cell that is being edited.
        if (config.oldSelection &&
            config.oldSelection.contentType === "sheetCell") {
          config.anchor = config.oldSelection.anchor;
        }
      }

      /*
       * Config's coming from the app toolbar config files may specify custom
       * elements. This is indicated by the presence of the 'is' property.
       * For these we just create new custom elements of the correct type.
       * The c'tors are stored in the window object, and named after the
       * config.is property, in the QOWT namespace.
       */
      // TODO(dskelton) Ideally we'd just create the custom element directly
      // in the app toolbar config. However, we've not got that working across
      // all apps yet - constructing within the require inclusion phase proves
      // to be awkward.
      if (config && config.is) {
        if (!TypeUtils.isFunction(window[config.is])) {
          throw new Error('Widget factory cannot create custom element.' +
              'Constructor is not a function.');
        }
        return new window[config.is]();
      }

      /**
       * Heuristics;
       * The goal is to determine which factory to use to create a widget that
       * fulfils the config object requirements.
       *
       * To do this we loop through the list of registered widget factories and
       * ask each one if they can create a widget for the supplied config.
       *
       * Widgets provide the "confidence" function which returns an integer
       * score which indicates the likelihood that it is the correct
       * widget, which is determined by how closely the widget matches the node
       * and if it implements all the actions in the config object.
       *
       * A confidence score of 100 is positive and a score of 0 is negative,
       * we will construct the widget using the factory that returns the highest
       * score.
       *
       * Note: How likely is it there will be a duplicated highest score?
       *       Is there any way we can ensure it doesn't happen?
       *
       * Note: Because we call the confidence function for each registered
       * widget factory in a loop it needs to be an efficient function, the
       * performance of this function should be kept in mind.
       */
      if (config) {
        if (widgets_.length) {
          var highScore = 0,
              highScoreWidget,
              countWidgets,
              numWidgets = widgets_.length;
          if (config.strict) {
            highScore = 99;
            // This is a performance optimization for any widget that
            // implements maxDomTraversal in the confidence method.
            config.maxDomTraversal = 0;
          }
          for (countWidgets = 0; countWidgets < numWidgets; countWidgets++) {
            var widget = widgets_[countWidgets],
                thisWidgetScore = widget.confidence(config);
            if (thisWidgetScore > highScore) {
              highScore = thisWidgetScore;
              highScoreWidget = widget;
            }
          }
          if (highScoreWidget && highScoreWidget.create) {
            return highScoreWidget.create(config);
          }
        }
      }
    },

    /**
     * Utility to ensure we can always get an id, even we have to fallback to
     * less robust means. This will reduce the amount of copy/pasted client
     * code around the code base.
     *
     * @param {Object} widget The widget instance to query.
     * @return {String} An identifier that should be meaningful to the Core.
     *                  First try the widget's own getEid() method;
     *                  if not, try the 'qowt-eid' attribute directly;
     *                  if not, just take the node id.
     */
    getEid: function(widget) {
      var eid, el;
      if (widget) {
        if (widget.getEid) {
          eid = widget.getEid();
        } else {
          if (widget.getWidgetElement) {
            el = widget.getWidgetElement();
            eid = el.getAttribute('qowt-eid');
            if (!eid) {
              eid = el.id;
            }
          }
        }
      }
      return eid;
    },

    /**
     * Check a variable is a widget object,
     * optionally check if the widget matches a specific type.
     * @param {*} widget The variable to check.
     * @param {String} opt_type A widget type to check.
     *        Note: Using a type filter assumes the widget API
     *        includes a name property.
     * @return {Boolean}
     */
    isWidgetType: function(widget, opt_type) {
      var match = false;
      if (widget && TypeUtils.isObject(widget)) {
        if (opt_type) {
          match = filterWidget_(widget, opt_type);
        } else {
          match = true;
        }
      }
      return match;
    }

  };

  // PRIVATE ===================================================================

  var widgets_ = [],
      widgetsByType_ = {};

  function filterWidget_(widget, filter) {
    return (widgetsByType_[filter] &&
            widget.type === widgetsByType_[filter].type);
  }

  return api_;

});
