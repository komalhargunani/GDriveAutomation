/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview handle for dcp elements representing ms word bookmarks
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
 'qowtRoot/widgets/document/bookmark'], function(
   BookmarkWidget) {

  'use strict';

    var _api = {

      /**
       * DCP Type Code is used by the DCP Manager to register this handler.
       */
      etp: 'bmk',

      /**
       * Render a Hyperlink element from DCP
       * @param {DCP} dcp The DCP to process.
       * @return {DOM Element} the html element to continue using during
       *                       dcp processing.
       */
      visit: function(dcp) {
        // Validate etp and eid attribute
        if (dcp && dcp.el && dcp.el.etp &&
            dcp.el.etp === _api.etp && dcp.el.eid) {

          var widget = BookmarkWidget.create({
            newBookmarkId: dcp.el.eid,
            bookmarkName: dcp.el.bmkName
          });

          if (widget) {
            widget.appendTo(dcp.node);
          }
        }

        // NOTE: for now bookmark anchors are kept IN FRONT of
        // the character run that it marks. Rather than wrapping
        // around the char run. So for dcp processing to continue
        // we return the dcp.node, not the widget node.
        // If we need nesting in the future, then just return
        // the widget node here.
        return dcp.node;
      }
    };

    return _api;
  });