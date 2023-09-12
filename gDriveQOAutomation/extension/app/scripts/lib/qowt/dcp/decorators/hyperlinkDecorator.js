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
 * JsDoc description
 */
define(['qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/features/utils',
  'qowtRoot/models/point'
], function(ColorUtility, QOWTMarkerUtils, Features, PointModel) {

  'use strict';

  var _visitedLinks = {}; // Holds a URL as key and it's visited state as value

  /**
   * Marks a link as visited
   * @param {string} lnk  The link URL to mark as visited
   * @private
   */
  var _markLinkAsVisited = function(lnk) {
    if (lnk) {
      _visitedLinks[lnk] = true;
    }
  };

  /**
   * Checks if a link URL has been previously clicked/visited/followed.
   *
   * @param {string} lnk  The link URL to check
   * @return {boolean}  Returns true if the link has been previously marked as
   * visited. False otherwise.
   * @private
   */
  var _isLinkVisited = function(lnk) {
    return !!_visitedLinks[lnk];
  };

  var _factory = {

    create: function() {

      /**
       * handles click event on shape div
       * @param event - mouse click event
       */
      var _handleShapeHyperlinkClick = function(event) {
        // As per MS-Point, if shape has hyperlink and got clicked then in
        // normal view it shows selected and in slide show mode it opens
        // targeted link. To achieve this, added following check.
        // Now if shape has hyperlink and got clicked then for viewer,
        // targeted link would opened for normal as well as slide show mode and
        // for editor, shape would get selected in normal view and target link
        // would get opened in slide show mode.
        // TODO (bhushan.shitole): Remove pointEdit condition once we have a
        // standard point editor.
        if (Features.isEnabled('edit') && Features.isEnabled('pointEdit')) {
          return;
        }

        var target = event.target;
        if (target.parentNode.nodeName !== 'SPAN') {
          var lnk = QOWTMarkerUtils.fetchQOWTMarker(this, 'hyperlink');
          window.open(lnk, "_blank");
        }
        event.stopPropagation();
      };

      /**
       handles click on text hyperlink
       @param event - mouse click event
       */
      var _handleTextHyperlinkClick = function(event) {
        var lnk = QOWTMarkerUtils.fetchQOWTMarker(this, 'textHyperlink');

        // TODO (murtaza.haveliwala): Remove pointEdit condition once we have a
        // standard point editor.
        if ((Features.isEnabled('pointEdit') && !PointModel.slideShowMode) ||
            !lnk){
          // Note: we do not want to stop event propagation for point editor
          // build and when we are in edit(non-slideshow) mode. Nor do we want
          // to follow the link.
          return;
        }

        // If the hyperlinked-text's span is clicked for the first time,
        // add visited class to all hyperlinked-text spans that have same
        // URL to make it look like they all were visited
        if (!_isLinkVisited(lnk)) {
          var selector = 'span[qowt-marker="textHyperlink<' + lnk + '>;"]';
          var similarLinks = document.querySelectorAll(selector),
              similarLinksCount = similarLinks.length;
          for (var i = 0; i < similarLinksCount; i++) {
            similarLinks[i].style.color = ColorUtility.
                getHexEquivalentOfSchemeColor('folHlink');
          }
          // Mark link as visited to avoid adding again the css class and
          // re-applying it over all similar links
          _markLinkAsVisited(lnk);
        }

        window.open(lnk, "_blank");
        event.stopPropagation();
      };

      // use module pattern for instance object
      var module = function() {

        var _api = {
          /**
           * Hyperlink decorator function.
           * Wrap child node in anchor tag and returns anchor tag itself
           * @param node the node to which hyperlink is to be applied. it could
           *             be any HTML element (e.g. span / div / image)
           */
          decorate: function(node) {

            var _localApi = {
              /**
               * Decorate node using link target
               */
              withLinkForText: function() {
                if (node) {
                  var link = QOWTMarkerUtils.fetchQOWTMarker(node,
                    'textHyperlink');
                  node.addEventListener("click", _handleTextHyperlinkClick,
                    true);

                  // In case we are re-rendering (happens sometimes when we
                  // exit slideshow mode), and the link was previously
                  // visited, add the visited class to it to make it look like
                  // one
                  if (_isLinkVisited(link)) {
                    node.style.color = ColorUtility.
                        getHexEquivalentOfSchemeColor('folHlink');
                  }
                }
              },

              /**
               * decorates the shape with hyperlink
               */
              withLinkForShape: function() {
                if (node) {
                  node.addEventListener("click", _handleShapeHyperlinkClick,
                    true);
                  node.classList.add('qowt-point-shapeLink');
                }
              }
            };
            return _localApi;
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
