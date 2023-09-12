// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview tableStyleFactory returns tableStyle using table style ID.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([
  'qowtRoot/drawing/styles/tableStyles/tableStyleDefinitions'
], function(TableStyleDefinitions) {

  'use strict';

  /**
   *
   * @param styleName
   * @param clrScheme1
   * @param clrScheme2
   */
  var TableStyleFactory = function(styleName, clrScheme1, clrScheme2) {
    this.styleName = styleName;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  /**
   * Prepares tablestyle for given tableStyle name
   */
  TableStyleFactory.prototype.prepareTableStyle = function() {
    var preparedTableStyleObj =
        new TableStyleDefinitions[
            this.styleName](this.clrScheme1, this.clrScheme2);
    return preparedTableStyleObj.getTableStyle();
  };

  /**
   * Map of Table styleId to table style
   */
  var _tblStyleIdtoStyleNameMap = {
    "{9D7B26C5-4107-4FEC-AEDC-1716B250A1EF}":
        new TableStyleFactory('Light-Style-1', 'dk1', ''),
    "{3B4B98B0-60AC-42C2-AFA5-B58CD77FA1E5}":
        new TableStyleFactory('Light-Style-1', 'accent1', ''),
    "{0E3FDE45-AF77-4B5C-9715-49D594BDF05E}":
        new TableStyleFactory('Light-Style-1', 'accent2', ''),
    "{C083E6E3-FA7D-4D7B-A595-EF9225AFEA82}":
        new TableStyleFactory('Light-Style-1', 'accent3', ''),
    "{D27102A9-8310-4765-A935-A1911B00CA55}":
        new TableStyleFactory('Light-Style-1', 'accent4', ''),
    "{5FD0F851-EC5A-4D38-B0AD-8093EC10F338}":
        new TableStyleFactory('Light-Style-1', 'accent5', ''),
    "{68D230F3-CF80-4859-8CE7-A43EE81993B5}":
        new TableStyleFactory('Light-Style-1', 'accent6', ''),

    "{7E9639D4-E3E2-4D34-9284-5A2195B3D0D7}":
        new TableStyleFactory('Light-Style-2', 'dk1', ''),
    "{69012ECD-51FC-41F1-AA8D-1B2483CD663E}":
        new TableStyleFactory('Light-Style-2', 'accent1', ''),
    "{72833802-FEF1-4C79-8D5D-14CF1EAF98D9}":
        new TableStyleFactory('Light-Style-2', 'accent2', ''),
    "{F2DE63D5-997A-4646-A377-4702673A728D}":
        new TableStyleFactory('Light-Style-2', 'accent3', ''),
    "{17292A2E-F333-43FB-9621-5CBBE7FDCDCB}":
        new TableStyleFactory('Light-Style-2', 'accent4', ''),
    "{5A111915-BE36-4E01-A7E5-04B1672EAD32}":
        new TableStyleFactory('Light-Style-2', 'accent5', ''),
    "{912C8C85-51F0-491E-9774-3900AFEF0FD7}":
        new TableStyleFactory('Light-Style-2', 'accent6', ''),

    "{5940675A-B579-460E-94D1-54222C63F5DA}":
        new TableStyleFactory('No-Style-Table-Grid', '', ''),

    "{616DA210-FB5B-4158-B5E0-FEB733F419BA}":
        new TableStyleFactory('Light-Style-3', 'dk1', ''),
    "{BC89EF96-8CEA-46FF-86C4-4CE0E7609802}":
        new TableStyleFactory('Light-Style-3', 'accent1', ''),
    "{5DA37D80-6434-44D0-A028-1B22A696006F}":
        new TableStyleFactory('Light-Style-3', 'accent2', ''),
    "{8799B23B-EC83-4686-B30A-512413B5E67A}":
        new TableStyleFactory('Light-Style-3', 'accent3', ''),
    "{ED083AE6-46FA-4A59-8FB0-9F97EB10719F}":
        new TableStyleFactory('Light-Style-3', 'accent4', ''),
    "{BDBED569-4797-4DF1-A0F4-6AAB3CD982D8}":
        new TableStyleFactory('Light-Style-3', 'accent5', ''),
    "{E8B1032C-EA38-4F05-BA0D-38AFFFC7BED3}":
        new TableStyleFactory('Light-Style-3', 'accent6', ''),

    "{793D81CF-94F2-401A-BA57-92F5A7B2D0C5}":
        new TableStyleFactory('Medium-Style-1', 'dk1', ''),
    "{B301B821-A1FF-4177-AEE7-76D212191A09}":
        new TableStyleFactory('Medium-Style-1', 'accent1', ''),
    "{9DCAF9ED-07DC-4A11-8D7F-57B35C25682E}":
        new TableStyleFactory('Medium-Style-1', 'accent2', ''),
    "{1FECB4D8-DB02-4DC6-A0A2-4F2EBAE1DC90}":
        new TableStyleFactory('Medium-Style-1', 'accent3', ''),
    "{1E171933-4619-4E11-9A3F-F7608DF75F80}":
        new TableStyleFactory('Medium-Style-1', 'accent4', ''),
    "{FABFCF23-3B69-468F-B69F-88F6DE6A72F2}":
        new TableStyleFactory('Medium-Style-1', 'accent5', ''),
    "{10A1B5D5-9B99-4C35-A422-299274C87663}":
        new TableStyleFactory('Medium-Style-1', 'accent6', ''),

    "{073A0DAA-6AF3-43AB-8588-CEC1D06C72B9}":
        new TableStyleFactory('Medium-Style-2', 'dk1', ''),
    "{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}":
        new TableStyleFactory('Medium-Style-2', 'accent1', ''),
    "{21E4AEA4-8DFA-4A89-87EB-49C32662AFE0}":
        new TableStyleFactory('Medium-Style-2', 'accent2', ''),
    "{F5AB1C69-6EDB-4FF4-983F-18BD219EF322}":
        new TableStyleFactory('Medium-Style-2', 'accent3', ''),
    "{00A15C55-8517-42AA-B614-E9B94910E393}":
        new TableStyleFactory('Medium-Style-2', 'accent4', ''),
    "{7DF18680-E054-41AD-8BC1-D1AEF772440D}":
        new TableStyleFactory('Medium-Style-2', 'accent5', ''),
    "{93296810-A885-4BE3-A3E7-6D5BEEA58F35}":
        new TableStyleFactory('Medium-Style-2', 'accent6', ''),

    "{8EC20E35-A176-4012-BC5E-935CFFF8708E}":
        new TableStyleFactory('Medium-Style-3', 'dk1', ''),
    "{6E25E649-3F16-4E02-A733-19D2CDBF48F0}":
        new TableStyleFactory('Medium-Style-3', 'accent1', ''),
    "{85BE263C-DBD7-4A20-BB59-AAB30ACAA65A}":
        new TableStyleFactory('Medium-Style-3', 'accent2', ''),
    "{EB344D84-9AFB-497E-A393-DC336BA19D2E}":
        new TableStyleFactory('Medium-Style-3', 'accent3', ''),
    "{EB9631B5-78F2-41C9-869B-9F39066F8104}":
        new TableStyleFactory('Medium-Style-3', 'accent4', ''),
    "{74C1A8A3-306A-4EB7-A6B1-4F7E0EB9C5D6}":
        new TableStyleFactory('Medium-Style-3', 'accent5', ''),
    "{2A488322-F2BA-4B5B-9748-0D474271808F}":
        new TableStyleFactory('Medium-Style-3', 'accent6', ''),

    "{D7AC3CCA-C797-4891-BE02-D94E43425B78}":
        new TableStyleFactory('Medium-Style-4', 'dk1', ''),
    "{69CF1AB2-1976-4502-BF36-3FF5EA218861}":
        new TableStyleFactory('Medium-Style-4', 'accent1', ''),
    "{8A107856-5554-42FB-B03E-39F5DBC370BA}":
        new TableStyleFactory('Medium-Style-4', 'accent2', ''),
    "{0505E3EF-67EA-436B-97B2-0124C06EBD24}":
        new TableStyleFactory('Medium-Style-4', 'accent3', ''),
    "{C4B1156A-380E-4F78-BDF5-A606A8083BF9}":
        new TableStyleFactory('Medium-Style-4', 'accent4', ''),
    "{22838BEF-8BB2-4498-84A7-C5851F593DF1}":
        new TableStyleFactory('Medium-Style-4', 'accent5', ''),
    "{16D9F66E-5EB9-4882-86FB-DCBF35E3C3E4}":
        new TableStyleFactory('Medium-Style-4', 'accent6', ''),

    "{E8034E78-7F5D-4C2E-B375-FC64B27BC917}":
        new TableStyleFactory('Dark-Style-1-dk1', 'dk1', ''),
    "{125E5076-3810-47DD-B79F-674D7AD40C01}":
        new TableStyleFactory('Dark-Style-1', 'accent1', ''),
    "{37CE84F3-28C3-443E-9E96-99CF82512B78}":
        new TableStyleFactory('Dark-Style-1', 'accent2', ''),
    "{D03447BB-5D67-496B-8E87-E561075AD55C}":
        new TableStyleFactory('Dark-Style-1', 'accent3', ''),
    "{E929F9F4-4A8F-4326-A1B4-22849713DDAB}":
        new TableStyleFactory('Dark-Style-1', 'accent4', ''),
    "{8FD4443E-F989-4FC4-A0C8-D5A2AF1F390B}":
        new TableStyleFactory('Dark-Style-1', 'accent5', ''),
    "{AF606853-7671-496A-8E4F-DF71F8EC918B}":
        new TableStyleFactory('Dark-Style-1', 'accent6', ''),

    "{5202B0CA-FC54-4496-8BCA-5EF66A818D29}":
        new TableStyleFactory('Dark-Style-2', 'dk1', 'dk1'),
    "{0660B408-B3CF-4A94-85FC-2B1E0A45F4A2}":
        new TableStyleFactory('Dark-Style-2', 'accent1', 'accent2'),
    "{91EBBBCC-DAD2-459C-BE2E-F6DE35CF9A28}":
        new TableStyleFactory('Dark-Style-2', 'accent3', 'accent4'),
    "{46F890A9-2807-4EBB-B81D-B2AA78EC7F39}":
        new TableStyleFactory('Dark-Style-2', 'accent5', 'accent6'),

    "{2D5ABB26-0587-4C30-8999-92F81FD0307C}":
        new TableStyleFactory('No-Style-No-Grid', '', ''),

    "{3C2FFA5D-87B4-456A-9821-1D502468CF0F}":
        new TableStyleFactory('Themed-Style-1', 'accent1', ''),
    "{284E427A-3D55-4303-BF80-6455036E1DE7}":
        new TableStyleFactory('Themed-Style-1', 'accent2', ''),
    "{69C7853C-536D-4A76-A0AE-DD22124D55A5}":
        new TableStyleFactory('Themed-Style-1', 'accent3', ''),
    "{775DCB02-9BB8-47FD-8907-85C794F793BA}":
        new TableStyleFactory('Themed-Style-1', 'accent4', ''),
    "{35758FB7-9AC5-4552-8A53-C91805E547FA}":
        new TableStyleFactory('Themed-Style-1', 'accent5', ''),
    "{08FB837D-C827-4EFA-A057-4D05807E0F7C}":
        new TableStyleFactory('Themed-Style-1', 'accent6', ''),

    "{D113A9D2-9D6B-4929-AA2D-F23B5EE8CBE7}":
        new TableStyleFactory('Themed-Style-2', 'accent1', ''),
    "{18603FDC-E32A-4AB5-989C-0864C3EAD2B8}":
        new TableStyleFactory('Themed-Style-2', 'accent2', ''),
    "{306799F8-075E-4A3A-A7F6-7FBC6576F1A4}":
        new TableStyleFactory('Themed-Style-2', 'accent3', ''),
    "{E269D01E-BC32-4049-B463-5C60D7B0CCD2}":
        new TableStyleFactory('Themed-Style-2', 'accent4', ''),
    "{327F97BB-C833-4FB7-BDE5-3F7075034690}":
        new TableStyleFactory('Themed-Style-2', 'accent5', ''),
    "{638B1855-1B75-4FBE-930C-398BA8C253C6}":
        new TableStyleFactory('Themed-Style-2', 'accent6', '')
  };


  var _api = {

    /**
     * get the table style using Table style ID
     * @param tblStyleId
     * @return tableStyle
     */
    getTableStyle: function(tblStyleId) {
      var tableStyleFactory = _tblStyleIdtoStyleNameMap[tblStyleId];
      // If tableStyle not defined, then return the default style
      // 'Medium style 2 - Accent 1'
      if (!tableStyleFactory) {
        tableStyleFactory =
            _tblStyleIdtoStyleNameMap["{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"];
      }
      var tableStyle = tableStyleFactory.prepareTableStyle();
      return tableStyle;
    }
  };


  return _api;

});
