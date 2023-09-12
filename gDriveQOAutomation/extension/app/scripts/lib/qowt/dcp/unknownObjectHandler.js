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
define([],
    function() {

  'use strict';



  /* This is a global variable used to always point
     at the current element the handler is processing */
     var _div;

  /* Global variable that determines if this handler
     should use an image or text to render the x */
  // TODO: Move to dcp model ?
  //       Make this overrideable for platforms
     var _UOimg = true;

  var _api = {
    /* DCP Type Code
       This is used by the DCP Manager to register this Handler */
       etp: 'uo',

    /**
     * This is the main Handler function that processes DCP
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
       visit: function(dcp) {
        // Error check to see if this is the correct Handler for this DCP
           if(dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp)) {

               _createDiv();
               _setDivId(dcp.el.eid);
            // If the height width ratio is 1 the service only
            // sends height to save bandwidth
               if(dcp.el.hgt && !dcp.el.wdt) { dcp.el.wdt = dcp.el.hgt; }
            // TODO: Set default UO height/width in model?
            // Note: Defaults also in the CSS stylesheet
               if(dcp.el.hgt || dcp.el.wdt) {
                   var h = dcp.el.hgt || 35;
                   var w = dcp.el.wdt || 35;
                   _setDimensions(h, w);
               }
               if(!_UOimg) { _setContent(); }
               _setClass();
               if(dcp.node && dcp.node.appendChild) {
                   dcp.node.appendChild(_div);
               }
               return _div;

           } else {
               return undefined;
           }
       },

    // Inter-render operation functions
       buildUO: function(eid, hgt, wdt) {
           _createDiv();
           _setDivId(eid);
           if(hgt && !wdt) { wdt = hgt; }
           if(hgt || wdt) {
               var h = hgt || 35;
               var w = wdt || 35;
               _setDimensions(h, w);
           }
           if(!_UOimg) { _setContent(); }
           _setClass();
           return _div;
       }

  };

  var _createDiv = function() {
      _div = document.createElement('DIV');
  };

  var _setDivId = function(eid) {
      _div.id = eid;
  };

  var _setContent = function() {
      _div.textContent = 'X';
  };

  var _setDimensions = function(h, w) {
      _div.style.height = h+'px';
      _div.style.width  = w+'px';
  };

  var _setClass = function() {
      _div.classList.add('qowt-uo');
      if(_UOimg) { _div.classList.add('qowt-uo-img'); }
      _div.classList.add('qowt-uneditable');
  };

  return _api;
});
