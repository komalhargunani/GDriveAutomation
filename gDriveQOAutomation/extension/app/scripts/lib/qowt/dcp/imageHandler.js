/**
 * @fileOverview Image DCP Handler; processes DCP data for image resources.
 *
 * @author Alok Guha (alok.guha@quickoffice.com)
 *         Dan Tilley (dtilley@google.com)
 */
define([
  'qowtRoot/models/env',
  'qowtRoot/widgets/image/image',
], function (
  EnvModel,
  ImageWidget) {

  'use strict';

  var _api = {

    // DCP Type Code is used by the DCP Manager to register this handler.
    'etp':'img',

    /**
     * Process a DCP message for image elements.
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      if (dcp && dcp.el && dcp.el.etp &&
          dcp.el.etp === _api.etp && dcp.el.eid) {
        var widgetNode, imageWidget;
        // TODO(sakhyaghosh): look into how to merge word and point
        // solutions of inlined images.
        if (document.querySelector('qowt-msdoc')) {
          var imageElement = new QowtWordImage();
          imageElement.setEid(dcp.el.eid);
          imageElement.setModel(dcp.el);
          widgetNode = imageElement;
        } else {
          imageWidget = ImageWidget.create({
            newId: dcp.el.eid,
            format: dcp.el
          });
          widgetNode = imageWidget.getWidgetElement();
        }
        if (widgetNode) {
          if (EnvModel.app === 'word') {
            dcp.node.insertBefore(widgetNode, dcp.node.lastChild);
          } else {
            Polymer.dom(dcp.node).appendChild(widgetNode);
            Polymer.dom(dcp.node).flush();
          }
        }

        return widgetNode;
      }
      return undefined;
    }

  };

  return _api;

});
