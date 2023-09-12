define([
  'common/mixins/decorators/borderUtils',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowChildren',

  'common/mixins/decorators/tableAlignment',
  'common/mixins/decorators/tableBorders',
  'common/mixins/decorators/tableIndent',
  'common/mixins/decorators/tableStyleId',
  'common/mixins/decorators/tableStyleSettings',
  'common/mixins/decorators/tableSize'
], function(
    BorderUtils,
    MixinUtils,
    QowtElement,
    FlowChildren,

    TableAlignment,
    TableBorders,
    TableIndent,
    TableStyleId,
    TableStyleSettings,
    TableSize) {

  'use strict';

  var api_ = {
    is: 'qowt-table',
    extends: 'table',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'tbl',

    attached: function() {
      var tableBorders = _.get(this, 'model.tableProperties.borders');
      var rows = this.getElementsByTagName('tr'), row;
      for (var i = 0; i < rows.length - 1; i++) {
        row = rows[i];
        var cells = row.cells, cell;
        for (var j = 0; j < cells.length; j++) {
          cell = cells[j];
          var rowSpan = _.get(cell, 'model.cpr.rsp');

          // Check if cell is merged with last row
          if (rowSpan > 1 && (rowSpan + i === rows.length)) {
            var cellBorder = _.get(cell, 'model.cpr.borders');
            for (var side in tableBorders) {
              if (cellBorder && !cellBorder.hasOwnProperty(side)) {
                BorderUtils.setBorderSide(cell, side, tableBorders[side]);
              }
            }
          }
        }
      }
    }

  };

  window.QowtTable = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      FlowChildren,

      // Decorator mixins.
      TableAlignment,
      TableBorders,
      TableIndent,
      TableStyleId,
      TableStyleSettings,
      TableSize,

      api_));

  return {};
});
