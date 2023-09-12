/**
 * Text field handler
 *
 * JSON structure for text field from DCP is
 * {
 *  "eid": <id>,  true
 *  "etp": "txfld",true
 *  "uid": <String>Unique Identifier for TextField,true
 *  "type": <String> Type of the generated Field,  false
 *           ["slidenum", "datetime"]
 *  "format": <String> date format for date type, false
 *           [      "default",
 *                  "MM/DD/YYYY",
 *                  "Day, Month DD, YYYY",
 *                  "DD Month YYYY",
 *                  "Month DD, YYYY",
 *                  "DD-Mon-YY",
 *                  "Month YY",
 *                  "Mon-YY",
 *                  "MM/DD/YYYY hh:mm AM/PM",
 *                  "MM/DD/YYYY hh:mm:ss AM/PM",
 *                  "hh:mm",
 *                  "hh:mm:ss",
 *                  "hh:mm AM/PM",
 *                  "hh:mm:ss: AM/PM"
 *  ]
 *  "rpr": <text-run / character properties JSON>,false
 *  "ppr": <text-paragraph properties JSON>, false
 *  "t" :  <text string>, false
 *  “lvl”: <paragraph level> false
 *  }
 */
define([
  'qowtRoot/dcp/decorators/pointTextDecorator',
  'qowtRoot/utils/dateFormatter',
  'qowtRoot/models/point'
], function(PointTextDecorator, DateFormatter, PointModel) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this handler
     */
    etp: 'txfld',

    /**
     * Render a Text Field element from DCP
     * @param dcp {DCP} Text Field DCP JSON
     * @return {DOM Element} Text Field div
     */
    visit: function(dcp) {
      var element;

      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp) &&
          dcp.el.eid && PointModel.isExplicitTextBody) {
        // TODO(elqursh): Text fields are a special kind of text runs that
        // may update the text content of the run automatically upon opening
        // the presentation/moving slides/etc. Convert text fields
        // to a new polymer element and disable editing of the textual
        // content. Next line is creating model inconsistency between
        // core and QOWT (crbug/430597)
        dcp.el.data = computeTextualContent_(dcp.el);

        var pointTextDecorator = PointTextDecorator.create();
        var decorate = pointTextDecorator.decorate().withNewDiv(dcp.el.eid);
        element = decorate.withTextRunProperties(dcp.el).getDecoratedDiv();

        // dont store the actual text in the model; that
        // would take up too much memory; the qowt-point-run is
        // smart enough to include it's textContent when
        // calculating the crc32 checksum.
        element.setModel(_.omit(dcp.el, 'data'));
        dcp.node.appendChild(element);
      }
      return element;
    }
  };

  /**
   * Computes the textual representation of the field.
   * @param textField {object} text field element JSON
   * @private
   */
  function computeTextualContent_(textField) {
    var computedText = textField.data;

    if (textField.type === "datetime") {
      var date = new Date();
      var format =
        (textField.format === "Default") ? undefined : textField.format;

      computedText = DateFormatter.formatDate(format, date);
    } else if (textField.type === "slidenum") {
      computedText = textField.data || PointModel.SlideId.toString();
    }
    return computedText;
  }

  return _api;
});
