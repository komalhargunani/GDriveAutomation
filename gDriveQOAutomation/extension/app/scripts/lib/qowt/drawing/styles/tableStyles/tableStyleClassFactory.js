// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview TableStyleClassFactory generates suitable css classname as per
 * table part style.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */


define([],function(){

  'use strict';

  /**
   * private Class with responsibility of generating table css style-class
   * names.
   * @param {String} type - qowt div-type element.
   * @private {Class}.
   * @constructor
   */
  var ClsTableStyle = function(type) {
    this.type = type;
  };

  /**
   * public function of the private class - ClsTableStyle.
   * calculates the css style class name, for the table cell text.
   * @param {String} classPrefix - table css style class prefix.
   * @return {String} table text css style class name.
   */
  ClsTableStyle.prototype.getCellTxRunStyleClassName = function(classPrefix) {
    return classPrefix + '_' + this.type + '_txStyle';
  };

  /**
   * public function of the private class - ClsTableStyle.
   * calculates the css style class name, for the table cell fill.
   * @param {String} classPrefix - table css style class prefix.
   * @return {String} table cell fill css style class name.
   */
  ClsTableStyle.prototype.getCellFillStyleClassName = function(classPrefix) {
    return classPrefix + '_' + this.type + '_fillStyle';
  };


  /**
   * public function of the private class - ClsTableStyle.
   * calculates the PH css style class name, for the QOWT div-type.
   * @param {String} classPrefix - table css style class prefix.
   * @return {String} table cell ouline css style class name.
   */
  ClsTableStyle.prototype.getCellOutlineStyleClassName =
      function(classPrefix, position) {
    return classPrefix + '_' + this.type +'_'+ position + '_lnStyle';
  };

  /**
   * public function of the private class - ClsTableStyle.
   * calculates the PH css style class name, for the QOWT div-type.
   * @param {String} classPrefix - table css style class prefix.
   * @return {String} table background css style class name.
   */
  ClsTableStyle.prototype.getBgFillStyleClassName = function(classPrefix) {
    return classPrefix + '_' + this.type;
  };


  /**
   * Map which Holds all table part styles .
   */
  var _tblStyleClassMap = {

    // Don't change the order in which they defined, as this order matter while
    // creating and applying css classes.

    tblBg: new ClsTableStyle('tblBg'),

    wholeTbl: new ClsTableStyle('wholeTbl'),

    band1H: new ClsTableStyle('band1H'),

    band2H: new ClsTableStyle('band2H'),

    band1V: new ClsTableStyle('band1V'),

    band2V: new ClsTableStyle('band2V'),

    lastCol: new ClsTableStyle('lastCol'),

    firstCol: new ClsTableStyle('firstCol'),

    lastRow: new ClsTableStyle('lastRow'),

    seCell: new ClsTableStyle('seCell'),

    swCell: new ClsTableStyle('swCell'),

    firstRow: new ClsTableStyle('firstRow'),

    neCell: new ClsTableStyle('neCell'),

    nwCell: new ClsTableStyle('nwCell')
  };

  return _tblStyleClassMap;

});
