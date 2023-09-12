define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/selectionGestureHandler',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/grid/cell',
  'qowtRoot/widgets/grid/colHeaderContainer',
  'qowtRoot/widgets/grid/rowHeaderContainer'
], function(
    PaneManager,
    SelectionGestureHandler,
    Workbook,
    WidgetFactory,
    SheetCell,
    ColHeaderContainer,
    RowHeaderContainer) {

  'use strict';

  describe('Widget Accessor', function() {

    var rootNode_, rowWidget_, colWidget_, cellWithDefaultProperties_, sandbox_;
    var formattingTypes_ = ['bold', 'italic', 'underline', 'wrapText',
                            'strikethrough'];
    var configObj_ = {
      newSelection: {
        anchor: {rowIdx: 0, colIdx: 0},
        topLeft: {rowIdx: 0, colIdx: 0},
        contentType: 'sheetCell'
      }
    };


    beforeEach(function() {
      sandbox_ = sinon.sandbox.create();
      stubRequiredWorkbookFunctions_();
      initializeData_();
    });


    afterEach(function() {
      resetData_();
    });


    for (var i = 0; i < formattingTypes_.length; i++) {
      runFormattingTests(formattingTypes_[i]);
    }


    function runFormattingTests(formatType) {

      describe('When cell is defined; test : ' + formatType, function() {

        it('should return false if formatting is not applied on any of ' +
            'cell/row/column/sheet', function() {
              rowWidget_.attachWidget(cellWithDefaultProperties_);
              colWidget_.attachWidget(cellWithDefaultProperties_);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isFalse(hasFormatting);
        });


        it('should return true if formatting is defined on the cell and not ' +
            'on sheet/column/row', function() {
              var cell = cellWithDefaultProperties_;
              cell.config_.formatting = getFormattingObject_(formatType);
              rowWidget_.attachWidget(cell);
              colWidget_.attachWidget(cell);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isTrue(hasFormatting);
        });


        it('should return false if the column has formatting defined on it ' +
            'but the cell itself does not have the formatting on it',
            function() {

              var formatting = getFormattingObject_(formatType);
              colWidget_.setFormatting(formatting);
              rowWidget_.attachWidget(cellWithDefaultProperties_);
              colWidget_.attachWidget(cellWithDefaultProperties_);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isFalse(hasFormatting);
        });


        it('should return false if the row has formatting defined on it but ' +
            'the cell itself does not have the formatting on it', function() {

              var formatting = getFormattingObject_(formatType);
              rowWidget_.setFormatting(formatting);
              rowWidget_.attachWidget(cellWithDefaultProperties_);
              colWidget_.attachWidget(cellWithDefaultProperties_);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isFalse(hasFormatting);
        });


        it('should return false if the row and column have formatting defined' +
            'on them but the cell itself does not have the formatting on it',
            function() {

              var formatting = getFormattingObject_(formatType);
              rowWidget_.setFormatting(formatting);
              rowWidget_.attachWidget(cellWithDefaultProperties_);
              colWidget_.attachWidget(cellWithDefaultProperties_);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isFalse(hasFormatting);
        });
      });


      describe('When cell is undefined; test : ' + formatType, function() {

        it('should return false if formatting is not applied on any of ' +
            'row/column/sheet', function() {
              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isFalse(hasFormatting);
        });


        it('should return true if the column has formatting defined on it and' +
            ' the row/sheet/cell do not have the formatting defined on them',
            function() {

              var formatting = getFormattingObject_(formatType);
              colWidget_.setFormatting(formatting);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isTrue(hasFormatting);
        });


        it('should return true if the row has formatting defined on it and ' +
            'the column/sheet/cell do not have the formatting defined on them',
            function() {

              var formatting = getFormattingObject_(formatType);
              rowWidget_.setFormatting(formatting);

              var widget = WidgetFactory.create(configObj_);
              var hasFormatting = isFormattedWidget_(widget, formatType);
              assert.isTrue(hasFormatting);
        });
      });
    }


    /**
     * @param {Object} widget - The widget on which formatting has to be
     *                          checked.
     * @return {Boolean} True if the formatting is applied
     * @private
     */
    var isFormattedWidget_ = function(widget, formatType) {
      switch (formatType) {
        case 'bold' : return widget.hasBold();
        case 'italic' : return widget.hasItalic();
        case 'underline' : return widget.hasUnderline();
        case 'strikethrough' : return widget.hasStrikethrough();
        case 'wrapText' : return widget.hasWrapText();
        default : return false;
      }
    };


    var getFormattingObject_ = function(formatType) {
      var formattingConfig = {};

      switch (formatType) {
        case 'bold' :
          formattingConfig.bld = true;
          break;
        case 'italic' :
          formattingConfig.itl = true;
          break;
        case 'underline' :
          formattingConfig.udl = true;
          break;
        case 'strikethrough' :
          formattingConfig.strikethrough = true;
          break;
        case 'wrapText' :
          formattingConfig.wrapText = true;
          break;
      }
      return formattingConfig;
    };


    var resetData_ = function() {
      Workbook.reset();
      sandbox_.restore();
      rowWidget_ = colWidget_ = rootNode_ = cellWithDefaultProperties_ =
          undefined;
    };


    var initializeData_ = function() {

      rootNode_ = document.createElement('div');
      Workbook.init();
      rowWidget_ = Workbook.getRow(0);
      colWidget_ = Workbook.getColumn(0);
      var cellProperties = {cellText: 'Sample text', formatting: {}};
      cellWithDefaultProperties_ =
          Object.create(SheetCell).init(0, 0, cellProperties);
    };


    var stubRequiredWorkbookFunctions_ = function() {

      sandbox_.stub(Workbook, 'init', function() {
        ColHeaderContainer.init();
        RowHeaderContainer.init();
        PaneManager.init(rootNode_);
      });

      sandbox_.stub(Workbook, 'getRow', function(y) {
        return PaneManager.getMainPane().getRow(y);
      });

      sandbox_.stub(Workbook, 'getColumn', function(x) {
        return PaneManager.getMainPane().getColumn(x);
      });

      sandbox_.stub(Workbook, 'reset', function() {
        ColHeaderContainer.destroy();
        RowHeaderContainer.destroy();
        PaneManager.reset();
        SelectionGestureHandler.reset();
      });
    };
  });
});
