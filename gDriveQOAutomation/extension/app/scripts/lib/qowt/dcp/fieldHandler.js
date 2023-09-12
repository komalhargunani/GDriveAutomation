/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
// TODO: Commets needed
define([
  'qowtRoot/controls/document/fieldManager'
],
  function(FieldManager) {

  'use strict';

    var _api = {

      /**
       * DCP Type Code is used by the DCP Manager to register this handler.
       */
      'etp': 'fld',


      /**
       * This is the main Handler function that processes DCP
       * @param dcp {Object} Arbitrary DCP
       * @return {Element || undefined}
       */
      visit: function(v) {
        var fld;
        if (v.el.etp !== 'fld' || v.el.eid === undefined) {
          return undefined;
        }

        if (v.el.type) {
          var widgetConfig = {
              newFieldId: v.el.eid,
              fieldType: v.el.type,
              format: v.el.format,
              lang: v.el.lang
          };
          _widget = FieldManager.getWidgetForConfig(widgetConfig);

          if (_widget) {
            _widget.appendTo(v.node);
          }

          return _widget ? _widget.getWidgetElement() : undefined;
        }

        return fld;
      },


      /**
       * postTraverse gets called *after* all child elements have been handled.
       *
       */
      postTraverse: function() {
        _widget = undefined;
      }

    };
    // vvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvv
    var _widget;


    return _api;
  });
