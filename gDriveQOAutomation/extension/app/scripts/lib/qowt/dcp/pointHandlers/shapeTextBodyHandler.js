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
 * This is the handler for a shape-text.
 * @constructor
 */
define([
  'qowtRoot/dcp/decorators/pointTextBodyPropertiesDecorator',
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/dcp/decorators/pointParagraphDecorator',
  'qowtRoot/dcp/decorators/pointBulletDecorator',
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'qowtRoot/models/point',
  'qowtRoot/variants/configs/point',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/presentation/explicitTextStyleManager',
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager',
  'qowtRoot/presentation/placeHolder/placeHolderTextStyleManager',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/features/utils',
  'qowtRoot/utils/cssManager',
  'qowtRoot/utils/fontManager'
], function(
  PointTextBodyPropertiesDecorator,
  PointTextDecorator,
  PointParagraphDecorator,
  PointBulletDecorator,
  TextSpacingHandler,
  PointModel,
  PointConfig,
  IdGenerator,
  ExplicitTextStyleManager,
  DefaultTextStyleManager,
  PlaceHolderTextStyleManager,
  PlaceHolderManager,
  QowtMarkerUtils,
  Features,
  CssManager,
  FontManager) {

  'use strict';

  var _shapeTextBody,
    _bodyProperties,
    _shapeTextBodyDiv;

  var _pointTextBodyPropertiesDecorator;

  /**
   * Handle text body properties.
   * @param shapeStyle {Object} shape-div Style
   */
  var _handleBodyProperties = function(shapeStyle) {
    _pointTextBodyPropertiesDecorator.
      decorate(_shapeTextBodyDiv, _bodyProperties);
    _pointTextBodyPropertiesDecorator.
      getContainingShapeBoxAlignProperty(_bodyProperties, shapeStyle);
  };

  /**
   * Initializes text body properties.
   */
  var _initializeBodyProperties = function() {
    var resolvedBodyProperties = {};

    if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
      resolvedBodyProperties =
        PlaceHolderTextStyleManager.getResolvedBodyProperties();

      if (resolvedBodyProperties) {
        for (var bodyProperty in resolvedBodyProperties) {
          _bodyProperties[bodyProperty] = _bodyProperties[bodyProperty] ||
            resolvedBodyProperties[bodyProperty];
        }
      }
    }

    PointModel.textBodyProperties.wrap =
      _bodyProperties.wrap ? _bodyProperties.wrap === "square" :
      PointConfig.kDEFAULT_IS_BODY_PROPERTY_WRAP;

    PointModel.textBodyProperties.anchorCtr =
      (_bodyProperties.anchorCtr !== undefined) ? _bodyProperties.anchorCtr :
      PointConfig.kDEFAULT_IS_BODY_PROPERTY_ANCHOR_CENTER;

    PointModel.textBodyProperties.lnSpcReduction =
      (_bodyProperties.normAutofit !== undefined) ?
      _bodyProperties.normAutofit.lnSpcReduction : undefined;
    if (_bodyProperties.normAutofit !== undefined) {
      _shapeTextBodyDiv.setAttribute('lnSpcReduction',
          _bodyProperties.normAutofit.lnSpcReduction);
    }
  };

  /**
   * Initialize DIV element for shape text body.
   * Also initialize reused components
   * Assign id and CSS class names to shape text body div.
   */
  var _initialize = function() {
    _bodyProperties = _shapeTextBody.bodyPr;
  };

  /**
   * create markers for master and layout and add it to shapeTextBodyDiv
   */
  var _applyCascadedClass = function() {
    var phTyp = PointModel.CurrentPlaceHolderAtSlide.phTyp;
    var phIndex = PointModel.CurrentPlaceHolderAtSlide.phIdx;

    var masterClass = PlaceHolderManager.
      getClassPrefix(phTyp, phIndex, 'sldmt', PointModel.MasterSlideId);
    var layoutClass = PlaceHolderManager.
      getClassPrefix(phTyp, phIndex, 'sldlt', PointModel.SlideLayoutId);

    QowtMarkerUtils.addQOWTMarker(_shapeTextBodyDiv, 'casKey',
      masterClass + " " + layoutClass);
  };

  /**
   * Checks if the shape is a placeholder and it has content present in it, if
   * yes, that means there is explicit text. To show this text, hide the
   * placeholder text body div, because, placeholder text body div has higher
   * z-index than the actual text body.
   * @private
   */
  var _hidePlaceholderIfTextExists = function() {
    // TODO (wasim.pathan): Remove pointEdit condition once we have a
    // standard point editor.
    if (Features.isEnabled('edit') &&
        Features.isEnabled('pointEdit') && PointModel.isPlaceholderShape) {
      var placeholderTextBodyDiv = Polymer.dom(_shapeTextBodyDiv).parentNode.
          getElementsByClassName('placeholder-text-body')[0];

      if (placeholderTextBodyDiv) {
        // Check if this text body has any text runs in it so as to decide if
        // we need to hide the placeholder text body node or not (this node
        // was prepared by placeHolderTextBodyhandler)
        if (_shapeTextBodyDiv.textContent.trim().length !== 0) {
          placeholderTextBodyDiv.style.display = 'none';
        }
      }
    }
  };

  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'txBody',

    /**
     * Maximum number of levels
     * @const {number}
     */
    MAX_PARAGRAPH_LEVEL: 7,

    /**
     * Render a Shape-text element from DCP
     * @param v {DCP} shape text body DCP JSON
     * @return {DOM Element} shape text body div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if (!_pointTextBodyPropertiesDecorator) {
          _pointTextBodyPropertiesDecorator =
            PointTextBodyPropertiesDecorator.create();
        }

        //As we want to render text from shapeTextBody, we make below variable
        // as true ( which is made false by placeHolderTextBodyHandler), so
        // textParagraphHandler can procees it.
        PointModel.isExplicitTextBody = true;

        _shapeTextBody = v.el;
        _shapeTextBodyDiv = _api.createShapeTextBodyDiv(_shapeTextBody.eid);

        if (_shapeTextBody.txStl) {
          ExplicitTextStyleManager.cacheExplicitTxtStyle(_shapeTextBody.txStl);
        } else {
          ExplicitTextStyleManager.resetCache();
        }

        var shape = v.node;

        _initialize();

        //initialize bodyProperties
        _initializeBodyProperties();

        _handleBodyProperties(shape.style);

        if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
          _applyCascadedClass();
        }

        // Supply a css rule for default formatting of different levels
        var pointTextDecorator = PointTextDecorator.create();
        var pointParagraphDecorator = PointParagraphDecorator.create();
        var pointBulletDecorator = PointBulletDecorator.create();
        for (var level = 0; level <= _api.MAX_PARAGRAPH_LEVEL; ++level) {
          var runProp = {'rpr': {}};
          var paraProp = {'ppr': {'level': level}};

          // TODO(elqursh): Refactor code for pointTextDecorator to deal only
          // with explicit properies on a text run. Any inherited properties
          // should be handled here.

          var paraRule = '.' + _shapeTextBodyDiv.id + ' p[qowt-level="' +
              level + '"]';
          var paraRuleLevelZero = '.' + _shapeTextBodyDiv.id +
              ' p:not([qowt-level])';

          // For paragraph
          var decoratePara = pointParagraphDecorator.decorate().
              withNewDiv('dummy');
          var para = decoratePara.withParagraphProperties(paraProp).
              getDecoratedDiv();

          // Apply spacingBefore or spacingAfter only if it is 'points'.
          // Otherwise, if it is in percentage then the spacing depends on the
          // maximum font size of the paragraph
          if (TextSpacingHandler.isSpacingBeforeInPoints()) {
            var spacingBefore = TextSpacingHandler.getSpacingBefore();
            if (spacingBefore) {
              para.style['padding-top'] = spacingBefore;
            }
          }
          if (TextSpacingHandler.isSpacingAfterInPoints()) {
            var spacingAfter = TextSpacingHandler.getSpacingAfter();
            if (spacingAfter) {
              para.style['padding-bottom'] = spacingAfter;
            }
          }

          // For bullets
          var resolvedParaProperty;
          var properties = _.cloneDeep(paraProp.ppr) || {};
          ExplicitTextStyleManager.resolveParaPropertyFor(properties);
          if (PointModel.CurrentPlaceHolderAtSlide.phTyp) {
            resolvedParaProperty = PlaceHolderTextStyleManager.
                resolveParaPropertyFor(level);
          } else {
            resolvedParaProperty = DefaultTextStyleManager.
                resolveParaPropertyFor(level);
          }

          for (var paraProperty in resolvedParaProperty) {
            properties[paraProperty] = properties[paraProperty] ||
                resolvedParaProperty[paraProperty];
          }

          var bulletStyle = pointBulletDecorator.decorate(para, properties);

          // For text run
          var decorateText = pointTextDecorator.decorate().withNewDiv('dummy');
          var span = decorateText.withTextRunProperties(
              runProp, level).getDecoratedDiv();

          var fontName = FontManager.getFontName(span);
          var fontFamily = FontManager.family(fontName);
          if (fontFamily) {
            span.style.fontFamily = fontFamily;
          }

          CssManager.addRule(paraRule, para.style.cssText, 100);
          CssManager.addRule(paraRule + ':before', bulletStyle, 100);
          CssManager.addRule(paraRule + ' span', span.style.cssText, 100);

          if (level === 0) {
            CssManager.addRule(paraRuleLevelZero, para.style.cssText, 100);
            CssManager.addRule(paraRuleLevelZero + ':before', bulletStyle, 100);
            CssManager.addRule(paraRuleLevelZero + ' span',
                span.style.cssText, 100);
          }
        }

        Polymer.dom(shape).appendChild(_shapeTextBodyDiv);
        Polymer.dom(shape).flush();
        return _shapeTextBodyDiv;
      } else {
        return undefined;
      }
    },

    /**
     * Creates shape text body DIV
     * @param {String=} opt_shapeTextBodyEid - eid of shape text body
     * @return {HTMLDivElement} shape text body div
     */
    createShapeTextBodyDiv: function(opt_shapeTextBodyEid) {
      var shapeTextBodyId =
          opt_shapeTextBodyEid || ('txBody' + IdGenerator.getUniqueId());
      var shapeTextBodyDiv = document.createElement('DIV');
      shapeTextBodyDiv.id = shapeTextBodyId;
      shapeTextBodyDiv.setAttribute('qowt-divType', 'textBox');
      shapeTextBodyDiv.className += shapeTextBodyId;
      return shapeTextBodyDiv;
    },

    /**
     * postTraverse gets called *after* all child elements have been handled
     * this can be used to only add our new element to the DOM *after* the
     * children have been handled to reduce the number of DOM calls that are
     * made.
     */
    postTraverse: function() {
      var lastParagraph = _shapeTextBodyDiv.lastChild;

      if (lastParagraph) {
        lastParagraph.style['padding-bottom'] = "0pt";
      }

      // If this is a placeholder text body and it has explicit text in it, then
      // hide the placeholder text body div.
      _hidePlaceholderIfTextExists();
    }

  };

  return _api;
});
