/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Blip Fill handler.
 * Responsible for Blip fill
 *
 * Blip fill JSON for stretch image
 * {
 type: "blipFill",
 "blip":
 {
 "etp":"img",
 "src":"image source data"
 },
 "fillMode":
 {
 "type": "stretchFill",
 "fillRect":
 {
 "bottom": '<botton>',
 "left": '<left>',
 "right": '<right>',
 "top": '<top>'
 }
 }
 }

 * Blip fill JSON for tiled image
 * {
 type: "blipFill",
 alpha: '<opacity>',
 "blip":
 {
 "etp":"img",
 "src":"image source data"
 },
 "fillMode":
 {
 "type": "tileFill",
 "tileProps":
 {
 "Sx": '<scaled width in percent>',
 "Sy": '<scaled height in percent>',
 "Tx": '<x offset>',
 "Ty": '<y offset>',
 "align": '<tile alignment>'
 }
 }
 }
 */
define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/utils/styleSheetsManager',
  'qowtRoot/utils/imageUtils',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/variants/configs/common',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/drawing/pictureRecolor/point/recolorRequestGenerator',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  'qowtRoot/utils/cssManager'
], function(DeprecatedUtils,
            StyleSheetsManager,
            ImageUtils,
            UnitConversionUtils,
            ResourceLocator,
            CommonConfig,
            LayoutsManager,
            RecolorRequestGenerator,
            ErrorCatcher,
            QowtSilentError,
            CssManager
    ) {

  'use strict';
  /**
   * computes the position and dimensions of the blip/background image
   * @param fillRect {Object} dimensions of the fill-rectangle
   * @param shapeDimensions {Object} shape dimensions
   * @return {Object} object constituting of the position and dimensions of the
   *                  blip image
   */
  var _computeBlipImageDimensions = function(fillRect, shapeDimensions,
                                             isCanvasShape) {
    //TODO: This hack is due to core giving an empty fillRect object when left,
    // right, top and bottom are defined as 0. Need to remove when it is fixed
    // from core.
    fillRect = fillRect || {};
    ['l', 'r', 't', 'b'].forEach(function(property) {
      fillRect[property] = parseFloat(fillRect[property] || '0');
    });

    var blipImage;
    if (isCanvasShape) {
      blipImage = {
        left: (fillRect.l * shapeDimensions.width / 100).toFixed(2),
        top: (fillRect.t * shapeDimensions.height / 100).toFixed(2),
        width: ((100 - (fillRect.l + fillRect.r)) *
            shapeDimensions.width / 100).toFixed(2),
        height: ((100 - (fillRect.t + fillRect.b)) *
            shapeDimensions.height / 100).toFixed(2)
      };
    } else {
      blipImage = {
        leftPerc: (fillRect.l === 0) ? '0%' : ((fillRect.l /
            (fillRect.l + fillRect.r)) * 100) + '%',
        topPerc: (fillRect.t === 0) ? '0%' : ((fillRect.t /
            (fillRect.t + fillRect.b)) * 100) + '%',
        widthPerc: (100 - (fillRect.l + fillRect.r)) + '%',
        heightPerc: (100 - (fillRect.t + fillRect.b)) + '%'
      };
    }

    return blipImage;
  };

  /**
   * handles the stretch style blip-fill for rectangular shapes
   * @param fillRect stretch fill properties JSON
   * @param element shape div
   */
  var _stretchBlipFillHandler = function(fillRect, style) {
    var blipImageDimensions = _computeBlipImageDimensions(fillRect, undefined,
        false);

    style['background-repeat'] = "no-repeat";
    // TODO -webkit-background-size is used because of
    // chromium bug- https://code.google.com/p/chromium/issues/detail?id=307977
    style['-webkit-background-size'] =
        blipImageDimensions.widthPerc + " " + blipImageDimensions.heightPerc;
    style['background-position'] =
        blipImageDimensions.leftPerc + " " + blipImageDimensions.topPerc;
  };

  /**
   * handles the stretch style blip-fill for canvas
   * @param fillRect stretch fill properties JSON
   * @param shapeDimensions shape width and height
   * @param img canvas image element
   * @param context canvas context
   */
  var _stretchBlipFillCanvasHandler = function(fillRect, shapeDimensions, img,
                                               context) {
    var blipImageDimensions = _computeBlipImageDimensions(fillRect,
        shapeDimensions, true);

    context.drawImage(img, blipImageDimensions.left, blipImageDimensions.top,
        blipImageDimensions.width, blipImageDimensions.height);

    context.restore();
  };

  /**
   * computes the css style string for the background-position
   * @param tileAlignment {String} holds the alignment value for the background
   *                               image
   * @return {String} css style string for the background-position
   */
  var _computeBackgroundPositionString = function(tileAlignment) {
    var backgroundPositionString = '';

    switch (tileAlignment) {
      case 'T':
        backgroundPositionString = 'top center';
        break;
      case 'TL':
        backgroundPositionString = 'top left';
        break;
      case 'TR':
        backgroundPositionString = 'top right';
        break;
      case 'L':
        backgroundPositionString = 'center left';
        break;
      case 'C':
        backgroundPositionString = 'center center';
        break;
      case 'R':
        backgroundPositionString = 'center right';
        break;
      case 'BL':
        backgroundPositionString = 'left bottom';
        break;
      case 'B':
        backgroundPositionString = 'center bottom';
        break;
      case 'BR':
        backgroundPositionString = 'right bottom';
        break;
      default:
        break;
    }

    return backgroundPositionString;
  };

  /**
   * given the tile alignment, computes the new origin from where the image
   * offsets are to be applied
   * @param shapeDimensions shape height and width
   * @param tileAlignment image tile alignment
   * @param imageWidth actual image width
   * @param imageHeight actual image height
   */
  var _computeAdjustPointForTileAlignment = function(shapeDimensions,
                                                     tileAlignment, imageWidth,
                                                     imageHeight) {
    var adjustPoint = {};

    //gives the point on the y-axis, where the image will be placed exactly at
    // the bottom, within the rectangular div
    var bottomHeight = shapeDimensions.height - imageHeight;
    //gives the point on the x-axis, where the image will be placed exactly at
    // the right, within the rectangular div
    var rightWidth = shapeDimensions.width - imageWidth;

    //gives the point on the y-axis, where the image will be in the vertically
    // middle position
    var centerHeight = bottomHeight / 2;
    //gives the point on the x-axis, where the image will be in the
    // horizontally middle position
    var centerWidth = rightWidth / 2;

    switch (tileAlignment) {
      case 'T':
        adjustPoint.x = centerWidth;
        adjustPoint.y = 0;
        break;
      case 'TL':
        adjustPoint.x = 0;
        adjustPoint.y = 0;
        break;
      case 'TR':
        adjustPoint.x = rightWidth;
        adjustPoint.y = 0;
        break;
      case 'L':
        adjustPoint.x = 0;
        adjustPoint.y = centerHeight;
        break;
      case 'C':
        adjustPoint.x = centerWidth;
        adjustPoint.y = centerHeight;
        break;
      case 'R':
        adjustPoint.x = rightWidth;
        adjustPoint.y = centerHeight;
        break;
      case 'BL':
        adjustPoint.x = 0;
        adjustPoint.y = bottomHeight;
        break;
      case 'B':
        adjustPoint.x = centerWidth;
        adjustPoint.y = bottomHeight;
        break;
      case 'BR':
        adjustPoint.x = rightWidth;
        adjustPoint.y = bottomHeight;
        break;
      default:
        break;
    }

    return adjustPoint;
  };

  /**
   * invoked when the image is loaded by the browser.
   * This is only the case when it is tiled blip-fill.
   * @param {JSON} tileProperties - tile rect image properties
   * @param {String} styleLayer - details which style-layer is affected.
   *                 It can have one of the following values - 'slide',
   *                 'placeholder' or 'theme'.
   * @param {Object} styleObject - object to be processed based on the type of
   *                               styleLayer.
   * @param {Object} event - image load event
   */
  var _onTiledImageLoad = function(tileProperties, styleLayer, styleObject,
                                   event) {
    var imageWidth = tileProperties.Sx * event.target.width / 100;
    var imageHeight = tileProperties.Sy * event.target.height / 100;

    if (styleLayer === 'explicit') {
      styleObject.style['-webkit-background-size'] =
          imageWidth + "px " + imageHeight + "px";

      // Apply to the slide level div too.
      var thumbnailToSlideShapeFillMap =
          LayoutsManager.getThumbnailToSlideShapeFillMap();
      if (thumbnailToSlideShapeFillMap[styleObject.id]) {
        thumbnailToSlideShapeFillMap[styleObject.id].style[
            '-webkit-background-size'] = imageWidth + "px " + imageHeight +
            "px";
      }
    } else if (styleLayer === 'cascaded') {
      StyleSheetsManager.addStyleToClass(styleObject,
          '-webkit-background-size', (imageWidth + "px " + imageHeight + "px"));
    }
  };

  /**
   * handles the tile style blip-fill for rectangular shapes
   * @param tileProperties {JSON} stretch fill properties JSON
   * @param style {JSON} css style for the blip-fill
   * @param imageSource {String} image source location
   * @param shapeFillDiv {HTML} shape div
   * @param fillStyleClassName {String} - css class name of the theme
   *                                      fill-style, for which the css is to
   *                                      be created.
   */
  var _tileBlipFillHandler = function(tileProperties, style, imageSource,
                                      shapeFillDiv, fillStyleClassName) {
    style['background-repeat'] = "repeat";
    style['background-position'] =
        _computeBackgroundPositionString(tileProperties.align);

    var img = document.createElement('img');
    img.src = imageSource;

    var imageLoadAction, styleLayer;
    if (shapeFillDiv) {
      styleLayer = 'explicit';
      imageLoadAction = _onTiledImageLoad.bake(this, tileProperties,
          styleLayer, shapeFillDiv);
    } else if (fillStyleClassName) {
      styleLayer = 'cascaded';
      imageLoadAction = _onTiledImageLoad.bake(this, tileProperties,
          styleLayer, fillStyleClassName);
    }

    img.addEventListener('load', function(event) {
      imageLoadAction(event);
    }, true);
  };

  /**
   * handles the tile style blip-fill for canvas
   * @param tileProperties tile fill properties JSON
   * @param canvasDimensions canvas width and height
   * @param img canvas image element
   * @param context canvas context
   */
  var _tileBlipFillCanvasHandler = function(tileProperties, canvasDimensions,
                                            img, context) {
    var imageWidth = tileProperties.Sx * img.width / 100;
    var imageHeight = tileProperties.Sy * img.height / 100;

    var adjustPoint = _computeAdjustPointForTileAlignment(canvasDimensions,
        tileProperties.align, imageWidth, imageHeight);

    var x0 = ((UnitConversionUtils.convertEmuToPixel(tileProperties.Tx) +
        adjustPoint.x) % imageWidth) - imageWidth;
    var y0 = ((UnitConversionUtils.convertEmuToPixel(tileProperties.Ty) +
        adjustPoint.y) % imageHeight) - imageHeight;

    var xArr = [];
    var yArr = [];

    do {
      xArr.push(x0);
      x0 += imageWidth;
    } while (x0 < canvasDimensions.width);

    do {
      yArr.push(y0);
      y0 += imageHeight;
    } while (y0 < canvasDimensions.height);

    xArr.forEach(function(x) {
      yArr.forEach(function(y) {
        context.drawImage(img, x, y, imageWidth, imageHeight);
      });
    });
    context.restore();
  };

  /**
   * Checks whether "fillMode" is present. If not, applies deafult fill-mode.
   * @param fillMode {JSON} fill-mode which either contains stretch-fill or
   *                        tile-fill properties.
   * @return {JSON} fill-mode
   */
  var _validateFillMode = function(fillMode) {
    return fillMode ? fillMode : CommonConfig.DEFAULT_BLIP_FILL_PROPERTIES;
  };

  /**
   * compute Fill style to element using fill properties
   * @param fill {Object} The fill JSON data
   * @param alpha {String} the transparency value, between 0 and 1.
   * @param element {HTML} target div to fill
   * @param fillStyleClassName {String} - css class name of the theme
   *                                      fill-style, for which the css is to
   *                                      be created.
   * @return {JSON} The list of styles to be applied to element
   */
  var _computeBlipFillStyle = function(fill, alpha, element,
                                       fillStyleClassName) {
    var style = {};
    var blip = fill.blip;
    if (blip && blip.src) {
      // Now there is no need to add "data" as DCP always sends a path to image.
      var qualifiedPath = ResourceLocator.pathToUrl(blip.src);

      if (qualifiedPath) {
        try {
          var pictureRecolorRequest = RecolorRequestGenerator.generate(blip);

          // For now, just proceed if the background styles are to be applied
          // via css class (like slide backgrounds) and not via explicit style
          // attributes
          if (pictureRecolorRequest &&
              pictureRecolorRequest.hasRecoloringEffects() &&
              fillStyleClassName) {
            // Get a promise from applier which will provide recolored image
            var applierPromise = ImageUtils.applyEffects(qualifiedPath,
                pictureRecolorRequest);

            if (applierPromise) {
              // Do post processing after promise is resolved with recolored
              // image url
              applierPromise.then(function(recoloredBackgroundImageDataUrl) {
                CssManager.updateRule(fillStyleClassName, {
                  'background-image': 'url("' +
                      recoloredBackgroundImageDataUrl + '")'
                });
              }, function() {
                ErrorCatcher.handleError(new QowtSilentError(
                    'BlipFillHandler: Unable to process background image ' +
                        'effects.'));
                CssManager.updateRule(fillStyleClassName, {
                  'background-image': 'url("' + qualifiedPath + '")'
                });
              });
            }
          } else {
            style['background-image'] = "url('" + qualifiedPath + "')";
          }
        } catch (ex) {
          ErrorCatcher.handleError(new QowtSilentError('BlipFillHandler: ' +
              'Error when applying/processing background image.'));

          style['background-image'] = "url('" + qualifiedPath + "')";
        }
      }

      var fillMode = _validateFillMode(fill.fillMode);
      if (fillMode.type === 'stretchFill') {
        _stretchBlipFillHandler(fillMode.fillRect, style);
      } else if (fillMode.type === 'tileFill') {
        if (!fillMode.tileProps) {
          // If tile properties are not available then use default tile
          // properties.
          fillMode = _validateFillMode();
        }
        _tileBlipFillHandler(fillMode.tileProps, style, qualifiedPath, element,
            fillStyleClassName);
      }

      style.opacity = alpha;
    }
    return style;
  };

  /**
   * refines alpha or transparency value
   * @param {JSON} fillData - fill data containing alpha value
   */
  var _refineAlpha = function(fillData) {
    return fillData.alpha ? fillData.alpha / 100000 : 1;
  };

  var _api = {
    /**
     * sets the canvas context style for fill of blip-fill type
     * @param canvasDimensions dimensions of canvas
     * @param context canvas context
     * @param fillData shape color fill data
     */
    fillCanvasContext: function(canvasDimensions, context, fillData,
                                fillPathAttribute, img) {

      var alpha = _refineAlpha(fillData);

      // error check for unit test "Uncaught TypeError: Object #<Object> has
      // no method 'clip'"
      if (context && context.clip) {
        context.clip();
      }

      // if we apply alpha value after fillMode then it wont applied so first
      // apply alpha value to context then apply fillMode property

      switch (fillPathAttribute) {
        case "lightenLess":
          context.globalAlpha = alpha / 1.2;
          break;

        case "lighten":
          context.globalAlpha = alpha / 1.5;
          break;

        case "darken":
          context.fillstyle = 'rgba(0,0,0,0.6)';
          context.fill();
          context.globalAlpha = alpha / 1.6;
          break;

        case "darkenLess":
          context.fillstyle = 'rgba(0,0,0,0.7)';
          context.fill();
          context.globalAlpha = alpha / 1.3;
          break;

        default:
          context.globalAlpha = alpha;
          break;

      }

      var fillMode = _validateFillMode(fillData.fillMode);
      if (fillMode && fillMode.type) {
        if (fillMode.type === 'stretchFill') {
          _stretchBlipFillCanvasHandler(fillMode.fillRect, canvasDimensions,
            img, context);
        } else if (fillMode.type === 'tileFill') {
          if (!fillMode.tileProps) {
            // If tile properties are not available then use default tile
            // properties.
            fillMode = _validateFillMode();
          }
          _tileBlipFillCanvasHandler(fillMode.tileProps, canvasDimensions,
            img, context);
        }
      }
    },

    /**
     * Handle blip fill using HTML and CSS
     * @param fill The blip fill JSON
     * @param element target div to fill
     */
    handleUsingHTML: function(fill, element) {
      // QOWT.utils.log(
      //  "Inside QOWT.DCP.Handler.BlipFill - handleUsingHTML function");
      var alpha = _refineAlpha(fill);

      var returnedStyle = _computeBlipFillStyle(fill, alpha, element);

      for (var key in returnedStyle) {
        element.style[key] = returnedStyle[key];
      }
    },

    /**
     * returns the css style text for shape blip-fill property
     * @param fill {Object} The solid fill JSON
     * @param fillStyleClassName {String} - css class name of the theme
     *                                      fill-style, for which the css is to
     *                                      be created.
     * @return styleText The css style to be applied to placeHolder shape
     */
    getStyleString: function(fill, fillStyleClassName) {
      var alpha = _refineAlpha(fill);

      return DeprecatedUtils.getElementStyleString(_computeBlipFillStyle(fill,
          alpha, undefined, fillStyleClassName));
    }

  };

  return _api;
});
