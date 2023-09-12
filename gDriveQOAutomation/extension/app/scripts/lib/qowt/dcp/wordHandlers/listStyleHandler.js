define([
  'qowtRoot/dcp/utils/listStyleManager'
], function(
  ListStyleManager) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'liststyleinfo',

    /**
     * This is the main Handler function that processes DCP
     * @param {Object} elm Arbitrary DCP.
     * @return {element} Not used currently.
     *
     * The structure _listStyle is prepared and published.
     * This structure is used by ListStyleUtils to provide
     * Level related information.
     */
    visit: function(elm) {
      // A local variable to store the Abstract Numbering Information
      var localAbs = {};

      // The AbstractNumbering object is retro fitted in a Key-Value Pair for
      // faster lookups to avoid a search across the array. The key over here is
      // the absNumId, while the value is the AbstractNumbering object itself.
      if (elm.el.absnum !== undefined) {
        for (var j = 0; j < elm.el.absnum.length; j++) {
          localAbs[elm.el.absnum[j].absnumid] = elm.el.absnum[j];
        }

        var _listStyle =
          {"absnum": localAbs, "num": elm.el.num, "etp": elm.el.etp};

        ListStyleManager.setNumbering(_listStyle);
      }

      return elm;
    },

    getListStyle : function(){
      return _listStyle;
    }

  };

  var _listStyle;

  return _api;
});
