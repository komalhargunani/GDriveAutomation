/**
 * Handler for Smart Art' Shape (etp: dsp)
 * @constructor
 */
define([
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'third_party/lo-dash/lo-dash.min'
], function(ShapeHandler) {

  'use strict';

  var textShapeDcp_;

  var api_ = {

    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'dsp',

    /**
     * Render a Drawing Shape element from DCP
     * @param {object} dcp Shape DCP JSON
     * @return {HTMLElement} shape div
     */
    visit: function(dcp) {
      var smartArtShapeDiv;

      if (dcp && dcp.el && dcp.el.etp && dcp.el.etp === api_.etp &&
          dcp.el.eid) {
        // make shape clone for rendering the text and outline
        textShapeDcp_ = _.cloneDeep(dcp);
        textShapeDcp_.el.etp = 'sp';

        // if there are text transformations, create and separate shape for
        // outline
        if (dcp.el.txXfrm) {
          var outlineShapeDcp = _.cloneDeep(dcp);
          outlineShapeDcp.el.etp = 'sp';
          outlineShapeDcp.el.eid += '-outline';

          // Removing the irrelevant properties from text body's shape
          textShapeDcp_.el.spPr = {
            xfrm: _.cloneDeep(dcp.el.txXfrm) || textShapeDcp_.el.spPr.xfrm
          };
          // Remove outline from text shape.
          textShapeDcp_.el.spPr.ln = {fill: {type: 'noFill'}};


          // Re-orient textShape rotations which are relative to shape but where
          // it should be relative to graphic frame
          var shapeRotation = dcp.el.spPr.xfrm.rot || 0;
          var textbodyRotation = (dcp.el.txXfrm && dcp.el.txXfrm.rot) || 0;
          textShapeDcp_.el.spPr.xfrm.rot = shapeRotation + textbodyRotation;

          ShapeHandler.visit(outlineShapeDcp);
          ShapeHandler.postTraverse(outlineShapeDcp);
        }

        smartArtShapeDiv = ShapeHandler.visit(textShapeDcp_);
      }

      return smartArtShapeDiv;
    },

    /**
     * Invoked after all the children of the dcp gets visited
     */
    postTraverse: function() {
      ShapeHandler.postTraverse(textShapeDcp_);
    }
  };

  return api_;
});
