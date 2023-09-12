/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview QOWT command to create a new character run.
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
     * Creates a new addQowtCharacterRun command and returns it.
     *
     * @param {Object} context
     * @param {Object} context
     * @param {String} contex.nodeId
     * @param {String} contex.parentId
     * @param {String | undefined} context.siblingId
     * @return {Object} addQowtCharacterRun command.
     */
    create: function(context) {
      if (!context) {
        throw new Error('addQowtCharacterRun missing context');
      }
      if (!context.nodeId) {
        throw new Error('addQowtCharacterRun missing nodeId');
      }
      if (!context.parentId) {
        throw new Error('addQowtCharacterRun missing parentId');
      }

      return (function() {

        var api_ = AddQowtElementBase.create('addQowtCharacterRun', context);

        /**
         * Creates the character run element and adds it to the DOM.
         * @override
         */
        api_.changeHtml = function() {

          var newCharRun;
          switch (EnvModel.app) {
            case 'word':
              WidowOrphanHelper.unbalanceNode(context.parentId);
              newCharRun = new QowtWordRun();
              //On undo remove the temporary run and insert the actual run.
              var para = document.getElementById(context.parentId);
              if (para instanceof QowtWordPara) {
                para.removeRunIfNeeded();
              }
              break;
            case 'point':
              newCharRun = new QowtPointRun();
              break;
            default:
              throw new Error('Unsupported App for charRun creation');
          }
          newCharRun.setEid(context.nodeId);

          api_.insertElement_(newCharRun, context.parentId, context.siblingId,
              context.optFunction);
        };

        return api_;

      })();

    }

  };

  return factory_;

});
