/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Slide
 * ======
 *
 * The slide widget encapsulates the part of the HTML DOM representing a
 * presentation that displays a slide or a thumbnail inside the thumbnail strip.
 * The slide widget manages the construction and logic of this slide.
 * Thumbnails and actual slides are created by this widget. Thumbnails are just
 * like normal slides but their size is reduced using webkit-transform [See
 * createNumOfThumbs() in thumbnailStrip.js].
 *
 * It creates two nested HTML elements for each slide:
 * - An outer node with class 'qowt-point-slide' or 'qowt-point-thumb'.
 * - An inner node with class 'qowt-point-thumb-inner'.
 * We use the inner node to hide/show the content of a thumbnail, keeping the
 * thumbnail placeholder visibile. We also apply the scale factor to the inner
 * node.
 *
 * The slide widget also creates an index node used to display the slide number
 * next to the thumbnail.
 *
 * If a thumbnail is clicked, it fires a qowt:pointThumbnailClicked event
 * with parameter {slide: x} where x is the slide index.
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domListener',
  'qowtRoot/features/utils',
  'qowtRoot/variants/configs/point',
  'qowtRoot/models/point',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/dcp/metaFileHandler',
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/dcp/pointHandlers/textParagraphHandler',
  'qowtRoot/dcp/pointHandlers/textRunHandler',
  'qowtRoot/dcp/pointHandlers/textFieldHandler',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/widgets/factory',
  'third_party/lo-dash/lo-dash.min'
], function(
  PubSub,
  DomListener,
  Features,
  PointConfig,
  PointModel,
  ShapeHandler,
  ImageHandler,
  MetaFileHandler,
  ShapeTextBodyHandler,
  TextParagraphHandler,
  TextRunHandler,
  TextFieldHandler,
  QOWTMarkerUtils,
  TypeUtils,
  WidgetFactory) {

  'use strict';

  var _factory = {

    /**
     * @constructor Constructor for the Slide widget.
     * @param slideIndex {Number} Mandatory parameter indicating the slide index
     * @param parentNode {DOM} Mandatory parameter that is the HTML node to
     *                         append this cell to
     * @param isThumbnail {boolean} Optional parameter indicating if the
     *                              instance is a thumbnail (true) or a slide
     *                              (false or undefined)
     * @return {object} A Slide widget.
     */
    create: function(slideIndex, parentNode, isThumbnail) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Private constants
         * @api private
         */
        var _kSlide_Node = {
              Tag: 'div',
              Class: 'qowt-point-slide',
              FullScreenClass : 'qowt-point-slide-shadow',
              Thumbclass: 'qowt-point-thumb'
            },
            _kSlideInner_Node = {
              Tag: 'div',
              Class: 'qowt-point-slide-inner',
              Thumbclass: 'qowt-point-thumb-inner'
            },
            _kIndex_Node = {
              Tag: 'div',
              Class: 'qowt-point-index'
            },
            _kSlide_SelectedClass = 'qowt-point-slide-selected';

        /**
         * Private data
         * @api private
         */
        var _slideNode, _slideInnerNode, _slideIndex, _indexNode,
            _isThumbnail, _isHidden = false, _parentNode, _slideHiddenNode,
            _slideContentsNode, _generatedShapeId,
            _kSlide_HighlightedClass = 'qowt-point-slide-highlighted';

        var _handlers = {
          sp: ShapeHandler,
          pic: ShapeHandler,
          img: ImageHandler,
          txBody: ShapeTextBodyHandler,
          para: TextParagraphHandler,
          txrun: TextRunHandler,
          txfld: TextFieldHandler,
          mf: MetaFileHandler
        };
        /**
         * Flag to detect whether slide data has been fetched from service.
         * @type {boolean}
         * @private
         */
        var _isLoaded = false;

        /**
         * Flag to detect whether slide's visibility has been set.
         * @type {boolean}
         * @private
         */
        var _isVisible = false;


        /**
         * @api private
         */
        var _api = {

          /**
           * Flag to indicate that a request to get the slide content has been
           * sent to service
           * @type {boolean}
           */
          isRequested: false,

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to a
           * specified node in the HTML DOM.
           * Here the slide div element is appended as a child to the specified
           * node.
           * @param node {object} The HTML node that this widget is to attach
           *                      itself to
           * @method appendTo(node)
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw new Error("appendTo - missing node parameter!");
            }

            _parentNode = node;
            if (_slideNode) {
              _parentNode.appendChild(_slideNode);
            }
          },

          /**
           * Returns the Slide node.
           *
           * @return element {object} the slide HTML element
           * @method node()
           */
          node: function() {
            return _slideNode;
          },

          /**
           * Set if slide is hidden in slide show
           * @param {boolean} isHidden flag indicating slide's participation in
           * slide show. True if slide is not participating, false otherwise
           */
          setHiddenInSlideShow: function(isHidden) {
            if (_isThumbnail) {
              var displayProperty = isHidden ? 'block' : 'none';
              //In case of undefined and false set the flag to false.
              _isHidden = !!isHidden;
              _slideHiddenNode.style.display = displayProperty;
              // Update state of slide menuItems only if the current thumbnail
              // is highlighted.
              if (_api.isHighlighted()) {
                PubSub.publish('qowt:updateSlideMenu', {hide: !isHidden});
              }
            }
          },
          /**
           * Returns thumbnail hidden state.
           * @return {boolean} hidden state
           */
          isHidden: function() {
            return _isHidden;
          },

          /**
           * Returns thumbnail loaded state
           *
           * @return {boolean} loaded state
           */
          isLoaded: function() {
            return _isLoaded;
          },

          /**
           * Returns thumbnail visibility state
           *
           * @return {boolean} visibility state
           */
          isVisible: function() {
            return _isVisible;
          },

          /**
           * Sets thumbnail loaded state
           *
           * @param {boolean} isLoaded loaded state
           */
          setLoaded: function(isLoaded) {
            _isLoaded = isLoaded;
          },

          /**
           * Returns the Slide inner node.
           * For the thumbnails, we set display to none or block on the inner
           * node, so we can still show the thumbnail placeholder when the inner
           * node is hidden.
           * @return element {object} the slide HTML element
           * @method node()
           */
          innerNode: function() {
            return _slideInnerNode;
          },

          /**
           * Gets the slide's width.
           * WARNING: Calling this method causes a relayout of the HTML DOM
           * render tree!
           *
           * @return {integer} The width
           * @method width()
           */
          width: function() {
            return _slideNode.offsetWidth;
          },

          /**
           * Gets the slide's height.
           * WARNING: Calling this method causes a relayout of the HTML DOM
           * render tree!
           *
           * @return {integer} The height
           * @method height()
           */
          height: function() {
            return _slideNode.offsetHeight;
          },

          /**
           * Sets the slide's width.
           *
           * @param width {integer} The slide width
           * @method setWidth(width)
           */
          setWidth: function(width) {
            _slideNode.style.width = width + "px";
            if (_isThumbnail) {
              _slideHiddenNode.style.width = width + 'px';
            }
          },

          /**
           * Sets the slide's height.
           *
           * @param height {integer} The slide height
           * @method setHeight(height)
           */
          setHeight: function(height) {
            _slideNode.style.height = height + "px";
            if (_isThumbnail) {
              _slideHiddenNode.style.height = height + 'px';
            }
          },

          /**
           * Returns the slide index.
           *
           * @return {integer} The slide index
           * @method getSlideIndex()
           */
          getSlideIndex: function() {
            return _slideIndex;
          },

          /**
           * Returns the slide Layout Id.
           *
           * @return {String|Undefined} The slide Layout Id if present otherwise
           *     undefined
           */
          getLayoutId: function() {
            var layoutId;
            var slideElement = _slideNode.querySelector('[qowt-divtype=slide]');
            if (slideElement) {
              layoutId = slideElement.getAttribute('sldlt');
            }
            return layoutId;
          },
          /**
           * Sets the slide index.
           * It also sets the id of the element using the index provided.
           *
           * @param slideIndex {integer} The slide index
           * @method setSlideIndex(slideIndex)
           */
          setSlideIndex: function(slideIndex) {
            if (slideIndex >= 0 || slideIndex === "EMPTY") {
              _slideIndex = slideIndex;
              if (_isThumbnail === true) {
                _slideNode.id = _kSlide_Node.Thumbclass + "-" + _slideIndex;
                _slideNode.setAttribute("aria-label","slide "+ (_slideIndex+1));
                _slideNode.setAttribute("aria-activedescendant",
                  _kSlideInner_Node.Class + _slideIndex);
              } else {
                _slideNode.id = _kSlide_Node.Class + "-" + _slideIndex;
              }

              if (_indexNode) {
                _indexNode.textContent = _slideIndex + 1;
              }
            } else {
              throw new Error("setSlideIndex - negative index!");
            }
          },

          /**
           * Returns true if the slide is selected.
           *
           * @return {boolean} Is the slide selected.
           * @method selected()
           */
          selected: function() {
            return _slideNode.classList.contains(_kSlide_SelectedClass);
          },

          /**
           * Sets whether the slide is selected or not.
           *
           * @param selected {boolean} If true, slide is selected
           * @method setSelected(selected)
           */
          setSelected: function(selected) {
            if (selected) {
              if (!PointModel.slideShowMode && Features.isEnabled('edit') &&
                Features.isEnabled('pointEdit')) {
                //when any thumbnail is clicked, clear all the selection.
                //PubSub.publish('qowt:requestFocusLost', {
                //  contentType: 'shape' });
              }

              _slideNode.classList.add(_kSlide_SelectedClass);
              _handleParentShapes();
              _slideNode.focus();
              _slideNode.setAttribute("tabIndex", "0" );
            } else {
              _slideNode.classList.remove(_kSlide_SelectedClass);
              _slideNode.blur();
              _slideNode.setAttribute("tabIndex", "-1" );
            }
          },

          /**
           * Delete the content of the slide.
           *
           * @method flushContents()
           */
          flushContents: function() {
            _slideNode.innerHTML = "";
            if (_indexNode) {
              _slideNode.appendChild(_indexNode);
            }
          },
          /**
           * Generated the shapeId for the shape to add onto the slide.
           * shapeId - Specifies a unique identifier for the current DrawingML
           * shapeId within current document. This ID can be used to assist in
           * uniquely identifying this object so that it can be referred to
           * by other parts of the document. If multiple objects within the
           * same document share the same id attribute value, then the document
           * shall be considered non-conformant.
           */
          generateShapeId: function() {
            if (!_slideContentsNode) {
              _slideContentsNode =
                  _slideInnerNode.querySelector('[qowt-divtype=slide]');
            }
            if (!_generatedShapeId) {
              var _slideContentsElms = _slideContentsNode.childNodes.length;

              //TODO:Pankaj Avhad.This code will become simpler once we remove
              //the slide-notes-div from slide DOM,since slide DOM supposed to
              //contain only shapes.

              //if _slideContents contains only one element then it is a
              //slide-notes-div so checked for more than one element.
              if (_slideContentsElms > 1) {
                _generatedShapeId = QOWTMarkerUtils.fetchQOWTMarker(
                    _slideContentsNode.children[_slideContentsElms - 1],
                    'shape-Id');
                if (!_generatedShapeId) {
                  _generatedShapeId = QOWTMarkerUtils.fetchQOWTMarker(
                      _slideContentsNode.children[
                          _slideContentsElms - 2], 'shape-Id');
                }
              } else {
                _generatedShapeId = 0;
              }
            }
            _generatedShapeId++;
            return _generatedShapeId;
          },
          /**
           * Add the shape optimistically on to the slide with the help of shape
           * handler and shape JSON along with cascading properties.
           *
           * @param {Object} shapeJSON - shape JSON to draw a shape
           */
          addShape: function(shapeJSON) {
            var node = document.createDocumentFragment(), divTypeShapeNode;
            if (!_slideContentsNode) {
              _slideContentsNode =
                  _slideInnerNode.querySelector('[qowt-divtype=slide]');
            }
            _iterateShapeJson(shapeJSON, node);
            divTypeShapeNode = node.querySelector('[qowt-divtype=shape]');
            _slideContentsNode.appendChild(node);

            //Create a shape widget and select shape.
            var shapeWidget = WidgetFactory.create(
                {fromNode: divTypeShapeNode});
            if (shapeWidget && TypeUtils.isFunction(shapeWidget.select)) {
              PubSub.publish('qowt:clearSlideSelection');
              shapeWidget.select();
            }
            //If new shape is text box then activate its text body.
            if (shapeJSON.nvSpPr.isTxtBox) {
              var textBodyWidget;
              if (shapeWidget && TypeUtils.isFunction(shapeWidget.
                  getShapeTextBodyWidget)) {
                textBodyWidget = shapeWidget.getShapeTextBodyWidget();
              }
              if (textBodyWidget &&
                  TypeUtils.isFunction(textBodyWidget.activate)) {
                textBodyWidget.activate();
              }
            }
          },
          /**
           * Removes the shape added optimistically from dom, on failure
           * of add shape command.[do revert of the operation of the command].
           *
           * @param {String} shapeId - id of the shape to remove
           */
          removeShape: function(shapeId) {
            var shapeNode = document.getElementById(shapeId);
            if (shapeNode && shapeNode.parentNode) {
              //After deleting a shape we need to clear the selection so that
              //entry will get removed from selection manager,which in turn will
              //help in removing listeners attached for shape operations.
              PubSub.publish('qowt:clearSlideSelection');
              shapeNode.parentNode.removeChild(shapeNode);
            }
          },
          /**
           * Show or hide a slide.
           *
           * @param show {boolean} Show (true) or hide (false) a slide
           * @method showSlide(show)
           */
          showSlide: function(show) {
            if (show) {
              _slideInnerNode.style.display = 'block';
            } else {
              _slideInnerNode.style.display = 'none';
            }
            _isVisible = show;
          },

          /**
           * Set visibility layer using z index
           * @param index
           */
          setLayer: function(index) {
            _slideNode.style.zIndex = index;
          },

          /**
           * Make this slide widget empty.
           * Removes inner node's contents
           */
          empty: function() {
            while (_slideInnerNode.hasChildNodes()) {
              _slideInnerNode.removeChild(_slideInnerNode.firstChild);
            }
            _api.setSlideIndex("EMPTY");
            _slideContentsNode = undefined;
            _generatedShapeId = undefined;
          },

          /**
           * Check if this slide widget is empty
           * @return true if slide widget is empty, otherwise false
           */
          isEmpty: function() {
            return !(_slideInnerNode.hasChildNodes());
          },

          /**
           * Set animation values
           * @param effect The animation effect
           * @param duration The animation duration
           */
          setAnimationValues: function(effect, duration) {
            if (effect) {
              _slideInnerNode.style.webkitAnimationName = effect;
              _slideInnerNode.style.webkitAnimationDuration = duration;
              _slideInnerNode.style.webkitAnimationIterationCount = '1';
              _slideInnerNode.style.webkitAnimationTimingFunction = "linear";
            }
          },

          /**
           * Handles parent shapes coming form slide layout and / or slide
           * master for slide and slide layout.
           */
          handleParentShapes: function() {
            _handleParentShapes();
          },

          /**
           * Sets element ids based on container.
           * Element id is...
           * 1. If container is thumbnail, then it's eid with prefix 't-'
           * 2. If container is slide workspace, then it's eid
           */
          changeSlideInnerElementsId: function() {
            var elements = _slideInnerNode.querySelectorAll('[id]');
            _.forEach(elements, function(elm) {
              var origId = elm.id;
              elm.id = _isThumbnail ? PointConfig.kTHUMB_ID_PREFIX + origId :
                  origId.replace(PointConfig.kTHUMB_ID_PREFIX, '');
            });
          },

          /**
           * Returns true if the slide is highlighted.
           * @return {Boolean}
           */
          isHighlighted: function() {
            return _slideNode.classList.contains(_kSlide_HighlightedClass);
          },

          /**
           * Highlights the slide
           * @param {Boolean} shouldHighlight determines whether the slide
           * should behighlighted or the highlighting needs to be removed.
           */
          highlight: function(shouldHighlight) {
            if (shouldHighlight) {
              _slideNode.classList.add(_kSlide_HighlightedClass);
            } else {
              _slideNode.classList.remove(_kSlide_HighlightedClass);
              _slideNode.blur();
            }
          },

          /**
           * Get the thumbnail(which this slide widget represents) in view.
           */
          makeVisible: function() {
            _slideNode.scrollIntoViewIfNeeded();
          },

          /**
           * Returns the total number of shapes within the slide
           * @return {number} Count of shapes
           */
          getShapeCount: function() {
            return _getAllShapeNodes().length;
          },

          /**
           * Gets the shape node at given index
           * @param {number} index - Index of shape where it stands in DOM
           * @return {HTMLElement} HTML node of shape
           */
          getShapeNode: function(index) {
            return _getAllShapeNodes()[index];
          },

          /**
           * Gets the shape widget at given index
           * @param {number} index - Index of shape where it stands in DOM
           * @return {Object} shape widget object
           */
          getShapeWidget: function(index) {
            return WidgetFactory.create({
              fromNode: _api.getShapeNode(index)
            });
          },

          /**
           * Gets all the placeholder shapes on current slide
           * @param {string=} opt_phType Optional placeholder type. If provided,
           *     it returns all placeholder shapes of this type, otherwise all
           *     the placeholder shapes on current slide.
           *
           * Placeholder types could be one of these -
           * [title, ctrTitle(Center Title), subTitle, dt(Date), ftr(Footer),
           * sldNum(Slide Number), body, chart, clipArt, dgm, media, obj,
           * pic(Picture), tbl(Table)]
           *
           * @return {Array} Array of placeholder shape widgets
           */
          getAllPlaceholderShapes: function(opt_phType) {
            var shapeWidget, placeholderShapes = [];
            var shapeNodes = _getAllShapeNodes();
            for (var index = 0; index < shapeNodes.length; index++) {
              shapeWidget = WidgetFactory.create({fromNode: shapeNodes[index]});
              if (shapeWidget && shapeWidget.isPlaceholderShape()) {
                if (!opt_phType || (opt_phType && shapeWidget.
                    getPlaceholderType() === opt_phType)) {
                  placeholderShapes.push(shapeWidget);
                }
              }
            }
            return placeholderShapes;
          },

          /**
           * Gets all the object nodes on the current slide such as shapes,
           * tables and graphic frame elements.
           *
           * @return {NodeList} List of all the nodes having qowt div type as
           * shape, table or grFrm
           */
          getAllObjectNodes: function() {
            return _slideInnerNode.querySelectorAll('[qowt-divtype="shape"],' +
                '[qowt-divtype="table"], [qowt-divtype="grFrm"]');
          }
        };

        /**
         * Iterates over shapeJson to call respective handlers.
         * @param {Object} jsonObj shapeJson to iterate.
         * @param {Node} domNode HTML node needed for handler.
         * @private
         */
        var _iterateShapeJson = function(jsonObj, domNode) {
          var _shapeJSON = {}, _domNode;
          if (jsonObj.etp) {
            _shapeJSON.el = jsonObj;
            _shapeJSON.node = domNode;
            if (_handlers[jsonObj.etp]) {
              _domNode = _handlers[jsonObj.etp].visit(_shapeJSON);
            }
            if (jsonObj.etp === 'para') {
              _handlers[jsonObj.etp].postTraverse(_shapeJSON);
            }
            if (jsonObj.elm) {
              if (jsonObj.elm.length > 0) {
                for (var i = 0; i < jsonObj.elm.length; i++) {
                  _iterateShapeJson(jsonObj.elm[i], _domNode);
                }
              }
            }
          }
        };

        /**
         * Returns a list of HTML nodes having qowt-divtype as shape which
         * represents a shape node
         * @return {NodeList} List of shape nodes
         * @private
         */
        var _getAllShapeNodes = function() {
          return _slideInnerNode.querySelectorAll(
              '[qowt-divtype="slide"] [qowt-divtype="shape"]');
        };

        /**
         * Hides parent shapes depending on qowt-hideParentSp attribute set to
         * qowt-divtype slide or slideLayout.
         *
         * For slide with hideParentSp set to true, we will add hideSlideMaster
         * and hideSlideLayout class to _slideInnerNode.
         *
         * For slideLayout with hideParentSp set to true, we will add
         * hideSlideMaster
         * class to _slideInnerNode.
         */
        var _handleParentShapes = function() {
          var hideSlideLayout = false;
          var hideSlideMaster = false;

          var selector = '[qowt-divtype="slide"][qowt-hideParentSp="true"]';
          var hideSldParentSp = _slideInnerNode.querySelectorAll(selector);
          // Verify if we get some elements matching our criteria.
          // There can be only one such element.
          if (hideSldParentSp && hideSldParentSp[0]) {
            hideSlideLayout = true;
            hideSlideMaster = true;
          }

          // If hideSlideMaster is already true, then no need to check for
          // slide layout.
          if (!hideSlideMaster) {
            selector = '[qowt-divtype="slideLayout"][qowt-hideParentSp="true"]';
            var hideSldLtParentSp = _slideInnerNode.querySelectorAll(selector);
            // Verify if we get some elements matching our criteria.
            // There can be only one such element.
            if (hideSldLtParentSp && hideSldLtParentSp[0]) {
              hideSlideMaster = true;
            }
          }

          _updateVisibilityStyleClass(hideSlideLayout,"hideSlideLayout");
          _updateVisibilityStyleClass(hideSlideMaster,"hideSlideMaster");
        };

        /**
         * Updates visibility style class for the slide inner node.
         * Throws error if, invalid visibilityClass name passed.
         *
         * @param isHidden whether to hide parent shapes.
         * @param visibilityClass class can be hideSlideMaster
         * or hideSlideLayout.
         */
        var _updateVisibilityStyleClass = function(isHidden, visibilityClass) {

          if (visibilityClass !== 'hideSlideMaster' &&
              visibilityClass !== 'hideSlideLayout') {
            throw 'Invalid class passed, ' +
                  'visibility class can be hideSlideMaster or hideSlideLayout';
          }
          // if we want to hide then add style class to slide inner node
          // else remove the class from slide inner node
          if (isHidden) {
            // if the required class is already set, then don't add it again.
            if (!_slideInnerNode.classList.contains(visibilityClass)) {
              _slideInnerNode.classList.add(visibilityClass);
            }
          } else {
            _slideInnerNode.classList.remove(visibilityClass);
          }
        };

        /**
         * animation done handler
         * @param event webkitAnimationEnd dispatched when animation is done
         */
        var _animationDoneHandler = function(event) {
          // Transition
          if (_slideInnerNode === event.target) {
            var effectName = _slideInnerNode.style.webkitAnimationName;
            _slideInnerNode.style.webkitAnimationName = "none";
            /*
             * Dispatching animation done QOWT level event with type as
             * transition and slide index.
             * This event will get captured by transition manager for its
             * further animation scheduling
             */
            DomListener.dispatchEvent(document, "qowt:animationDone", {
              'type': 'transition',
              'slideIndex': _slideIndex,
              "withEffect": effectName
            });
          }
        };


        /**
         * Construct hidden slide overlay
         * @private
         */
        var _constructHideOverlay = function() {
          //prepare and insert before inner node, the slide show hidden layer
          _slideHiddenNode = document.createElement('DIV');
          _slideHiddenNode.classList.add('hidden-slide');

          var opaqueLayer = document.createElement('DIV');
          opaqueLayer.classList.add('opaque-layer');
          _slideHiddenNode.appendChild(opaqueLayer);

          var hiddenMark = document.createElement('DIV');
          hiddenMark.classList.add('hidden-mark');
          _slideHiddenNode.appendChild(hiddenMark);

          //hide the hidden node initially and show it only if slide is really
          //hidden
          _slideHiddenNode.style.display = 'none';

          _slideNode.insertBefore(_slideHiddenNode, _slideInnerNode);
        };

        /**
         * Initialisation method that is called on construction of the widget.
         * This method should cause no HTML render tree relayouts to occur.
         * @api private
         */
        var _init = function() {
          if ((slideIndex === undefined) || (parentNode === undefined)) {
            throw new Error('Slide widget - missing constructor parameters!');
          }

          _slideIndex = slideIndex;
          _isThumbnail = isThumbnail;

          // For the thumbnails we create an index node showing the slide number
          // Thumbnails fire qowt:pointThumbnailClicked when clicked
          if (_isThumbnail === true) {
            _slideNode = new QowtPointThumbnail();
            _slideInnerNode = document.createElement(_kSlideInner_Node.Tag);
            _slideNode.appendChild(_slideInnerNode);
            _slideNode.className = _kSlide_Node.Thumbclass;
            _slideInnerNode.className = _kSlideInner_Node.Thumbclass;
            _slideInnerNode.id = _kSlideInner_Node.Class + _slideIndex;
            _slideNode.classList.add("qowt-point-thumb-placeholder");

            _indexNode = document.createElement(_kIndex_Node.Tag);
            _indexNode.className = _kIndex_Node.Class;
            _slideNode.insertBefore(_indexNode, _slideInnerNode);

            _constructHideOverlay();
            _slideNode.setAttribute('qowt-divtype', 'thumbnail');
          } else {
            _slideNode = document.createElement(_kSlide_Node.Tag);
            _slideInnerNode = document.createElement(_kSlideInner_Node.Tag);
            _slideNode.appendChild(_slideInnerNode);
            _slideNode.className = _kSlide_Node.Class + " " +
                _kSlide_Node.FullScreenClass;
            _slideInnerNode.className = _kSlideInner_Node.Class;
            _slideNode.id = _kSlide_Node.Class;
          }

          // the slideSize class provides the right size of the slide
          _slideNode.classList.add("slideSize");
          _slideInnerNode.classList.add("slideSize");

          _api.setSlideIndex(_slideIndex);

          // append the slide to the specified HTML node
          _api.appendTo(parentNode);

          // set animation end event listener
          _slideInnerNode.addEventListener('webkitAnimationEnd',
              _animationDoneHandler, false);
        };

        _init();
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
