/**
 * @fileoverview ListFormatInformationHandler.
 * A DCP handler that supports List Format Information objects.
 *
 * See Schemas:
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-entry.json
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-template.json
 * html-office/pronto/src/dcp/schemas/responses/elements/
 * list-format-information.json
 *
 * @author dtilley@google.com (Dan Tilley)
 */

define([
  'qowtRoot/utils/listFormatManager'], function(
  ListFormatManager) {

  'use strict';

  var _api = {

    'etp': 'lfi',

    /**
     * Process DCP message that matches the listFormatInfo etp.
     * @param dcp {Object} Arbitrary DCP
     */
    visit: function(dcp) {

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp)) {

        if (dcp.el['list-format-entries']) {
          var listFrmt,
              frmtTotal = dcp.el['list-format-entries'].length;
          for (listFrmt = 0; listFrmt < frmtTotal; listFrmt++) {
            var thisEntry = dcp.el['list-format-entries'][listFrmt];
            // Store the entry to template ID map
            ListFormatManager.addIds(
                thisEntry['entry-id'],
                thisEntry['template-id']);
          }
        }

        if (dcp.el['list-format-templates']) {
          var listTmpt,
              tmptTotal = dcp.el['list-format-templates'].length;
          for (listTmpt = 0; listTmpt < tmptTotal; listTmpt++) {
            var thisTemplate = dcp.el['list-format-templates'][listTmpt],
                thisTemplateId = thisTemplate['template-id'];
            // Store the template ID to default list type map
            ListFormatManager.setDefault(
                thisTemplateId,
                thisTemplate['default']);
            if (thisTemplate.elm) {
              var tmptLvl,
                  lvlTotal = thisTemplate.elm.length;
              for (tmptLvl = 0; tmptLvl < lvlTotal; tmptLvl++) {
                // Store the list format data
                ListFormatManager.addTemplateData(
                    thisTemplateId,
                    thisTemplate.elm[tmptLvl]);
              }
            }
          }
        }

      }

    }

  };

  return _api;

});
