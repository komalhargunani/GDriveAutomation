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
define([
  'qowtRoot/presentation/placeHolder/placeHolderManager'
], function(PlaceHolderManager) {

  'use strict';

  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'sldNt',

    /**
     * Render a Slide notes from DCP
     * @param v {DCP} slide notes DCP JSON
     * @return {DOM Element} slide notes div
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        var docFragment = document.createDocumentFragment();
        var notesDiv = document.createElement('DIV');
        notesDiv.id = "slide-notes-div";

        docFragment.appendChild(notesDiv);

        // we are attaching document fragment to v.node as object. This helps us
        // to avoid cloning of slide notes from thumbnail into slide area.
        v.node.slidenotes = docFragment;

        PlaceHolderManager.resetCurrentPlaceHolderForShape();

        return notesDiv;
      }
      else {
        return undefined;
      }
    }
  };

  return _api;
});
