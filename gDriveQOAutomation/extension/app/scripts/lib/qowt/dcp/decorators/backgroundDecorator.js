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
 * BackgroundDecorator
 * ===================
 *
 * A background decorator is responsible for setting the background color of
 * a HTML DOM element
 *
 * @constructor              Constructor for the background decorator
 * @param domElement {node}  Mandatory parameter that is an HTML DOM element
 * @return {object}          A background decorator
 * @method BackgroundDecorator.create(domElement)
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

          var _api = {
            /**
             * Decorates the DOM element with the specified background color
             *
             * @param color {string} The color to set the background to
             * @method decorate(color)
             */
            decorate: function(color) {
              if (color !== undefined) {
                domElement.style.backgroundColor = color;
              }
            },

            /**
             * Undecorates the DOM element of any previously specified
             * background color
             *
             * @method undecorate()
             */
            undecorate: function() {
              domElement.style.backgroundColor = "";
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
