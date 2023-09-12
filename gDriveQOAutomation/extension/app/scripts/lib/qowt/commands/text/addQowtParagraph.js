/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command to create a new paragraph.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  'qowtRoot/commands/text/addQowtElementBase',
  'qowtRoot/models/env'], function(
  WidowOrphanHelper,
  AddQowtElementBase,
  EnvModel) {

  'use strict';

  var factory_ = {

    /**
     * Creates a new addQowtParagraph command and returns it.
     *
     * @param {Object} context
     * @param {Object} context
     * @param {String} contex.nodeId
     * @param {String} contex.parentId
     * @param {String | undefined} context.siblingId
     * @return {Object} addQowtParagraph command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtParagraph missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtParagraph missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtParagraph missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtParagraph', context);

        /**
         * Creates the paragraph element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {
          var newPara;
          switch (EnvModel.app) {
            case 'word':
              WidowOrphanHelper.unbalanceNode(context.parentId);
              newPara = new QowtWordPara();
              break;
            case 'point':
              newPara = new QowtPointPara();
              break;
            default:
              throw new Error('Unsupported App for paragraph creation');
          }
          newPara.setEid(context.nodeId);

          api_.insertElement_(newPara, context.parentId, context.siblingId,
              context.optFunction);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
