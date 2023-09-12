define([
    'qowtRoot/models/word'], function(
    WordModel) {

  'use strict';



  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'bls',

    visit: function(v) {
      if (v.el.etp !== 'bls' || v.el.eid === undefined) {
        return undefined;
      }
      // DS: Santa viewOnly hack to preserve list context without modifying
      // service
      WordModel.currentListLevel++;
      // The listItemHandler now needs to know whether it is handling a bullet
      // list item or a numbered list item (for the time being)
      WordModel.
        currentListLevelRenderType[WordModel.currentListLevel] = "bullet";
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
      // DS: Santa viewOnly hack to preserve list context without modifying
      // service
      WordModel.currentListLevel--;
      // DS: End
    },

    /**
     * Initialize module
     */
    init: function() {
      _init();
    },

    /**
     * Reset the defaults
     *
     */
    disable: function() {
      _reset();
    }

  };

  function _init() {
    /**
     * TODO: Remove list container/list nesting from DCP and send up
     * list-specific data per list item; - listLevel, listStyleType
     * Until this is done we'll need to track the list data per nested list,
     * and using the model to do this.
     */
    WordModel.currentListLevel = WordModel.currentListLevel || -1;


    /**
     * As we no longer render nested list containers we need a different way
     * to track changing list style types per list level.
     */

    // TODO: Fix for QOCHROME-185/HTMLOFFICE-583: That doc had bullets at level
    // 9!
    // So just extending the default bullet character scheme to cover this.
    WordModel.bulletListTypeLevels = WordModel.bulletListTypeLevels ||
      ['disc', 'circle', 'square', 'disc', 'circle', 'square', 'disc', 'circle',
       'square', 'disc'];
    WordModel.currentListLevelRenderType =
      WordModel.currentListLevelRenderType ||
        [undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined];

  }

  /**
   * Reset the defaults and clean up all resources if any.
   * Note init() must be called after reset so the module is ready for use.
   *
   */
  function _reset() {
    WordModel.currentListLevel = -1;
    WordModel.bulletListTypeLevels = undefined;
    WordModel.currentListLevelRenderType = undefined;
  }

  return _api;
});
