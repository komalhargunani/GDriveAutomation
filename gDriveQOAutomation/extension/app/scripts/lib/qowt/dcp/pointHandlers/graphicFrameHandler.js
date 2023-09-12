define([
  'qowtRoot/dcp/decorators/graphicFrameDecorator',
  'third_party/lo-dash/lo-dash.min'
], function(GraphicFrameDecorator) {

  'use strict';

  var _graphicFrameDecorator;

  var _graphicFrameObjectsMap = {
    'cht': 'charts',
    'dgm': 'diagram',
    'oleObject': 'oleObject'
  };

  /**
   * returns the containing graphic object type in the graphic-frame.
   * @param {Array} elementArr - array of containing 'elm' (elements).
   * @return {String} element-type (etp)
   */
  var _getContainingGraphicObjectType = function(elementArr) {
    var graphicObjectType;

    if (elementArr) {
      elementArr.forEach(function(element) {
        if (_graphicFrameObjectsMap[element.etp]) {
          graphicObjectType = element.etp;
        }
      });
    }

    return graphicObjectType;
  };

  var _api = {
    etp: 'grfrm',

    visit: function(v) {
      if (!v || !v.el || !v.el.etp || v.el.etp !== _api.etp || !v.el.eid) {
        return undefined;
      }

      if (!_graphicFrameDecorator) {
        _graphicFrameDecorator = GraphicFrameDecorator.create();
      }

      var graphicData = v.el;
      var graphicId = graphicData.nvSpPr && graphicData.nvSpPr.shapeId;

      var decorateGraphic = _graphicFrameDecorator.decorate();
      var graphicDiv = decorateGraphic.withNewDiv(graphicData.eid, graphicId);
      decorateGraphic.
          withTransforms(graphicData.xfrm, graphicData.grpPrp, graphicDiv);

      var graphicObjectType = _getContainingGraphicObjectType(graphicData.elm);

      switch (graphicObjectType) {
        case 'cht':
          decorateGraphic.withChart(graphicData.elm[0].chid, graphicDiv);
          break;
        case 'dgm':
          decorateGraphic.forSmartArt(graphicDiv);
          break;
        case 'oleObject':
          decorateGraphic.forOleObject(graphicDiv);
          break;
      }

      // caching JSON
      graphicDiv.shapeJson = _.cloneDeep(graphicData);

      v.node.appendChild(graphicDiv);
      return graphicDiv;
    }
  };

  return _api;
});
