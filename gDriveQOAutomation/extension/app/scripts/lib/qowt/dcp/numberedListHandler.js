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
  'qowtRoot/models/word'
  ], function(WordModel) {

  'use strict';




    /**
     * TODO: Remove list container/list nesting from DCP and send up
     * list-specific data per list item; - listLevel, listStyleType (or better
     * a reference to list style)
     *
     *  When this is done then this dcpHandler should also be removed and
     * listItemHandler modified to work with the new list DCP.
     *
     * Until this is done we'll need to track the list data per nested list,
   * and using the word model to do this.
     */
  WordModel.currentListLevel = WordModel.currentListLevel || -1;


    /**
     * As we no longer render nested list containers we need a different way
     * to track changing list style types per list level. Store currently set
     * list style type per level. (This may change with list styles read from
     * DOM)
     */
  WordModel.listStyleTypeRenderStack = WordModel.listStyleTypeRenderStack ||
    [undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined];
  WordModel.currentListLevelRenderType = WordModel.currentListLevelRenderType ||
    [undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined];
  WordModel.renderListMultiLevel = WordModel.renderListMultiLevel || [];
  WordModel.currentListLevelCounter = WordModel.currentListLevelCounter ||
    [1, 1, 1, 1, 1, 1, 1, 1, 1];
  WordModel.listPattern = WordModel.listPattern || [];

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'nls',



        visit: function(v) {
            if (v.el.etp !== 'nls' || v.el.eid === undefined) {
                return undefined;
            }

            // Santa viewOnly hack to preserve list context without modifying
            // service
      WordModel.currentListLevel++;
            // The listItemHandler now needs to know whether it is handling a
            // bullet list item or a numbered list item (for the time being)
      WordModel.
        currentListLevelRenderType[WordModel.currentListLevel] = "number";

            // DS: Record the list style type for this list level

            WordModel.renderListMultiLevel.push(v.el.out === true);

            // Record the formatStyle and phidx(placehoder index)
            WordModel.
              listPattern.push({fmtStyle: v.el.fmtstyle, phidx: v.el.phidx});
            // DS: end

        return undefined;

        },

        /**
         * postTraverse gets called *after* all child elements have been handled
         * this can be used to only add our new element to the DOM *after* the
         * children have been handled to reduce the number of DOM calls that are
         * made.
         */
        postTraverse: function() {
            // DS: Santa viewOnly hack to preserve list context without
            // modifying service
      WordModel.currentListLevel--;
      WordModel.renderListMultiLevel.pop();
            WordModel.listPattern.pop();
            // DS: End
        }

    };

    return _api;
});
