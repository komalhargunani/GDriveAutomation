/**
 * @fileOverview This file acts as handler for Drawing
 * @author <a href="mailto:alok.guha@quickoffice.com">Alok Guha</a>
 */
define([
    'qowtRoot/widgets/document/drawing',
    'qowtRoot/dcp/decorators/drawingDecorator',
    'qowtRoot/dcp/decorators/drawingAnchorDecorator'
],
    function (Drawing, DrawingDecorator, DrawingAnchorDecorator) {

  'use strict';

        var _api = {
            /**
             * DCP Type Code is used by the DCP Manager to register this
             * handler.
             */
            'etp':'drw',

            /**
             * This is the main Handler function that processes DCP
             * @param dcp {Object} Arbitrary DCP
             * @return {Element || undefined}
             */

            visit:function (dcp){
                var drawingWidget, drawingElement, shapeProperties;
                if (dcp.el.etp !== 'drw' || dcp.el.eid === undefined) {
                    return undefined;
                }
                drawingWidget = Drawing.create(dcp.el);
                drawingElement = drawingWidget.getWidgetElement();
                if (dcp.el.elm[0]) {
                  shapeProperties = dcp.el.elm[0].spPr;
                  DrawingDecorator.decorate(drawingElement, shapeProperties);
                }


                if (dcp.el.wst ) {
                  DrawingAnchorDecorator.decorate(drawingElement, dcp);
                }

                Polymer.dom(dcp.node).appendChild(drawingElement);
                Polymer.dom(dcp.node).flush();  
                return drawingElement;
            },

            /**
             * After getting rotated object, must adjust rotated object with
             * container div, so drawing object can be well aligned.
             * @public
             * @param dcp
             */
            postTraverse:function (dcp) {
                if (dcp && dcp.el.elm && dcp.el.elm[0] && dcp.el.elm[0].spPr &&
                      dcp.el.elm[0].spPr.xfrm.rot &&
                  dcp.el.elm[0].spPr.xfrm.rot !== 0) {
                    DrawingDecorator.adjustImageWithContainerArea(dcp);
                }
            }
        };

        return _api;
    });
