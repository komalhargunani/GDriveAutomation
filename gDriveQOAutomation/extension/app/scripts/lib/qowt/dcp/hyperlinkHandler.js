/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([], function() {

  'use strict';

    var _api = {

      /**
       * DCP Type Code is used by the DCP Manager to register this handler.
       */
      etp: 'hlk',

      /**
       * Render a Hyperlink element from DCP
       * @param {DCP} dcp The DCP to process.
       * @return {DOM Element} A hyperlink element.
       */
      visit: function(dcp) {
        var hyperlinkElement;
        // Validate etp and eid attribute
        if (dcp && dcp.el && dcp.el.etp &&
            dcp.el.etp === _api.etp && dcp.el.eid) {

          hyperlinkElement = new QowtHyperlink();
          hyperlinkElement.setEid(dcp.el.eid);
          hyperlinkElement.setModel(dcp.el);
          dcp.node.appendChild(hyperlinkElement);
        }
        return hyperlinkElement;
      }
    };

    // vvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvv

    return _api;
  });
