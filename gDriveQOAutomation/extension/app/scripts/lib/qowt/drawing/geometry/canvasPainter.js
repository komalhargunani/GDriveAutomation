/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/drawing/geometry/arrowPathGenerator',
  'qowtRoot/drawing/geometry/canvasPathExecutor'
], function(ArrowPathGenerator, CanvasPathExecutor) {

  'use strict';

  var _arrowPathGenerator;

  var _api = {

    /**
     * perform canvas draw operations
     * @param canvas shape-canvas
     * @param paths path lists for canvas to draw
     * @param fillColorBean bean containing shape-fill and outline-fill color
     *                      properties
     * @param effectsBean shadow effect JSON
     */
    paintCanvas: function(canvas, paths, fillColorBean, effectsBean) {
      var context = canvas.getContext("2d");

      //translate is used to shift shape from canvas origin
      // Translate canvas toward positive x and y with half of line width,
      // so that complete line width is shown up on canvas
      if (fillColorBean.outlineFill.lineWidth) {
        context.translate(fillColorBean.outlineFill.lineWidth / 2,
          fillColorBean.outlineFill.lineWidth / 2);
      }

      if (fillColorBean.outlineFill.lineWidth !== undefined) {
        context.lineWidth = fillColorBean.outlineFill.lineWidth;
      }

      // for adding paths of arrowheads
      if (fillColorBean.ends && (fillColorBean.ends.headendtype !== 'none' ||
        fillColorBean.ends.tailendtype !== 'none') && paths !== undefined) {
        if (!_arrowPathGenerator) {
          _arrowPathGenerator = ArrowPathGenerator;
        }
        _arrowPathGenerator.handle(fillColorBean, paths);
      }
      // in case of solid line or dashed line, we always first draw the normal
      // paths and stroke.
      var pathExecutor = CanvasPathExecutor;
      pathExecutor.drawPathsOnContext(paths, context, fillColorBean, canvas,
          effectsBean);
    }
  };

  return _api;
});
