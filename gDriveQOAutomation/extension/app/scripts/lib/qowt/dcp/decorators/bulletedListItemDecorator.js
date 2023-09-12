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
 * BulletedListItemDecorator
 * =========================
 *
 * A module for generating new BulletedListItemDecorator instances on demand.
 *
 * The client asks this factory for a new decorator instance
 * and then calls the returned decorator to adorn the target
 * element with supplied formatting information.
 *
 * Typical usage:
 * var decorator = BulletedListItemDecorator.create(element);
 * decorator.decorate(formatting);
 *
 *
 * @author hussain.pithawala@quickoffice.com (Hussain Pithawala)
 */

define(['qowtRoot/dcp/decorators/baseListItemDecorator'],
  function(BaseListItemDecorator) {

  'use strict';


    var _factory = {

      /**
       * Create a new Paragraph Decorator instance.
       *
       * @param {Element} elm A valid dcp element, which helps in decoration
       *                  ( Refer to BaseListItemDecorator)
       * @return {BulletedListItemDecorator} A new decorator instance.
       */
      create: function(elm) {
        if (!elm) {
          throw ('createDecorator must be given an element.');
        }

        // use module pattern for instance object
        var module = function() {

          var _api = BaseListItemDecorator.create(elm);

          if (!_api) {
            return undefined;
          }

          /**
           * BaseListItemDecorator.decorate() is overridden
           * in this module, however we need to delegate to the
           * base class API, from the overridden API.
           * In this case we need to shift the base class
           * API to the base
           */
          _api.base = {};

          _api.base.decorate  = _api.decorate;

          _api.decorate = function(props) {
            var _pseudoCSS = {};

            var levelText = _api.getLevel().lvltxt;

            /**
             * Why decoding ? In order to provide a formatted value
             * to the CSS's pseduo element's content property.
             * We need the a UniCode character in HexaDecimal representation.
             */
            var decodedValue = levelText.charCodeAt(0).toString(16);

            // The representation of the Unicode character as required by Pseudo
            // CSS element
            var newText = '\'\\' + decodedValue + '\'';

            _pseudoCSS.content = newText;

            props.PseudoCSS = _pseudoCSS;

            // call the base decorator
            _api.base.decorate(props);
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
