/**
 * Fill handler.
 * Responsible for filling canvas objects or HTML elements
 */
define([
  'qowtRoot/dcp/pointHandlers/common/blipFillHandler',
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler',
  'qowtRoot/dcp/pointHandlers/common/solidFillHandler',
  'qowtRoot/utils/deprecatedUtils'
], function(BlipFillHandler, GradientFillHandler,
            SolidFillHandler, DeprecatedUtils) {

  'use strict';


  var _solidFillHandler;
  var _gradientFillHandler;
  var _blipFillHandler;

  /**
   * returns the SolidFill handler object
   * @return SolidFill handler object
   */
  var _getSolidFillHandler = function() {
    if (!_solidFillHandler) {
      _solidFillHandler = SolidFillHandler;
    }

    return _solidFillHandler;
  };

  /**
   * returns the BlipFill handler object
   * @return BlipFill handler object
   */
  var _getBlipFillHandler = function() {
    if (!_blipFillHandler) {
      _blipFillHandler = BlipFillHandler;
    }

    return _blipFillHandler;
  };

  /**
   * returns the GradientFill handler object
   * @return GradientFill handler object
   */
  var _getGradientFillHandler = function() {
    if (!_gradientFillHandler) {
      _gradientFillHandler = GradientFillHandler;
    }

    return _gradientFillHandler;
  };

  /**
   * Handles no fill Style
   * @return noFillStyleClass  - returns style class for no fill
   */
  var _getNoFillStyle = function() {
    var style = {};
    style.background = 'none';
    return style;
  };

  var _api = {
    /**
     * Fills the canvas context
     * @param canvas to fill
     * @param context of the canvas
     * @param fill fill information
     * @param fillPathAttribute fill info in paths.
     */
    fillCanvasContext: function(canvas, context, fill, fillPathAttribute, img) {
      //Handling shape-fill, If no explicit color is assigned then don't fill.
      if (fill !== undefined && fill.type !== undefined) {

        switch (fill.type) {
          case 'solidFill':
            _getSolidFillHandler().fillCanvasContext(context, fill,
              fillPathAttribute);
            break;
          case 'gradientFill':
            _getGradientFillHandler().fillCanvasContext(canvas, context, fill,
              fillPathAttribute);
            break;
          case 'blipFill':
            var canvasDimensions = {
              width: canvas.width,
              height: canvas.height
            };
            _getBlipFillHandler().fillCanvasContext(canvasDimensions, context,
              fill, fillPathAttribute, img);
            break;
          default:
            break;
        }
      }
    },

    /**
     * Handles fill for HTML DOM element
     * @param fill {Object} The fill JSON
     * @param divToFill {Object} The HTML DOM element
     */
    handleUsingHTML: function(fill, divToFill) {

      // TODO : #BSC - chrome -  In chrome fill goes outside rectangle boundary,
      // to fix this issue just uncomment following code to work proper in
      // chrome
      //  childDiv.style.height =
      //    (shapeDimensions.height - (1.5 * lineWidth)) + "px";
      //  childDiv.style.width =
      //    (shapeDimensions.width - (1.5 * lineWidth)) + "px";
      //
      //  shapeDimensions.height = (shapeDimensions.height - (1.5 * lineWidth));
      //  shapeDimensions.width = (shapeDimensions.width - (1.5 * lineWidth));
      if (fill && fill.type) {
        switch (fill.type) {
          case "solidFill":
            // console.log("Inside fill handler -- handling solid fill");
            _getSolidFillHandler().handleUsingHTML(fill, divToFill);
            break;
          case "gradientFill":
            _getGradientFillHandler().handleUsingHTML(fill, divToFill);
            break;
          case "blipFill":
            _getBlipFillHandler().handleUsingHTML(fill, divToFill);
            break;
          case "noFill":
            divToFill.style.background = 'none';
            break;
          default:
            break;
        }
      }
    },

    /**
     * returns css style text for the shape-fill
     * @param fillObj {Object} Fill JSON
     * @param fillStyleClassName {String} - css class name of the theme
     * fill-style, for which the css is to be created. It is only needed for
     * tiled blip-fill.
     * @return fillStyleText {String} css style
     */
    getFillStyle: function(fillObj, fillStyleClassName) {
      var fillStyleText = '';

      switch (fillObj.type) {
        case "solidFill":
          fillStyleText = _getSolidFillHandler().getStyleString(fillObj);
          break;
        case "gradientFill":
          fillStyleText = _getGradientFillHandler().getStyleString(fillObj);
          break;
        case "blipFill":
          fillStyleText = _getBlipFillHandler().getStyleString(fillObj,
            fillStyleClassName);
          break;
        case "noFill":
          fillStyleText =
            DeprecatedUtils.getElementStyleString(_getNoFillStyle());
          break;
        default:
          break;
      }
      return fillStyleText;
    }
  };

  return _api;
});
