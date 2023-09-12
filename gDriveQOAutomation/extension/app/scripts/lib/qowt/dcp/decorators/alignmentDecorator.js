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
 * AlignmentDecorator
 * ==================
 *
 * An alignment decorator is responsible for setting the horizontal
 * and vertical alignment of a HTML DOM element
 *
 * @constructor              Constructor for the alignment decorator
 * @param domElement {node}  Mandatory parameter that is an HTML DOM element
 * @return {object}          An alignment decorator
 * @method AlignmentDecorator.create(domElement)
 */

define([], function() {

  'use strict';


  var _factory = {

    create: function(domElement) {

      if (domElement === undefined) {
        throw ("Constructor was not provided with a DOM element");
      }

      // use module pattern for instance object
      var module = function() {

          var _kHorizontal_Alignment_Right_Class =
            "qowt-horizontal-align-right",
            _kHorizontal_Alignment_Center_Class =
              "qowt-horizontal-align-center",
            _kHorizontal_Alignment_Left_Class = "qowt-horizontal-align-left",
            _kHorizontal_Alignment_Justify_Class =
              "qowt-horizontal-align-justify",

            _kVertical_Alignment_Top_Class = "qowt-vertical-align-top",
            _kVertical_Alignment_Center_Class = "qowt-vertical-align-center",
            _kVertical_Alignment_Bottom_Class = "qowt-vertical-align-bottom";

          var _api = {
            /**
             * Decorates the DOM element with the specified horizontal and
             * vertical alignments
             *
             * @param horizontalAlignment {string} A string indicating the type
             *                                     of horizontal alignment -
             *                                     'left', 'right', 'centre' or
             *                                     'justified'
             * @param verticalAlignment {string}   A string indicating the type
             *                                     of vertical alignment -
             *                                     'top', 'centre' or 'bottom'
             * @method decorate(horizontalAlignment, verticalAlignment)
             */
            decorate: function(horizontalAlignment, verticalAlignment) {

              if (horizontalAlignment !== undefined) {
                _api.setHorizontalAlignment(horizontalAlignment);
              }

              if (verticalAlignment !== undefined) {
                _api.setVerticalAlignment(verticalAlignment);
              }
            },

            /**
             * Undecorates the DOM element
             *
             * @method undecorate()
             */
            undecorate: function() {
              domElement.classList.remove(_kHorizontal_Alignment_Left_Class);
              domElement.classList.remove(_kHorizontal_Alignment_Center_Class);
              domElement.classList.remove(_kHorizontal_Alignment_Justify_Class);
              domElement.classList.remove(_kHorizontal_Alignment_Right_Class);

              domElement.classList.remove(_kVertical_Alignment_Center_Class);
              domElement.classList.remove(_kVertical_Alignment_Bottom_Class);
              domElement.classList.remove(_kVertical_Alignment_Top_Class);
            },

            /**
             * Gets the horizontal alignment position
             *
             * @return {string} The horizontal alignment position
             */
            getHorizontalAlignment: function() {
              var alignmentPos;
              var className = domElement.className;
              if(className) {
                 if(className.
                   indexOf(_kHorizontal_Alignment_Right_Class) !== -1) {
                  alignmentPos = "r";
                }
                else if(className.
                   indexOf(_kHorizontal_Alignment_Center_Class) !== -1) {
                  alignmentPos = "c";
                }
                else if(className.
                   indexOf(_kHorizontal_Alignment_Justify_Class) !== -1) {
                  alignmentPos = "j";
                }
                else if(className.
                   indexOf(_kHorizontal_Alignment_Left_Class) !== -1) {
                  alignmentPos = "l";
                }
              }
              return alignmentPos;
            },

            /**
             * Gets the vertical alignment position
             *
             * @return {string} The vertical alignment position
             */
            getVerticalAlignment: function() {
              var alignmentPos;
              var className = domElement.className;
              if(className) {
                 if(className.indexOf(_kVertical_Alignment_Top_Class) !== -1) {
                  alignmentPos = "t";
                }
                else if(className.
                   indexOf(_kVertical_Alignment_Center_Class) !== -1) {
                  alignmentPos = "c";
                }
                else if(className.
                   indexOf(_kVertical_Alignment_Bottom_Class) !== -1) {
                  alignmentPos = "b";
                }
              }
              return alignmentPos;
            },

            /**
             * Sets the horizontal alignment position
             *
             * @param {string} alignmentPos The horizontal alignment position
             */
            setHorizontalAlignment: function(alignmentPos) {
              switch (alignmentPos) {
                case 'right':
                case 'r':
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Left_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Center_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Justify_Class);
                  domElement.classList.add(_kHorizontal_Alignment_Right_Class);
                  break;
                case 'centre':
                case 'c':
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Left_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Right_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Justify_Class);
                  domElement.classList.add(_kHorizontal_Alignment_Center_Class);
                  break;
                case 'justified':
                case 'j':
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Left_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Right_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Center_Class);
                  domElement.classList.add(
                      _kHorizontal_Alignment_Justify_Class);
                  break;
                case 'left':
                case 'l':
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Right_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Center_Class);
                  domElement.classList.remove(
                      _kHorizontal_Alignment_Justify_Class);
                  domElement.classList.add(_kHorizontal_Alignment_Left_Class);
                  break;
                default:
                  // NO EFFECT
                  break;
                }
            },

            /**
             * Sets the vertical alignment position
             *
             * @param {string} alignmentPos The vertical alignment position
             */
            setVerticalAlignment: function(alignmentPos) {
              switch (alignmentPos) {
                case 'top':
                case 't':
                  domElement.classList.remove(
                      _kVertical_Alignment_Center_Class);
                  domElement.classList.remove(
                      _kVertical_Alignment_Bottom_Class);
                  domElement.classList.add(_kVertical_Alignment_Top_Class);
                  break;
                case 'centre':
                case 'c':
                  domElement.classList.remove(_kVertical_Alignment_Top_Class);
                  domElement.classList.remove(
                      _kVertical_Alignment_Bottom_Class);
                  domElement.classList.add(_kVertical_Alignment_Center_Class);
                  break;
                case 'bottom':
                case 'b':
                  domElement.classList.remove(_kVertical_Alignment_Top_Class);
                  domElement.classList.remove(
                      _kVertical_Alignment_Center_Class);
                  domElement.classList.add(_kVertical_Alignment_Bottom_Class);
                  break;
                default:
                  // NO EFFECT
                  break;
              }
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
