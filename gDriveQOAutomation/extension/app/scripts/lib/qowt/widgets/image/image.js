/**
 * @fileOverview Image Widget; The Image widget encapsulates the HTML
 * representation of an image element.
 *
 * IMPORTANT: Widgets should not cause render tree re-layouts to occur in
 * their constructor (by accessing or changing element properties). Render
 * tree re-layouts are performance expensive.
 * If a widget requires to perform operations that will result in a render
 * tree re-layout, these operations should be captured in a distinct 'layout'
 * method in the widget's public API, so that owning control can dictate when
 * this method is called, at an appropriate moment to take the 'hit' of render
 * tree re-layout cost.
 *
 * @author Alok Guha (alok.guha@quickoffice.com)
 *         Dan Tilley (dtilley@google.com)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/dcp/decorators/borderDecorator',
  'qowtRoot/variants/utils/resourceLocator',
  'qowtRoot/utils/deprecatedUtils'], function (
  WidgetFactory,
  BorderDecorator,
  ResourceLocator,
  DeprecatedUtils) {

  'use strict';

  // constants
  var _kDivType = 'qowt-img-container';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Image Widget Factory',

    supportedActions: [],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param config {object} Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.fromId {HTML Element ID} Determine if this widget can be
     *                                       constructed given the node
     *                                       referenced byte this ID as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {integer} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      var score = 0, node;
      if (config && config.fromId) {
        node = window.document.getElementById(config.fromId);
      }
      if (config && config.fromNode) {
        node = config.fromNode;
      }
      if (node && node.tagName === 'IMG') {
        score = 100;
      }
      // if the node matches a container div for images we give a lower score.
      if (node && node.tagName && node.tagName.toLowerCase() === 'div' &&
         node.getAttribute('qowt-divtype') === _kDivType) {
        score = 90;
      }
      return score;
    },

    /**
     * factory create function; see init() for how these parameters
     * are used. A new widget and html will be constructed.
     *
     * @param config - config object to create image. Contains properties
     *                  such as image source, its width, height etc.
     * @param {string}  config.format.src - image url path.
     * @param {string}  config.format.height image height in px.
     * @param {string}  config.format.width image width in px.
     * @param {boolean} config.format.isGroupShape -  true if it is grouped
     *                  with other shapes/images. False if it is not grouped.
     * @param {boolean} config.format.isPointElement - indication of whether
     *                  point element.
     * @param parent - the parent element
     */
    create: function(config, parent) {

      var module = function () {

        var _KContentType = 'image',
            _KMetricUnits = 'px',
            _imageNode,
            // if true: to crop an image in word we build a div container
            // around the image so that the image can be absolutely postioned
            // TODO(sakhyaghosh): remove this flag and look how to combine point
            // and word image widget implementation
            _KBuildContainer = false,
            _imageContainer,
            _api = {};

        /**
         * Set the image node Eid.
         * @param id {string}
         */
        _api.setId = function (id) {
          _imageNode.id = id;
          _imageNode.setAttribute('qowt-eid', id);
        };

        /**
         * Get the image node Eid.
         * @return {string} The Eid for this widget.
         */
        _api.getEid = function () {
          return _imageNode.getAttribute('qowt-eid');
        };

        /**
         * Set the image height.
         * @param height {string}
         */
        _api.setHeight = function (height) {
          _imageNode.style.height = height;
        };

        /**
         * Set the image width.
         * @param width {string}
         */
        _api.setWidth = function (width) {
          _imageNode.style.width = width;
        };

        /**
         * Set the image max width.
         * @param maxWidth {string}
         */
        _api.setMaxWidth = function (maxWidth) {
          _imageNode.style.maxWidth = maxWidth;
        };

        /**
         * Set the image source location.
         * @param src {string}
         */
        _api.setImageSource = function(src) {
          _imageNode.src = ResourceLocator.pathToUrl(src);
        };

        /**
         * Query the content type encapsulated by this widget.
         * Determines which content handler/manager to use.
         * @return {string} The content type encapsulated by this widget.
         */
        _api.getContentType = function () {
          return _KContentType;
        };

        /**
         * Return the main html element which represents the image
         * or the image container element which conatins the image element
         * @return {w3c element || undefined}
         *         The element image element or the image container element.
         */
        _api.getWidgetElement = function () {
          return _KBuildContainer ? _imageContainer: _imageNode;
        };

        /**
         * Append this widget to the DOM.
         * @param node {HTML Element} Where to append.
         */
        _api.appendTo = function(node) {
          if(node && node.nodeType === Node.ELEMENT_NODE) {
            node.appendChild(_imageNode);
          }
        };

        /**
         * Remove this widget from the DOM.
         * Assumes the widget instance has been correctly constructed.
         */
        _api.remove = function() {
          if(_imageNode && _imageNode.parentNode) {
            _imageNode.parentNode.removeChild(_imageNode);
          }
        };

        /**
         * Crop the image.
         * if _KBuildContainer:
         *   adds a div container to absolutely position a cropped image.
         * @param {Object} metrics crop data for the image, consists of:
         * @param {Number} metrics.originalHeight original height of the image.
         * @param {Number} metrics.originalWidth original width of the image.
         * @param {Number} metrics.top top of the clip rectangle, which is the
         *                             offset from the top border.
         * @param {Number} metrics.bottom bottom of the clip rectangle, which
         *                                is the offset top border.
         * @param {Number} metrics.left left of the clip rectangle, which is
         *                              the offset from the left border.
         * @param {Number} metrics.right right of the clip rectangle, which is
         *                               the offset from the left border.
         */
        _api.cropImage = function(metrics) {
          if (metrics !== undefined) {
            if (!_KBuildContainer) {
              _api.setMaxWidth(metrics.originalWidth + _KMetricUnits);
            } else {
              // create a div container positioned relative,
              // so that the image can be absolutely positioned, which is
              // required for the clip css rectangle property.
              _createImageContainer();
              _styleImageContainer();
            }

            // set the image height and width.
            _api.setHeight(metrics.originalHeight + _KMetricUnits);
            _api.setWidth(metrics.originalWidth + _KMetricUnits);
            // set the top and left.
            _imageNode.style.top = (metrics.top * -1) + _KMetricUnits;
            _imageNode.style.left = (metrics.left * -1) + _KMetricUnits;
            // apply the crop.
            _imageNode.style.position = 'absolute';
            _imageNode.style.clip = 'rect(' + metrics.top + _KMetricUnits +
              ' ' + metrics.right + _KMetricUnits +
              ' ' + metrics.bottom + _KMetricUnits +
              ' ' + metrics.left + _KMetricUnits + ')';
          }
        };

        /**
         * Crop image from DCP data.
         * @param {Object} dcp DCP data for the image.
         */
        _api.cropImageFromDCP = function(dcp) {
          dcp = dcp || {};
          // TODO: Remove this call to set units when all cores
          // use wdt_u and hgt_u.
          if (dcp.wdt !== undefined && dcp.hgt !== undefined) {
            var metrics = _calculateCropMetrics(dcp);
            _api.cropImage(metrics);
          }
        };


        // vvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

        /**
         * @private
         * Create the image container div.
         * the image container div is created around the image so that the
         * image can be absolutely postioned for cropping.
         */
        function _createImageContainer() {
          _imageContainer = window.document.createElement('div');
          _imageContainer.setAttribute('qowt-divtype', _kDivType);
          _api.appendTo(_imageContainer);
        }

        /**
         * @private
         * Apply styling to the image container div.
         * the image container div will be positioned relative so that the
         * image can be absolutely postioned for cropping.
         */
        function _styleImageContainer() {
          _imageContainer.style.height = config.format.hgt + _KMetricUnits;
          _imageContainer.style.width = config.format.wdt + _KMetricUnits;
          _imageContainer.style.position = 'relative';
          _imageContainer.style.display = 'inline-block';
        }

        /**
         * @private
         * Create an object that has the calculated height and width, and
         * crop rect values for an image DCP object.
         * @param {Object} dcp the image DCP.
         * @return {Object} metrics crop data for the image, consists of:
         * @return {Number} metrics.originalHeight original height of the image.
         * @return {Number} metrics.originalWidth original width of the image.
         * @return {Number} metrics.top top of the clip rectangle, which is the
         *                             offset from the top border.
         * @return {Number} metrics.bottom bottom of the clip rectangle, which
         *                                is the offset top border.
         * @return {Number} metrics.left left of the clip rectangle, which is
         *                              the offset from the left border.
         * @return {Number} metrics.right right of the clip rectangle, which is
         *                               the offset from the left border.
         */
        function _calculateCropMetrics(dcp) {
          dcp.crop = dcp.crop || {};
          dcp.crop.l = dcp.crop.l || 0;
          dcp.crop.t = dcp.crop.t || 0;
          dcp.crop.b = dcp.crop.b || 0;
          dcp.crop.r = dcp.crop.r || 0;
          var metrics = {};

          // calculate original height and width of the image
          metrics.originalHeight = (100 * dcp.hgt) /
            (100 - (parseFloat(dcp.crop.t) +
                    parseFloat(dcp.crop.b)));
          metrics.originalWidth =  (100 * dcp.wdt) /
            (100 - (parseFloat(dcp.crop.l) +
                    parseFloat(dcp.crop.r)));

          // Both the top and the bottom values define the offset
          // from the top border and the left and right values define the
          // offset from the left border
          // calculate the top, right, bottom, left for clip rectangle
          metrics.top = DeprecatedUtils.computePercentValueOf(
            dcp.crop.t, metrics.originalHeight);
          metrics.left = DeprecatedUtils.computePercentValueOf(
            dcp.crop.l, metrics.originalWidth);
          // Right and bottom should be set to scaled-width and scaled-height,
          // respectively, in case of negative crop.
          metrics.right = (dcp.crop.r < 0) ? metrics.originalWidth :
            DeprecatedUtils.computePercentValueOf(
              (100 - dcp.crop.r), metrics.originalWidth);
          metrics.bottom = (dcp.crop.b < 0) ? metrics.originalHeight :
            DeprecatedUtils.computePercentValueOf(
              (100 - dcp.crop.b), metrics.originalHeight);

          return metrics;
        }

        /**
         * @private
         * Apply image borders from DCP data.
         * @param {Object} dcp DCP data for the image.
         */
        function _applyBordersFromDCP(dcp) {
          if (_imageNode) {
              BorderDecorator.decorate(_imageNode, dcp);
          }
        }

        /**
         * @private
         * Constructor.
         * Create an image node then validate and set the widget properties
         * from the config information.
         */
        function _constructNewImage() {
          if (config !== undefined) {
            _imageNode = window.document.createElement('img');
            _api.setId(config.newId);
            _api.setImageSource(config.format.src);
            if (config.format.hgt && !config.format.wdt) {
              config.format.wdt = config.format.hgt;
            }
            if (config.format.isGroupShape === false) {
              _api.setWidth('100%');
              _api.setHeight('100%');
            } else {
              // TODO: Can we find a better name or property to distinguish
              // code paths here. Qowt ideally should be application-agnostic.
              // So whether an element comes from Point or Word or Sheet it
              // should be irrelevant. There must be some aspect of that
              // element's behaviour that we can use to describe which code
              // path to take.
              if (!_KBuildContainer) {
                if (config.format.hgt ||
                    config.format.isPointElement === true) {
                  _api.setHeight(config.format.hgt + _KMetricUnits);
                }
                _api.setWidth(config.format.wdt + _KMetricUnits);
              }
            }
            // add cropping to the image
            if (config.format && config.format.crop) {
              _api.cropImageFromDCP(config.format);
            }
            // add border styling
            if (config.format && config.format.borders) {
              _applyBordersFromDCP(config.format.borders);
            }

            // If a 'contextmenu' event (eg. a right click) occurs on an
            // image then we don't want the QO context menu to appear.
            if (parent) {
              parent.oncontextmenu = function(e) {
                e.stopPropagation();
              };
            }
          }
        }

        /**
         * @private
         * Constructor.
         * Try to build this widget using a node in the config,
         * the node must be an 'img' DOM element.
         */
        var _constructFromElement = function() {
          var node = config.fromNode;
          if(node.nodeName && (node.nodeName.toLowerCase() === 'img')) {
            _imageNode = node;
          }
        };

        /**
         * @private
         * Constructor.
         * Try to build this widget by getting an existing node in the DOM,
         * the node must be an 'img' DOM element.
         */
        function _constructFromId() {
          var nodeInDOM = window.document.getElementById(config.fromId);
          if(nodeInDOM &&
             nodeInDOM.nodeName &&
            (nodeInDOM.nodeName.toLowerCase() === 'img')) {
            _imageNode = nodeInDOM;
          }
        }

        /**
         * Initialize this widget.
         */
        function init() {
          if (config.fromNode) {
            _constructFromElement();
          } else if (config.fromId) {
            _constructFromId();
          } else if (config.newId) {
            _constructNewImage();
          }
        }

        init();
        return _api;

      };

      var instance = module();
      return instance;

    }

  };

  // register with the widget factory;
  WidgetFactory.register(_factory);
  return _factory;

});
