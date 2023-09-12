define([
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/utils/objectUtils'
], function(QOWTMarkerUtils,
            Transform2DHandler,
            LayoutsManager,
            ObjectUtils) {

  'use strict';

  var _factory = {

    create: function() {

      var module = function() {

        var _objectUtils = new ObjectUtils();
        var _graphicFrameObjectsMap = {
          'cht': 'charts'
        };

        /**
         * Re-evaluates the shape-extent by the group scale factor
         * @param {Object} shapeTransformExtents Shape extent
         * @param {Object} groupShapePropertiesBean Group properties
         * @private
         */
        var _reEvaluateExtent = function(shapeTransformExtents,
                                         groupShapePropertiesBean) {
          if (groupShapePropertiesBean) {
            shapeTransformExtents.cx *= groupShapePropertiesBean.scale.x;
            shapeTransformExtents.cy *= groupShapePropertiesBean.scale.y;
          }
        };

        /**
         * Returns the containing graphic object type in the graphic-frame.
         * @param {Array} elementArr - array of containing 'elm' (elements).
         * @return {String} element-type (etp)
         * @private
         */
        var _getContainingGraphicObjectType = function(elementArr) {
          var graphicObjectType;

          elementArr.forEach(function(element) {
            if (_graphicFrameObjectsMap[element.etp]) {
              graphicObjectType = element.etp;
            }
          });

          return graphicObjectType;
        };

        /**
         * Redraw graphic frame by performing decorator operations
         * @param {HTMLElement} graphicDiv Shape div
         * @param {JSON} graphicData Shape JSON
         * @private
         */
        var _redraw = function(graphicDiv, graphicData) {
          var decorateGraphic = _api.decorate();
          var slideNode = graphicDiv.parentNode;
          if (!slideNode) {
            return;
          }

          decorateGraphic.withTransforms(graphicData.xfrm, graphicData.grpPrp,
              graphicDiv);

          var graphicObjectType =
              _getContainingGraphicObjectType(graphicData.elm);

          if (graphicObjectType === 'cht') {
            decorateGraphic.withChart(graphicData.elm[0].chid, graphicDiv,
                slideNode);
          }
          graphicDiv.shapeJson = graphicData;
        };

        var _api = {
          decorate: function() {

            var _localApi = {

              /**
               * Decorator / creator of the new shape div.
               * @param {String} eid Eid for the new shape div to be created.
               * @param {String} shapeId Actual shape Id coming from XML.
               * @return {HTMLElement} New html-element for the graphic-frame.
               */
              withNewDiv: function(eid, shapeId) {
                var graphicObjectDiv;

                graphicObjectDiv = document.createElement('DIV');
                graphicObjectDiv.id = eid;
                graphicObjectDiv.setAttribute('qowt-divType', 'grFrm');
                graphicObjectDiv.setAttribute('qowt-eid', eid);


                // This is the actual shape-Id coming from XML - added for
                // automation purpose
                if (shapeId) {
                  QOWTMarkerUtils.addQOWTMarker(graphicObjectDiv, 'shape-Id',
                      shapeId);
                }

                graphicObjectDiv.style.position = 'absolute';
                graphicObjectDiv.style['z-index'] = '0';

                return graphicObjectDiv;
              },

              /**
               * Handles transforms for the graphic-frame.
               * @param {JSON} transforms Graphic-frame transforms.
               * @param {JSON} groupPropertiesBean group-shape properties bean
               * @param {HTMLElement} graphicDiv Graphic-frame div.
               * @return {Object} local API for the decorator.
               */
              withTransforms: function(transforms, groupPropertiesBean,
                                       graphicDiv) {
                _reEvaluateExtent(transforms.ext, groupPropertiesBean);
                Transform2DHandler.
                    handle(transforms, groupPropertiesBean, graphicDiv);

                return _localApi;
              },

              /**
               * adds chart to the graphic-frame.
               * @param {String} chartId Graphic-frame id having chart.
               * @param {HTMLElement} graphicDiv Graphic-frame div.
               * @param {HTMLElement} slideNode slide div.
               */
              withChart: function(chartId, graphicDiv, slideNode) {
                LayoutsManager.cacheChartInfo(chartId, graphicDiv, slideNode);

                return _localApi;
              },

              /**
               * adds smart chart related attributes to the graphic-frame.
               * @param {HTMLDivElement} graphicDiv  Graphic-frame div.
               * @return {Object} local API for the decorator
               */
              forSmartArt: function(graphicDiv) {
                graphicDiv.classList.add('smart-art');

                return _localApi;
              },

              /**
               * Add oleObject class for the Graphic-Frame Div
               * @param {HTMLDivElement} graphicDiv  Graphic-frame div.
               * @return {Object} local API for the decorator
               */
              forOleObject: function(graphicDiv) {
                graphicDiv.classList.add('oleObject');

                return _localApi;
              }
            };

            return _localApi;
          },

          /**
           * Updates graphic frame transforms
           * @param {HTMLElement} graphicDiv Graphic frame HTML element
           * @param {object} xfrm Graphic frame transforms
           */
          setTransforms: function(graphicDiv, xfrm) {
            var shapeJson = _objectUtils.clone(graphicDiv.shapeJson);

            // update transform properties of shapeJson
            shapeJson.xfrm = shapeJson.xfrm || {};
            _objectUtils.appendJSONAttributes(shapeJson.xfrm, xfrm);

            _redraw(graphicDiv, shapeJson);
          }
        };

        return _api;
      };

      var instance = module();
      return instance;
    }
  };

  return _factory;
});
