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
 * Decorator for Shape
 * @constructor
 */
/**
 * JsDoc description
 */
define([
  'qowtRoot/dcp/pointHandlers/shapePropertiesHandler',
  'qowtRoot/dcp/pointHandlers/rectangularShapePropertiesHandler',
  'qowtRoot/dcp/decorators/geometryDecorator',
  'qowtRoot/dcp/decorators/hyperlinkDecorator',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/presentation/placeHolder/phStyleClassFactory',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/utils/unitConversionUtils',
  'qowtRoot/models/point',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/features/utils',
  'qowtRoot/utils/objectUtils',
  'qowtRoot/utils/domUtils',
  'qowtRoot/widgets/image/image',
  'qowtRoot/drawing/geometry/metaFilePainter',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager'
], function(
    ShapePropertiesHandler,
    RectangularShapePropertiesHandler,
    GeometryDecorator,
    HyperlinkDecorator,
    PlaceHolderManager,
    PHStyleClassFactory,
    DeprecatedUtils,
    UnitConversionUtils,
    PointModel,
    QOWTMarkerUtils,
    ShapeEffectsDecorator,
    ThemeStyleRefManager,
    GeometryManager,
    Features,
    ObjectUtils,
    DomUtils,
    ImageWidget,
    MetaFilePainter,
    PlaceHolderPropertiesManager) {

  'use strict';

  //TODO: Refactor ShapePropertiesHandler and RectangularShapePropertiesHandler
  // as Decorators.

  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        var _geometryDecorator = GeometryDecorator.create();
        var _hlDecorator = HyperlinkDecorator.create();
        var _shapeEffectsDecorator;
        var _objectUtils = new ObjectUtils();

        // Constant holding rect shape preset id
        var _kRECT_SHAPE_PRESET_ID = 88;

        /**
         * Sets the table style specific properties to the shape-div
         * @param {Object} el el item of the Picture JSON
         * @param {HTMLElement} shapeDiv shape-div being rendered
         */
        var _handleTableShape = function(el, shapeDiv) {
          // console.log('Inside Shape Handler - Rendering Table Specific
          // Style');

          // set shape div minimum height with cell height
          if (el.height) {
            shapeDiv.style.minHeight = UnitConversionUtils.
                convertEmuToPixel(el.height) + 'px';
          }
          // Also set shape div's height to 100%, this will cause shape div to
          // expand as per cell height. This shape div is child of table cell
          // and cell gets expanded if its contents are large.
          shapeDiv.style.height = '100%';
        };

        /**
         * Handles high level effects of shapes
         * @param {JSON} properties shape properties
         * @param {HTMLElement} targetDiv Target div on which effect will be
         *                                applied
         */
        var _handleHighLevelEffect = function(properties, targetDiv) {

          var effectList = properties.efstlst;
          if (effectList && effectList.refnEff) {

            if (!_shapeEffectsDecorator) {
              _shapeEffectsDecorator = ShapeEffectsDecorator.create();
            }

            var reflectionStyle = _shapeEffectsDecorator.
                withReflection(effectList.refnEff);
            DeprecatedUtils.appendJSONAttributes(targetDiv.style,
                reflectionStyle);
          }

          var effectRefStyleClassName = ThemeStyleRefManager.
              getHighLevelEffectRefClassName();
          if (effectRefStyleClassName &&
              !targetDiv.classList.contains(effectRefStyleClassName)) {
              targetDiv.classList.add(effectRefStyleClassName);
          }
        };

        /**
         * Handles redundant effects of shapes.
         * Here we remove unnecessary effects which is already applied through
         * cascading. In case of cascading certain shape effects[reflection,
         * shadow, blur, etc] may get applied. But, on the slide excplicitly
         * they might get removed and their applied styles become redundant.
         * This function takes care of removing such styles.
         * @param {JSON} effectList Shape effect list
         * @param {HTMLElement} targetDiv Target div on which effect will be
         *                                applied
         * @param {boolean} isHighLevelEffect It describes whether effect is
         *                                    high level (reflection) or low
         *                                    level (shadow).
         */
        var _handleRedundantEffect = function(effectList, targetDiv,
                                              isHighLevelEffect) {
          if (!_shapeEffectsDecorator) {
            _shapeEffectsDecorator = ShapeEffectsDecorator.create();
          }

          var redundantStyle = _shapeEffectsDecorator.
              withRedundantEffects(targetDiv, effectList, isHighLevelEffect);
          DeprecatedUtils.appendJSONAttributes(targetDiv.style, redundantStyle);
        };

        /**
         * This method handles placeholder shape. It fetches placeholder text
         * body from Point model and attaches it to the shape div.
         * @param {JSON} shape Shape JSON
         * @param {HTMLElement} shapeDiv Shape div
         * @private
         */
        var _handlePlaceholderShape = function(shape, shapeDiv) {
          // TODO (wasim.pathan): Remove pointEdit condition once we have a
          // standard point editor.
          if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
            // If the shape is placeholder of editable type then get the cached
            // placeholder text body node and attach it to the shape div.
            if (shape.nvSpPr && shape.nvSpPr.phTyp &&
                PlaceHolderManager.isEditablePlaceHolderShape(
                    shape.nvSpPr.phTyp)) {
              // Fetch and attach the placeholder text body now.
              var placeholderKey = shape.nvSpPr.phTyp + '_' +
                  shape.nvSpPr.phIdx;

              var placeholderTextBodyDiv = PointModel.
                  placeholderTextBody[placeholderKey];
              var existedPHTextBodyDiv = shapeDiv.querySelector(
                  '.placeholder-text-body');

              if (placeholderTextBodyDiv && !existedPHTextBodyDiv) {
                // Clone the placeholder text body for further use, ensuring
                // further changes would be local to the placeholder text
                // body's copy.
                placeholderTextBodyDiv = placeholderTextBodyDiv.cloneNode(true);
                Polymer.dom(shapeDiv).appendChild(placeholderTextBodyDiv);
                Polymer.dom(shapeDiv).flush();
              }
            }
          }
        };

        /**
         * Handler for flips
         * @param {HTMLElement} shapeNode Shape div
         * @param {object} shapeJson JSON of shape
         * @private
         */
        var _handleShapeFlips = function(shapeNode, shapeJson) {

          // apply updated flip state on shape node
          shapeNode.style['-webkit-transform'] =
              shapeNode.style['-webkit-transform'];

          var shapeTransforms = shapeJson.spPr.xfrm;
          // Update the attributes flip-h and flip-v, so that the proper flip
          // gets applied to the text body through CSS
          shapeNode.setAttribute('flip-h', shapeTransforms.flipH);
          shapeNode.setAttribute('flip-v', shapeTransforms.flipV);

          // apply updated flip state on handlers node so position of resize
          // handlers won't change.
          var handlersNode = _getHandlersDiv(shapeNode);
          if (handlersNode) {
            _api.handleFlipsForHandlersNode(handlersNode, shapeNode);
          }
        };


        /**
         * Updates image transforms as per shape transforms
         * @param {object} imageJSON JSON of image element
         * @param {HTMLElement} imageNode Image element
         * @param {object} xfrm Updated shape transforms
         * @private
         */
        var _setImageTransforms = function(imageJSON, imageNode, xfrm) {
          var imageWidget = ImageWidget.create({
            fromNode: imageNode
          });

          if (!imageWidget) {
            return;
          }

          var height = UnitConversionUtils.convertEmuToPixel(xfrm.ext.cy).
              toFixed(2) + 'px';
          var width = UnitConversionUtils.convertEmuToPixel(xfrm.ext.cx).
              toFixed(2) + 'px';

          imageWidget.setWidth(width);
          imageWidget.setHeight(height);

          if (imageJSON && imageJSON.crop) {
            var convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;
            imageJSON.wdt = convertEmuToPixel(xfrm.ext.cx);
            imageJSON.hgt = convertEmuToPixel(xfrm.ext.cy);
            imageWidget.cropImageFromDCP(imageJSON);
          }
        };

        /**
         * Calculates scale factor of meta file element
         * @param {object} actualExtents original extents
         * @param {number} shapeHeight Height of shape element
         * @param {number} shapeWidth Width of shape element
         * @return {object} Scale factor
         * @private
         */
        var _computeScaleFactor = function(actualExtents, shapeHeight,
                                           shapeWidth) {
          var scaleFactor = {};
          scaleFactor.x = shapeWidth / actualExtents.cy;
          scaleFactor.y = shapeHeight / actualExtents.cx;
          return scaleFactor;
        };

        /**
         * Updates transforms of meta file element as per shape transforms
         * @param {object} metaFileJSON JSON of meta file element
         * @param {HTMLElement} metaFileNode Meta file element
         * @param {object} xfrm Updated shape transforms
         * @private
         */
        var _setMetaFileTransforms = function(metaFileJSON, metaFileNode,
                                              xfrm) {
          if (!metaFileNode) {
            return;
          }

          if (metaFileJSON.pathLst && metaFileJSON.pathLst.length) {

            var convertEmuToPixel = UnitConversionUtils.convertEmuToPixel;

            metaFileJSON.wdt = convertEmuToPixel(xfrm.ext.cx);
            metaFileJSON.hgt = convertEmuToPixel(xfrm.ext.cy);

            var shapeHeight = metaFileJSON.hgt;
            var shapeWidth = metaFileJSON.wdt;
            var metaFileCanvas = metaFileNode.querySelector('canvas');

            if (!metaFileCanvas) {
              return;
            }

            var scaleFactor = _computeScaleFactor(metaFileJSON.ext,
                shapeHeight, shapeWidth);
            metaFileCanvas.height = shapeHeight;
            metaFileCanvas.width = shapeWidth;

            MetaFilePainter.paintCanvas(metaFileCanvas,
                metaFileJSON.pathLst, scaleFactor);
          }

          var imageJSON = {
            el: metaFileJSON.elm[0]
          };

          if (imageJSON.el.etp === 'img') {
            var imgId = imageJSON.el.eid;
            var imageNode = metaFileNode.querySelector('[id=' + imgId + ']');
            if (imageNode) {
              _setImageTransforms(imageJSON.el, imageNode, xfrm);
            }
          }
        };

        /**
         * Returns the handlers node
         * @param {HTMLElement} shapeNode HTML shape element
         */
        var _getHandlersDiv = function(shapeNode) {
          return shapeNode.querySelector('[qowt-divtype=handlers]');
        };

        /**
         * Redraw shape by performing canvas operations
         * @param {HTMLElement} shapeNode Shape div
         * @param {Object} shapeJson Shape JSON
         */
        var _redraw = function(shapeNode, shapeJson) {
          // Here user is done with resize operation(on ghostShape node) and
          // released mouse, now we have to resize original shape node with
          // updated transforms. So we redraw a shape with updated transforms.
          // We could get these properties from ghostShape node, but if we do,
          // a flakiness is seen and operation does not happen smoothly.

          // For now, we are not supporting resize operation on charts. So
          // no need to perform redraw operation.
          var divType = shapeNode.getAttribute('qowt-divtype');
          if (divType === 'grFrm') {
            return;
          }

          // caching shape styles
          ThemeStyleRefManager.cacheShapeStyle(shapeJson.style);

          _api.decorate(shapeNode, shapeJson);

          _handleShapeFlips(shapeNode, shapeJson);

          // update image | meta file transforms if available
          if (shapeJson.etp === 'pic') {
            var imageJSON = {
              el: shapeJson.elm[0]
            };

            if (imageJSON.el.etp === 'img') {
              var imgId = imageJSON.el.eid;
              var imageNode = shapeNode.querySelector('[id=' + imgId + ']');
              if (imageNode) {
                _setImageTransforms(imageJSON.el, imageNode,
                    shapeJson.spPr.xfrm);
              }
            } else if (imageJSON.el.etp === 'mf') {
              var metaFileDivId = imageJSON.el.eid;
              var metaFileNode =
                  shapeNode.querySelector('[id=' + metaFileDivId + ']');
              if (metaFileNode) {
                _setMetaFileTransforms(imageJSON.el, metaFileNode,
                    shapeJson.spPr.xfrm);
              }
            }
          }

          shapeNode.shapeJson = shapeJson;
        };

        var _api = {
          /**
           * Decorates the shape
           * here, for decorate api, we have constraints on method call, viz if
           * we want to create new div then withNewDiv is the first method to
           * invoke and after all decorate methods getDecoratedDiv() is the last
           * method.
           * @param {HTMLElement} shapeDiv Shape div
           * @param {object} shapeJSON shape JSON
           */
          decorate: function(shapeDiv, shapeJSON) {

            _api.withDefaultStyle(shapeDiv, shapeJSON);
            _api.withShapeProperties(shapeDiv, shapeJSON);

            if (shapeJSON.spPr.hasOwnProperty('geom')) {
              _api.withGeometry(shapeDiv, shapeJSON);
            }

            _api.withPlaceHolderType(shapeDiv);

            /**
             * We need to call table specific decorator after shape properties
             * are applied.
             * Reason: in case of table shape, we need to override some
             * properties (like height) which are set by shape properties
             * decorator.
             */
            if (shapeJSON.spPr.isShapeWithinTable === true) {
              _api.withTableSpecifics(shapeDiv, shapeJSON);
            }

            _handlePlaceholderShape(shapeJSON, shapeDiv);
          },

          /**
             * Decorators shape with default styles
             * Word app also uses it for 2d-rotation for image
             * @param {HTMLElement} shapeDiv Shape div
             * @param {object} shapeJSON Shape JSON
             */
          withDefaultStyle: function(shapeDiv, shapeJSON) {
            var shapeId = shapeJSON.nvSpPr && shapeJSON.nvSpPr.shapeId;

            // TODO (pankaj avhad): Remove this check, once 'Point Model
            // refactoring' or 'migration of shape to polymer' starts
            // handling this across application.
            // Additional check to ensure that if given shape is non
            // placeholder shape then resetCurrentPlaceHolderForShape must
            // be called in order to reset Point Model for place holders.
            if (shapeJSON.nvSpPr && !shapeJSON.nvSpPr.phTyp) {
              PointModel.isPlaceholderShape = false;
              //non PH shapeJson. Reset the PH classes.
              PlaceHolderManager.resetCurrentPlaceHolderForShape();
            }

            // This is the actual shape-Id coming from XML - added for
            // automation purpose
            if (shapeId &&
                !QOWTMarkerUtils.fetchQOWTMarker(shapeDiv, 'shape-Id')) {
              QOWTMarkerUtils.addQOWTMarker(shapeDiv, 'shape-Id', shapeId);
            }

            // Add marker for placeholder shape, to enable us to
            // distinguish it from normal shapes
            if (PointModel.CurrentPlaceHolderAtSlide.phTyp !==
                undefined) {
              var phMarker = PointModel.CurrentPlaceHolderAtSlide.
                  phTyp + '_' + PointModel.CurrentPlaceHolderAtSlide.
                  phIdx;
              if (!QOWTMarkerUtils.fetchQOWTMarker(shapeDiv, 'ph')) {
                QOWTMarkerUtils.addQOWTMarker(shapeDiv, 'ph', phMarker);
              }
            }

            /*
               TODO: Atul In case of point and sheet the image is always
               absolute. In case of point it is anchored with respect to
               slide and in case of sheet it is anchored with respect to cell
               and hence the position coordinates are always available. In
               case of word by default the image is inline and not
               positioned. We always add a drawing DIV as a parent to shape
               DIV. When image is absolutely positioned we positioned the
               outer DIV and not this shape DIV. Ideally image handling code
               should be same across all the products. However there is no
               right solution for this at the moment.
               */
            if (window.document.getElementById('qowt-msdoc')) {
              shapeDiv.style.position = 'static';
            }
            else {
              shapeDiv.style.position = 'absolute';
            }
            shapeDiv.style['z-index'] = '0';
            Polymer.dom(shapeDiv).classList.add('qowt-point-shape');

          },

          /**
             * Decorates with table specific needed styling
             * @param {HTMLElement} shapeDiv Shape div
             * @param {Object} shapeObj shape JSON object
             */
          withTableSpecifics: function(shapeDiv, shapeObj) {
            shapeDiv.style.position = 'relative';
            shapeDiv.style.display = '-webkit-inline-box';
            // if this shape is a table cell then change the qowt-divType to
            // "tableCell".
            shapeDiv.setAttribute('qowt-divType', 'tableCell');
            _handleTableShape(shapeObj, shapeDiv);
          },

          /**
             * Decorates the shape div with the properties in the -shapeObj-
             * @param {HTMLElement} shapeDiv Shape div
             * @param {Object} shapeObj shape JSON object
             */
          withShapeProperties: function(shapeDiv, shapeObj) {
            var shapeTransform = shapeObj.spPr.xfrm;
            // Set the attributes flip-h and flip-v if the are available in
            // shapeObj otherwise fetch it through resolved properties to set
            // cascaded values, so that the proper flip gets applied to the text
            // body through CSS
            if (shapeTransform) {
              shapeDiv.setAttribute('flip-v', shapeTransform.flipV);
              shapeDiv.setAttribute('flip-h', shapeTransform.flipH);
            } else if (shapeObj.nvSpPr && shapeObj.nvSpPr.phTyp) {
              PlaceHolderManager.
                  updateCurrentPlaceHolderForShape(shapeObj.nvSpPr.phTyp,
                      shapeObj.nvSpPr.phIdx);

              var resolvedSpPr =
                  PlaceHolderPropertiesManager.getResolvedShapeProperties();
              // TODO (kunjan.thakkar): Ideally we must not be setting flipV and
              // flipH attributes if they are undefined, since setting them to
              // undefined does not make sense. Need to find out more such
              // occurences and fix them at once.
              shapeDiv.setAttribute('flip-v', resolvedSpPr.xfrm.flipV);
              shapeDiv.setAttribute('flip-h', resolvedSpPr.xfrm.flipH);
            }

            ShapePropertiesHandler.handle(shapeObj, shapeDiv,
                shapeObj.grpPrp);

            // Hide or Show the shape
            var nonVisualShapeProperties = shapeObj.nvSpPr;
            var hideShape = nonVisualShapeProperties &&
                nonVisualShapeProperties.isHidden;
            if (hideShape) {
              shapeDiv.style.display = 'none';
            }
          },

          /**
             * Decorates the shape div with the geometry - rectangular div or
             * canvas
             * @param {HTMLElement} shapeDiv Shape div
             * @param {Object} shapeObj shape JSON object
             */
          withGeometry: function(shapeDiv, shapeObj) {
            var shapeProperties = _.omit(shapeObj.spPr, 'ln');
            // make sure we do not render outline, even through cascading. so
            // set it explicitly to noFill
            shapeProperties.ln = {'fill': {'type': 'noFill'}};
            var groupShapeProperties = shapeObj.grpPrp;
            if (parseInt(shapeProperties.geom.prst, 10) ===
                _kRECT_SHAPE_PRESET_ID) {
              // In case of rendering, new shapeFillDiv would be created
              // and in case of redraw(for resize operation), existed
              // shapeFillDiv would be referred.
              var shapeFillDiv =
                shapeDiv.querySelector('[qowt-divtype=shape-fill]');
              if (!shapeFillDiv) {
                shapeFillDiv = document.createElement('DIV');
                shapeFillDiv.id = shapeDiv.id + 'shapeFill';
                if (shapeObj.etp === 'pic') {
                  shapeFillDiv.setAttribute('qowt-filltype', 'pic');
                }
                shapeFillDiv.setAttribute('qowt-divtype', 'shape-fill');
                Polymer.dom(shapeDiv).appendChild(shapeFillDiv);
                Polymer.dom(shapeDiv).flush();
              }

              RectangularShapePropertiesHandler.handle(shapeProperties,
                  groupShapeProperties, shapeDiv, shapeFillDiv);
              _handleHighLevelEffect(shapeProperties, shapeDiv);
              _handleRedundantEffect(shapeProperties.efstlst, shapeDiv,
                  true);

            } else {

              //border css classes get applied to canvas placeholders which
              // add a default border to canvas shape so set style = none to
              // avoid extra borders getting applied.
              if (PointModel.CurrentPlaceHolderAtSlide.phTyp !==
                  undefined) {
                shapeDiv.style.border = 'none';
                shapeDiv.style['-webkit-box-shadow'] = 'none';
                shapeDiv.style['-webkit-box-reflect'] = 'none';
              }
              var geomMgrApi = GeometryManager.
                  initialize(shapeProperties, groupShapeProperties);
              var fillColorBean = geomMgrApi.generateFillColorBean();
              var effectsBean = geomMgrApi.generateEffectsBean();
              var shapeCanvas = shapeDiv.querySelector('canvas');

              if (!shapeCanvas || _api.isOutlineCanvas(shapeCanvas)) {
                shapeCanvas =
                    _geometryDecorator.decorate(shapeDiv).withNewCanvas();
              }

              _geometryDecorator.decorate(shapeDiv).withCanvasTransforms(
                  shapeProperties, effectsBean, shapeCanvas).
                  withCanvasDrawing(shapeProperties, groupShapeProperties,
                  fillColorBean, effectsBean, shapeCanvas);
              _handleHighLevelEffect(shapeProperties, shapeCanvas);
              _handleRedundantEffect(shapeProperties.efstlst, shapeCanvas,
                  true);
            }
          },

          /**
             * Decorates the shape div with hyperlink
             * @param {HTMLElement} shapeDiv Shape div
             * @param {Object} shapeObj shape JSON object
             */
          withLink: function(shapeDiv, shapeObj) {
            var lnk = shapeObj.lnk;

            // we are not supporting hyperlink for shape(hyperlink of
            // another slide within same ppt or hyperlink of different ppt)
            // so we wont allow to enter into decorate function for now

            //this hack for google alacarte demo presentation once we
            // provide hyperlink implementation need to remove it

            if (lnk && (lnk.indexOf('ppt/slides') !== 0 &&
                lnk.indexOf('file:') !== 0 && lnk.indexOf('../') !== 0)) {
              shapeDiv = _hlDecorator.decorate(shapeDiv).withLink(lnk);
              shapeDiv.style['text-decoration'] = 'none';
            }
          },

          /**
             * Decorates the placeholder shape with shape properties.
             * @param {HTMLElement} shapeDiv Shape div
             */
          withPlaceHolderType: function(shapeDiv) {
            PlaceHolderManager.applyPhClasses(shapeDiv,
                PHStyleClassFactory.shape);

            for (var i = 0; shapeDiv.hasChildNodes() &&
                i < shapeDiv.childNodes.length; i++) {
              var childNode = shapeDiv.childNodes[i];
              if (childNode.getAttribute &&
                  childNode.getAttribute('qowt-divType') === 'shape-fill') {
                PlaceHolderManager.applyPhClasses(childNode,
                    PHStyleClassFactory.shapeFill);
                break;
              }
            }
          },

          /**
           * Handler for flips of handlersDiv. It handles flipping of
           * handlersDiv with respect to flipped shape node.
           * @param {HTMLElement} handlersDiv Handlers div element
           * @param {HTMLElement} shapeNode Shape div
           * @private
           */
          handleFlipsForHandlersNode: function(handlersDiv, shapeNode) {
            // if shape is flipped then handlersDiv would also get flipped. So
            // position of resize pointers would get changed. To avoid this,
            // we need to flip handlersDiv explicitly.
            if (_api.isFlippedHorizontal(shapeNode) &&
                _api.isFlippedVertical(shapeNode)) {
              handlersDiv.style['-webkit-transform'] = 'scale(-1, -1)';
            } else if (_api.isFlippedHorizontal(shapeNode)) {
              // if shape is flipped horizontally then flip handlersDiv
              // accordingly.
              handlersDiv.style['-webkit-transform'] = 'scale(-1, 1)';
            } else if (_api.isFlippedVertical(shapeNode)) {
              // if shape is flipped vertically then flip handlersDiv
              // accordingly.
              handlersDiv.style['-webkit-transform'] = 'scale(1, -1)';
            } else {
              // if shape is not flipped then reset flip property
              handlersDiv.style['-webkit-transform'] = '';
            }

            var rotationAngle = _api.getRotationAngle(shapeNode);
            if (rotationAngle) {
              handlersDiv.style['-webkit-transform'] = 'rotate(0deg)' +
                  handlersDiv.style['-webkit-transform'];
            }
          },

          /**
           * Updates shape transforms and redraw canvas
           * @param {HTMLElement} shapeNode HTML shape element
           * @param {object} xfrm Shape transforms
           */
          setTransforms: function(shapeNode, xfrm) {
            var shapeJson = _objectUtils.clone(shapeNode.shapeJson);

            // update transform properties of shapeJson
            shapeJson.spPr.xfrm = shapeJson.spPr.xfrm || {};
            _objectUtils.appendJSONAttributes(shapeJson.spPr.xfrm,
                xfrm);

            _redraw(shapeNode, shapeJson);
          },

          /**
           * Updates shape fill and decorate
           * @param {HTMLElement} shapeNode HTML shape element
           * @param {object} fill Shape fill
           */
          setFill: function(shapeNode, fill) {
            var shapeJson = shapeNode.shapeJson;

            // update fill properties of shapeJson
            if (fill) {
              shapeJson.spPr.fill = fill;
            }

            // caching shape styles
            ThemeStyleRefManager.cacheShapeStyle(shapeJson.style);
            _api.decorate(shapeNode, shapeJson);
          },

          isOutlineCanvas: function(shapeCanvas) {
            // For thumbnail's outline canvas id will be 't-outline_canvas'.
            return shapeCanvas && shapeCanvas.id &&
                shapeCanvas.id.includes('outline_canvas');
          },

          /**
           * Returns true if horizontal flipped value exist, false otherwise.
           * @param {HTMLElement} shapeNode HTML shape element
           * @return {boolean} flipped value existence
           */
          isFlippedHorizontal: function(shapeNode) {
            var transformValue = DomUtils.getTransformValue(shapeNode,
                'scale');
            if (transformValue && transformValue.flipH === '-1') {
              return true;
            } else if (shapeNode.hasAttribute('flip-h')) {
              return shapeNode.getAttribute('flip-h') === 'true';
            }
            return false;
          },

          /**
           * Returns true if vertical flipped value exist, false otherwise.
           * @param {HTMLElement} shapeNode HTML shape element
           * @return {boolean} flipped value existence
           */
          isFlippedVertical: function(shapeNode) {
            var transformValue = DomUtils.getTransformValue(shapeNode,
                'scale');
            if (transformValue && transformValue.flipV === '-1') {
              return true;
            } else if (shapeNode.hasAttribute('flip-v')) {
              return shapeNode.getAttribute('flip-v') === 'true';
            }
            return false;
          },

          /**
           * Returns rotation angle of shape in degrees
           * @param {HTMLElement} shapeNode HTML shape element
           * @return {Number} rotation angle
           */
          getRotationAngle: function(shapeNode) {
            var rotateValue = DomUtils.getTransformValue(shapeNode,
                'rotate');
            if (rotateValue) {
              return parseFloat(rotateValue);
            }
            return undefined;
          }

        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
