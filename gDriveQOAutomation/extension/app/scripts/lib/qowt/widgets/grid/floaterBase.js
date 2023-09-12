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
 * SheetFloaterBase
 * ================
 *
 * A sheet floater base widget is used as the base of a 'real' floater
 * widget - e.g. a merge cell or a chart.
 * This module defines the set of common methods that every type of floater
 * widget must provide an implementation of.
 * This module provides the default implementation of these methods as throwing
 * an exception, to ensure that 'real' widgets override this and provide their
 * own implementations.
 *
 * @constructor Constructor for the Sheet Floater Base widget
 * @param floaterType {string} Mandatory parameter indicating the type of the
 * floater being created
 * @return {object} A Sheet Floater Base widget.
 */
define([], function() {

  'use strict';


  var _factory = {

    create: function(floaterType) {

      // use module pattern for instance object
      var module = function() {

          if ((floaterType === undefined) ||
              (typeof(floaterType) !== "string")) {
            throw ("SheetFloaterBase - Constructor has missing " +
                "or invalid parameter [floaterType]");
          }

          /*!
           *
           */
          var _api = {

            /**
             * Gets the type of the floater widget
             *
             * @return {string} The type of the floater widget
             * @method getType()
             */
            getType: function() {
              return floaterType;
            },

            /**
             * Gets the number of rows which the floater widget spans
             *
             * @return {integer} The row span
             * @method rowSpan()
             */
            rowSpan: function() {
              throw ("SheetFloaterBase - undefined rowSpan() method called!");
            },

            /**
             * Gets the number of colunns which the floater widget spans
             *
             * @return {integer} The column span
             * @method colSpan()
             */
            colSpan: function() {
              throw ("SheetFloaterBase - undefined colSpan() method called!");
            },

            /**
             * Returns whether another floater widget matches this one
             *
             * @param floater {object} Another floater widget
             * @return {boolean} True if the floaters are the same, false
             * otherwise
             * @method isMatchingFloater()
             */
            isMatchingFloater: function(/* floater */) {
              throw ("SheetFloaterBase - undefined isMatchingFloater() " +
                  "method called!");
            },

            /**
             * Updates the floater widget's position and height and width
             * dimensions
             *
             * @param topPos {integer} The top position of the floater widget
             * @param leftPos {integer} The left position of the floater widget
             * @param height {integer} The height of the floater widget
             * @param width {integer} The width of the floater widget
             * @method updatePositionAndDimensions(topPos, leftPos,
             *  height, width)
             */
            updatePositionAndDimensions: function(/* topPos, leftPos,
                                                      height, width */) {
              throw ("SheetFloaterBase - undefined " +
                  "updatePositionAndDimensions()method called!");
            },

            /**
             * Returns whether or not the supplied target is within the range of
             * this floater widget.
             *
             * @param rowIndex {integer} The row index of the cell to check
             * @param colIndex {integer} The column index of the cell to check
             * @param posX {integer} Optional parameter containing a
             * X coordinate
             * @param posY {integer} Optional parameter containing a
             * Y coordinate
             * @return {boolean} Returns true if the supplied target is within
             * the range of this floater
             * @method isContained()
             */
            isContained: function(/* rowIndex, colIndex, posX, posY */) {
              throw ("SheetFloaterBase - undefined " +
                  "isContained() method called!");
            },

            /**
             * Sets the floater widget's display property
             *
             * @param display {string} The CSS display property value
             * @method setDisplay(display)
             */
            setDisplay: function(/* display */) {
              throw ("SheetFloaterBase - undefined " +
                  "setDisplay() method called!");
            },

            /**
             * Returns whether or not this floater widget can be selected
             *
             * @return {boolean} Returns true if this floater widget can be
             * selected or false if it can't
             * @method isSelectable()
             */
            isSelectable: function() {
              throw ("SheetFloaterBase - undefined " +
                  "isSelectable() method called!");
            }
          };

          /**
           * @api private
           */
          var _init = function() {};

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
