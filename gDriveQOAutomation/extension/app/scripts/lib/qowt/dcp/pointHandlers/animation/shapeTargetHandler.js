// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the handler for a Shape Target node.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/controls/point/animation/animationManager'
], function(AnimationManager) {

  'use strict';

  /**
   * @private
   * Animation object.
   */
  var _animationBuilder;

  /**
   * Public interface
   */
  var _api = {

    /**
     * DCP Type Code.
     * This is used by the DCP Manager to register this handler.
     */
    etp: 'spTgt',

    /**
     * Processes a 'spTgt' (Shape Target node) element from a DCP response.
     *
     * @param {object} v A cTn element from a DCP response.
     * @return {object} An animation object.
     */
    visit: function(v) {

      _animationBuilder = AnimationManager.getCurrentAnimationBuilder();

      if (v && v.el && v.el.etp && (v.el.etp === _api.etp) && v.el.spid &&
        _animationBuilder) {

        // Add the slide id prefix to the shape ID
        _animationBuilder.setAnimationShapeId(v.el.spid);

        //set the txEl if animate by paragraph
        if (v.el.txEl) {
          _animationBuilder.setAnimatedTxElm(v.el.txEl);
        }

        //set the animBg if shape background animated.
        if (v.el.bg && v.el.bg === true) {
          _animationBuilder.setAnimBg(v.el.bg);
        }
      }
    }
  };

  return _api;
});
