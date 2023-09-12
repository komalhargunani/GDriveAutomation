define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/tools/toolsManifest'], function(
  PubSub,
  TypeUtils,
  ToolManifest) {

  'use strict';


  var activeTool_,
      tools_ = {},
      toolActivateToken_,
      toolDeactivateToken_;


  /** @constructor */
  var ToolManager = Object.create(Object.prototype, {
    initialized: { get: function() { return initialized_; }},
    activeTool:  { get: function() { return activeTool_; }}
  });
  ToolManager.removeActiveTool = removeActiveTool_;
  ToolManager.setActiveTool = setActiveTool_;


  /** @private */
  function removeActiveTool_() {
    if (activeTool_ && tools_[activeTool_].hasOwnProperty('deactivate')) {
      tools_[activeTool_].deactivate();
    }
    activeTool_ = undefined;
  }


  /** @private */
  function setActiveTool_(toolName, prms) {
    var tool = tools_[toolName];
    if (!toolName || !tool) {
      ToolManager.removeActiveTool();
    } else {
      if (activeTool_ === toolName) {

        // If the tool is the same as the last one and supports reactivation,
        // reactivate.
        if (tool.supportsReactivation) {
          tool.activate.apply(this, prms);
        }
      } else {

        // If the tool is different, activate a new tool.
        ToolManager.removeActiveTool();
        activeTool_ = toolName;
        if (tool.activate) {
          tool.activate.apply(this, prms);
        }
      }
    }
  }


  /**
   * @private
   * Callback function for qowt:tool:requestActivate events. This event is
   * published in selection manager and sheet selection manager.
   * @param eventType The name of the event received
   * @param eventData The data associated with the signal
   */
  var handleToolActivate_ = function(eventType, eventData) {
    eventType = eventType || '';
    setActiveTool_(eventData.contentType, [eventData]);
  };


  /**
   * @private
   * Callback function for qowt:tool:requestDeactivate events. This event is
   * published in selection manager and sheet selection manager.
   * @param eventType The name of the event received
   * @param eventData The data associated with the signal
   */
  var handleToolDeactivate_ = function(/* eventType, eventData */) {
    removeActiveTool_();
  };


  /**
   * Triggered by qowt:init signals
   * Initialize the module.
   */
  var initialized_ = false;
  function init_() {
    if (!initialized_) {
      tools_ = ToolManifest.getTools();
      Object.keys(tools_).forEach(function(toolName) {
        var tool = tools_[toolName];
        if (tool && tool.init && TypeUtils.isFunction(tool.init)) {
          tool.init();
        }
      });
      toolActivateToken_ = PubSub.subscribe(
          'qowt:tool:requestActivate', handleToolActivate_);
      toolDeactivateToken_ = PubSub.subscribe(
          'qowt:tool:requestDeactivate', handleToolDeactivate_);
      initialized_ = true;
    }
  }


  /**
   * Triggered by qowt:disable signals
   * Should remove all subscribers & event listeners,
   * and reset all internal state.
   */
  function disable_() {
    removeActiveTool_();
    Object.keys(tools_).forEach(function(tool) {
      if (tools_[tool].disable &&
          TypeUtils.isFunction(tools_[tool].disable)) {
        tools_[tool].disable();
      }
    });
    PubSub.unsubscribe(toolActivateToken_);
    PubSub.unsubscribe(toolDeactivateToken_);
    initialized_ = false;
  }


  /**
   * Triggered by qowt:destroy signals, should remove all nodes and deconstruct
   * any dependencies
   */
  function destroy_() {
    Object.keys(tools_).forEach(function(tool) {
      if (tools_[tool].destroy &&
          TypeUtils.isFunction(tools_[tool].destroy)) {
        tools_[tool].destroy();
      }
    });
    tools_ = {};
  }


  // ONLOAD
  // ------
  // Singletons should NOT execute any code onLoad except subscribe to
  // qowt:init qowt:disable or qowt:destroy
  (function() {
    PubSub.subscribe('qowt:init', init_);
    PubSub.subscribe('qowt:disable', disable_);
    PubSub.subscribe('qowt:destroy', destroy_);
  })();

  return ToolManager;

});
