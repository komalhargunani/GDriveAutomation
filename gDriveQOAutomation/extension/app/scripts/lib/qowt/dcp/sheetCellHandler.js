/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the SheetCell DCP Handler.
 * This handler processes a 'scl' (cell) element from a DCP response, in its
 * visit method()
 *
 * @constructor
 * @return {object} A SheetCell DCP handler
 */
define([
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/controls/grid/paneManager',
    'qowtRoot/controls/grid/workbook',
    'qowtRoot/errors/qowtSilentError',
    'qowtRoot/errors/errorCatcher',
    'qowtRoot/widgets/grid/cell',
    'qowtRoot/models/sheet',
    'qowtRoot/models/dcp',
    'qowtRoot/widgets/grid/floaterMergeCell',
    'qowtRoot/variants/configs/sheet'
    ],
    function(
      PubSub,
      PaneManager,
      Workbook,
      QOWTSilentError,
      ErrorCatcher,
      SheetCell,
      SheetModel,
      DcpModel,
      SheetFloaterMergeCell,
      SheetConfig) {

  'use strict';



  var _api, _x, _y;
  var defaultLeftNeighbour = -1,
      defaultRightNeighbour = SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS;


  _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'scl',

    /**
     * Processes a 'scl' (cell) element from a DCP response.
     * This involves creating a cell widget to represent this cell
     *
     * @param v {object}   A cell element from a DCP response
     * @return {undefined} No object is returned
     */
    visit: function(v) {
      if(!v || !v.el || !v.el.etp || (v.el.etp !== _api.etp) ||
          (DcpModel.dcpHandlingRow === undefined)) {
        return undefined;
      }

      if (PaneManager.getMainPane() === undefined) {
        // if we have no reference to a grid widget then bail ignore this dcp
        // element this could happen if the app had not constructed a workbook
        // layout control (which constructs the grid widget)
        return undefined;
      }

      _y = DcpModel.dcpHandlingRow;
      _x = v.el.ci;

      _api.processCellElement(_x, _y, v);

      return undefined;
    },

    processCellElement: function(x, y, v) {
      var parentColumn = Workbook.getColumn(x),
          parentRow = Workbook.getRow(y);

      // Cell element should not be processed if columnowidget or row-widget
      // is undefined.
      if (!parentColumn || !parentRow) {
        return undefined;
      }

      var deleteWidget = v.el.del;

      // create config object from the DCP, to pass to cell widget
      var config = {};

      config.cellTopPos = parentRow.getPosition();
      // cell height should be the row height that will be rendered, which is
      // the default row height if no specific height is specified
      config.cellHeight =
        SheetModel.specificRowHeights[y] || Workbook.getDefaultRowHeight();
      config.cellLeftPos = parentColumn.getPosition();
      config.cellWidth = parentColumn.getWidth();

      if (!deleteWidget) {
        if (v.el.x) {

          // setting left and right neighbour to default value, if not sent from
          // core
          var leftNeighbour =
              v.el.ln !== undefined ? v.el.ln : defaultLeftNeighbour;
          var rightNeighbour =
              v.el.rn !== undefined ? v.el.rn : defaultRightNeighbour;

          var col = Workbook.getColumn(leftNeighbour + 1);
          config.burstingAreaStart = col.getPosition();

          if (rightNeighbour > SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS) {
            config.burstingAreaEnd = col.getPosition();
            config.rightNeighbour = SheetConfig.kGRID_DEFAULT_ABS_MAX_COLS;
          } else {
            var rightNeighborColumn = Workbook.getColumn(rightNeighbour - 1);
            config.burstingAreaEnd = rightNeighborColumn.getPosition() +
                rightNeighborColumn.getWidth();
            config.rightNeighbour = rightNeighbour;
          }
          config.cellText = v.el.x;
          //Logging Error to GA
          if (v.el.ln === undefined) {
            // Using a silent error here so that this use-case is
            // tracked in the GA data but does not interrupt the user.
            var silentErrorForLeftIdx =
                new QOWTSilentError('Left neighbour index is undefined.');
            ErrorCatcher.handleError(silentErrorForLeftIdx);
          }
          if (v.el.rn === undefined) {
            // Using a silent error here so that this use-case is
            // tracked in the GA data but does not interrupt the user.
            var silentErrorForRightIdx =
                new QOWTSilentError('Right neighbour index is undefined.');
            ErrorCatcher.handleError(silentErrorForRightIdx);
          }
        }
        config.editableText = v.el.xe;
        config.formatting = v.el.fm;
        config.leftNeighbour = leftNeighbour;
      }

      /* TODO :
       * This cell handler only does a DELETE/RECREATE instead of UPDATE
       * existing widget. The exception built atop of this raw pattern is
       * currently merge info (v.el.mi), as our service is NOT sending the merge
       * cell in SetCellContent & GetModifiedCellsCmd (that is complex info to
       * attain we have a use of the 'null' setting on 'mi'.
       * In future anticipate further use of this 'null' setting on unmodified
       * attributes,but for now we use it purely for 'mi', even though we still
       * recreate the merge cell floater widget (We recreate to keep pattern
       * simple in current implementation, until the 'null' is used with proper
       * 'update' methods on cell & mergeCell widgets).
       */
      var mergeAnchorInfo = v.el.mi;
      var isMergeAnchor =
        ((mergeAnchorInfo !== undefined) && (mergeAnchorInfo !== null));
      if(isMergeAnchor) {
        config.isMergeAnchor = true;
        config.rowSpan = mergeAnchorInfo.rs;
        config.colSpan = mergeAnchorInfo.cs;
      }

      if(v.el.fm !== undefined){
        var fmt = v.el.fm;
        config.isWrapText = fmt.wrapText;
        config.backgroundColor = fmt.bg;
        config.borders = fmt.borders;
        config.horizontalAlign = fmt.ha;
        config.verticalAlign = fmt.va;
        config.rotationAngle = fmt.rotationAngle;
      }

       //Handling hyperlink
      if (v.el.hyperlink) {
        config.hyperlink = true;
        config.hyperlinkType = v.el.hyperlink.type;
        config.hyperlinkTarget = v.el.hyperlink.target;
      }

      // (CREATE & APPEND & ATTACH) / UPDATE / (DETACH & REMOVE) the required
      // widgets based on the config

      var cellWidget = parentRow.getCell(x);
      if (cellWidget) {

        if(mergeAnchorInfo === null) {
          // MAINTAIN merge info from before
          var prevConfig = cellWidget.getConfig();
          config.isMergeAnchor = prevConfig.isMergeAnchor;
          config.rowSpan = prevConfig.rowSpan;
          config.colSpan = prevConfig.colSpan;
          isMergeAnchor = config.isMergeAnchor;
        }

        PubSub.publish("qowt:sheetCellHandler:removeCellFromAllPanes",
          {rowIndex: cellWidget.y, colIndex: cellWidget.x});
      }
      if (!deleteWidget) {
        // NOTE: Only CREATE, APPEND & ATTACH to the main pane. If required it
        // will later be cloned to other panes following positional (row)
        // layout.
        // CREATE cell widget
        cellWidget = Object.create(SheetCell).init(x, y, config);
        // APPEND it to parent node
        cellWidget.appendTo(v.node);

        // ATTACH it to its row and column widgets
        parentRow.attachWidget(cellWidget);
        parentColumn.attachWidget(cellWidget);
      }

      var floaterMgr = PaneManager.getMainPane().getFloaterManager();
      var floaterMergeCellWidget;
      PubSub.publish("qowt:sheetCellHandler:removeMergeCellFromAllPanes",
        {anchorRowIndex: y, anchorColIndex: x});
      if(!deleteWidget) {
        if(isMergeAnchor) {
          // NOTE: Only CREATE, APPEND & ATTACH to the main pane. If required it
          // will later be cloned to other panes following positional (row)
          // layout.
          // CREATE merge cell widget
          floaterMergeCellWidget = SheetFloaterMergeCell.create(x, y, config);
          // APPEND it to parent node
          floaterMergeCellWidget.appendTo(v.node);
          // ATTACH additional 'merge' cell widget to the floater manager object
          // for custom layout handling
          floaterMgr.attachWidget(floaterMergeCellWidget);
        }
      }


     return undefined;
    }
  };

  return _api;
});
