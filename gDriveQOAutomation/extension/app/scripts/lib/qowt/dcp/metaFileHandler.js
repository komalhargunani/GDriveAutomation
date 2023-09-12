/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/unknownObjectHandler',
  'qowtRoot/drawing/geometry/metaFilePainter'
],
  function(UnknownObjectHandler, MetaFilePainter) {

  'use strict';

    var _SUPPORTED_METAFILE_FORMATS = {
      'wmf': true,
      'emf': true,
      'svg': false
    };

    var _computeScaleFactor = function(actualExtents, shapeHeight, shapeWidth) {
      var scaleFactor = {};
      scaleFactor.x = shapeWidth / actualExtents.cy;
      scaleFactor.y = shapeHeight / actualExtents.cx;
      return scaleFactor;
    };

    var _api = {

      /**
       * DCP Type Code is used by the DCP Manager to register this handler.
       */
      etp: 'mf',

      /**
       * This is the main Handler function that processes DCP
       * @param {Object} dcp Arbitrary DCP.
       * @return {Element || undefined} A meta file element.
       */
      visit: function(dcp) {
        // Error check to see if this is the correct Handler for this DCP
        if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp)) {

          var newMetaFileDiv, metafileDiv, metaFileCanvas;

          var metaFileResponse = dcp.el;

          var shapeHeight = metaFileResponse.hgt;
          var shapeWidth = metaFileResponse.wdt;

          //Devesh TODO: below condition-check (with else part) is word-specific
          //code, which should go away after proper EMF handling, story QW-1241.
          //We should not have 'do' attribute in the DCP response.
          if (metaFileResponse['do']) {
            // Using a key string here because do is a reserved word

            if (metaFileResponse['do'] === 'c') {
              newMetaFileDiv = true;
            } else if (metaFileResponse['do'] === 'u') {
              newMetaFileDiv = false;
              metafileDiv =
                window.document.getElementById(metaFileResponse.eid);
              // This DCP response is from a getDCP call
              // If we cannot get the original element from the document
              // it must have been removed for some reason, most likely
              // the user deleted it, we should not process this response
              if (!metafileDiv) {
                return undefined;
              }
              if (metafileDiv) {
                metaFileCanvas = metafileDiv.
                  getElementById(metaFileResponse.eid + 'canvasElm');
              }
            } else {
              newMetaFileDiv = false;
              metafileDiv =
                window.document.getElementById(metaFileResponse.eid);
              if (metafileDiv) {
                metaFileCanvas = metafileDiv.
                  getElementById(metaFileResponse.eid + 'canvasElm');
              }
            }
          } else {
            newMetaFileDiv = false;
            metafileDiv =
              window.document.getElementById(dcp.node.id + 'mfCanvas');
            if (metafileDiv) {
              metaFileCanvas =
                metafileDiv.getElementById(dcp.node.id + 'canvasElm');
            }
          }

          // Check metafile format if present in the DCP
          if (metaFileResponse.frmt) {
            if (!_SUPPORTED_METAFILE_FORMATS[metaFileResponse.frmt]) {
              metafileDiv = UnknownObjectHandler.
                buildUO(metaFileResponse.eid, shapeHeight, shapeWidth);
              dcp.node.appendChild(metafileDiv);
              return metafileDiv;
            }
          }

          if (!metafileDiv) {

            metafileDiv = window.document.createElement('DIV');

            metaFileCanvas = window.document.createElement('canvas');
            metafileDiv.style.position = 'absolute';
            metafileDiv.style.display = 'inline-block';

            metafileDiv.setAttribute('ismetafile', 'true');
            if (metaFileResponse.eid) {
              metafileDiv.id = metaFileResponse.eid;
              metaFileCanvas.id = metaFileResponse.eid + 'canvasElm';
            } else {
              metafileDiv.id = dcp.node.id + 'mfCanvas';
              metaFileCanvas.id = dcp.node.id + 'canvasElm';
            }
            metaFileCanvas.height = shapeHeight;
            metaFileCanvas.width = shapeWidth;
            metaFileCanvas.style.position = "absolute";
            metaFileCanvas.style['z-index'] = 2;

            metafileDiv.appendChild(metaFileCanvas);
            newMetaFileDiv = true;
          }

          /**
           * Shallow DCP Handling
           * If this element we are currently handling contains a
           * large amount of information it may have had certain
           * portions of that data omitted for performance reasons
           * and additionally so that the DCP payload is not too large
           * that it may overload low spec'd devices
           * These types of elements will have a true shal attribute
           * when we encounter one of these we add a new command
           * that will request the full DCP of this element
           * Currently only WMF MetaFiles can be shallow
           */
          //Devesh TODO: below condition-check is word-specific code,
          // which should go away after proper EMF handling, story QW-1241.
          if (metaFileResponse.hasOwnProperty('shal') &&
              metaFileResponse.shal) {
            metafileDiv.classList.add('qowt-shallow-element');
          }

          if (newMetaFileDiv) {
            Polymer.dom(dcp.node).appendChild(metafileDiv);
            Polymer.dom(dcp.node).flush();
          }
          if (metaFileResponse.pathLst && metaFileResponse.pathLst.length) {
            //Devesh TODO: below line is word-specific code,
            // which should go away after proper EMF handling, story QW-1241.
            metafileDiv.classList.remove('qowt-shallow-element');

            var scaleFactor = _computeScaleFactor(metaFileResponse.ext,
              shapeHeight, shapeWidth);
            MetaFilePainter.paintCanvas(metaFileCanvas,
              metaFileResponse.pathLst, scaleFactor);
          }

          //get the below fixed from Priya, from DCP.
          if (metaFileResponse.elm && metaFileResponse.elm.length > 0) {
            var imageId = metaFileResponse.elm[0].eid;
            if (!imageId) {
              metaFileResponse.elm[0].eid = dcp.node.id + 'mfIMG';
            }
          }
          // return the dcp.node now as if image is present in this DCP, then we
          // want canvas and img to be siblings of each other.
          return metafileDiv;

        } else {
          return undefined;
        }
      }
    };

    return _api;
  });
