// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview This module handles autocomplete suggestions in Sheet.
 * It creates an autocomplete menu widget at the initialization and then it
 * shows and hides the menu with suggestions for text when a
 * displayAutocomplete action is received.
 * This modules implements an autocomplete algorithm for text suggestions in
 * Sheet, matching the feature provided by MS Excel.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/widgets/factory',
  'qowtRoot/configs/menuConfigs/autocompleteConfig',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/models/sheet',
  'qowtRoot/variants/configs/sheet'
], function(
    PubSub,
    PaneManager,
    Workbook,
    WidgetFactory,
    AutocompleteConfig,
    ArrayUtils,
    SheetModel,
    SheetConfig) {

  'use strict';

  /**
   * @private
   * Autocomplete menu widget
   */
  var _autocompleteMenu;

  /**
   * @private
   * Candidate list for text suggestions (data model)
   */
  var _candidates = [];

  /**
   * @private
   */
  var _contentType = 'sheetText',
      _parentNode,
      _textWidget,
      _textWidgetNode,
      _numOfRows;

  /**
   * @private
   * Constants
   */
  var _kAbove = 'above',
      _KBelow = 'below';

  var _api = {

    /**
     * Generates the candidate list.
     * Appends the autocomplete menu widget if it hasn't been appended yet.
     * Called when the Sheet Text Tool is activated.
     */
    generateCandidateList: function() {
      var anchorRowIdx, anchorColIdx, column;

      // Make sure the _createAutocompleteMenu() and _appendAutocompleteMenu()
      // methods are called just once
      if (!_parentNode) {
        _createAutocompleteMenu();
        // We need info from the render tree to append the autocomplete menu,
        // so it cannot be called during the initialization of this module.
        _appendAutocompleteMenu();
      }
      if (!_numOfRows) {
        _numOfRows = Workbook.getNumOfRows();
      }

      // Sheet Text Tool is active so we need to get the current cell
      // selection saved in the model
      if (SheetModel.currentCellSelection) {
        anchorRowIdx = SheetModel.currentCellSelection.anchor.rowIdx;
        anchorColIdx = SheetModel.currentCellSelection.anchor.colIdx;

        column = PaneManager.getMainPane().getColumn(anchorColIdx);
        // Generate the candidate list
        if (column) {
          _generateCandidateList(column, anchorRowIdx);
        }
      }
    },

    /**
     * Deletes the candidate list and instructs the autocomplete menu widget
     * to delete the menu items.
     * Called when the Sheet Text Tool is deactivated.
     */
    clearCandidateList: function() {
      _clearCandidateList();
    }
  };

  /**
   * @private
   * Generates the candidate list for the cell being edited searching for text
   * suggestions in the same column.
   * Searches alternately in the cells above and below the edited cell until it
   * finds an empty cell or the max limit of candidates is reached.
   *
   * @param column {object}   column widget
   * @param rowIndex {number} row index of the edited cell
   */
  function _generateCandidateList(column, rowIndex) {
    var cellsAnalyzedCount = 0,
        distance = 1;
    /**
     * continueAbove and continueBelow are used to know when we have found
     * an empty cell and we need to stop searching
     */
    var continueAbove = true,
        continueBelow = true;

    while (cellsAnalyzedCount < SheetConfig.kMAX_NUM_SUGGESTIONS) {
      if (continueAbove) {
        continueAbove = _isCellNotEmpty(column, rowIndex, distance, _kAbove);
      }
      if (continueBelow) {
        continueBelow = _isCellNotEmpty(column, rowIndex, distance, _KBelow);
      }
      if (!continueAbove && !continueBelow) {
        break;
      }
      if (continueAbove) {
        _addCandidate(column, rowIndex, distance, _kAbove);
        cellsAnalyzedCount += 1;
      }
      if (continueBelow) {
        _addCandidate(column, rowIndex, distance, _KBelow);
        cellsAnalyzedCount += 1;
      }
      distance += 1;
    }

    _consolidateCandidateList();
  }

  /**
   * @private
   * Consolidates the candidate list, removing any duplicates and sorting
   * the elements.
   */
  function _consolidateCandidateList() {
    if (_candidates.length > 1) {
      _candidates = ArrayUtils.sortCaseInsensitive(
        ArrayUtils.unique(_candidates));
    }
  }

  /**
   * @private
   * Handles the 'displayAutocomplete' action.
   */
  function _handleAction(event, eventData) {
    event = event || {};
    if (eventData.context &&
        eventData.context.contentType &&
        eventData.context.contentType === _contentType &&
        eventData.action === 'displayAutocomplete') {
      // Handle a display autocomplete action
      _textWidget = eventData.context.textWidget;
      _textWidgetNode = _textWidget.getNode();
      _displayAutocomplete(eventData.context.opt_isFormula);
    }
  }

  /**
   * @private
   * Displays the autocomplete menu with a list of suggestions.
   *
   * @param opt_isFormula {boolean} Optional parameter. True if the autocomplete
   *                      suggestions are for formulas, false or undefined if
   *                      are for normal text
   */
  function _displayAutocomplete(opt_isFormula) {
    var text;

    if (!opt_isFormula) {
      text = _textWidget.getDisplayText();
      _displayAutocompleteText(text);
    }
  }

  /**
   * @private
   * Displays text suggestions, if there are suggestions to show.
   *
   * @param editedCellText {string} text of the edited cell
   */
  function _displayAutocompleteText(editedCellText) {
    var suggestions = _filterTextSuggestions(editedCellText);
    if (suggestions.length !== 0) {
      _autocompleteMenu.updateMenuItems(suggestions);
      _setMenuWidthAndPosition();
      _autocompleteMenu.show();
    }
    else {
      _autocompleteMenu.hide();
    }
  }

  /**
   * @private
   * Filters the text suggestions from the candidate list against the text of
   * the edited cell.
   *
   * @param editedCellText {string} text of the edited cell
   */
  function _filterTextSuggestions(editedCellText) {
    var textSuggestions = [];

    for (var i = 0; i < _candidates.length; i++) {
      if (_isValidSuggestion(_candidates[i], editedCellText)) {
        textSuggestions.push(_candidates[i]);
      }
      // If we have found at least one suggestion and the last checked
      // candidate is not a valid suggestion, it means we don't need to check
      // any further because the candidate list is alphabetically sorted
      else if (textSuggestions.length > 0) {
        break;
      }
    }

    return textSuggestions;
  }

  /**
   * @private
   * Checks if the string text1 is a valid suggestion for text2.
   * To be a valid suggestion, text1:
   * - needs to start with text2 followed by at least one character
   * - must not be a number
   * - can have a different case
   *
   * @param text1 {string} text to check
   * @param text2 {string} text of the edited text
   */
  function _isValidSuggestion(text1, text2) {
    var regExp = new RegExp("^" + _escapeRegExp(text2) + ".+", "i");
    return (text2 !== '' && isNaN(text1) && text1.match(regExp));
  }

  /**
   * @private
   * Checks if a cell above or below the one being edited is not empty.
   *
   * @param column {object} column widget
   * @param rowIndex {number} row index of the edited cell
   * @param distance {number} distance from the edited cell
   * @param direction {string} direction
   */
  function _isCellNotEmpty(column, rowIndex, distance, direction) {
    var checkedRowIndex;

    if (direction === _kAbove) {
      checkedRowIndex = rowIndex - distance;
      return checkedRowIndex >= 0 &&
          _isNotEmpty(column.getCell(checkedRowIndex));
    }
    else if (direction === _KBelow) {
      checkedRowIndex = rowIndex + distance;
      return checkedRowIndex < _numOfRows &&
          _isNotEmpty(column.getCell(checkedRowIndex));
    }
    return false;
  }

  /**
   * @private
   * Checks if a cell is not empty.
   *
   * @param cell {object} cell widget
   */
  function _isNotEmpty(cell) {
    return cell !== undefined && cell.cellText !== undefined &&
        cell.cellText !== '';
  }

  /**
   * @private
   * Adds a candidate to the candidate list.
   *
   * @param column {object} column widget
   * @param rowIndex {number} row index of the edited cell
   * @param distance {number} distance from the edited cell
   * @param direction {string} direction
   */
  function _addCandidate(column, rowIndex, distance, direction) {
    var checkedRowIndex, cellText;

    checkedRowIndex = (direction === _kAbove) ? rowIndex - distance :
        rowIndex + distance;
    cellText = column.getCell(checkedRowIndex).cellText;

    // We don't want to add numbers to the candidate list
    if (isNaN(cellText)) {
      _candidates.push(cellText);
    }
  }

  /**
   * @private
   * Escapes any characters that would have special meaning in a regular
   * expression. Returns a new escaped string, or self if no characters are
   * escaped.
   *
   * @param string {string} string to escape
   */
  function _escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  /**
   * @private
   * Sets the max width and the position of the autocomplete menu.
   */
  function _setMenuWidthAndPosition() {
    var textWidgetWidth, leftPos, topPos, autocompleteMenuWidth, onscreenTopPos,
        spaceLeftTextWidget, spaceRightTextWidget, maxAutocompleteMenuWidth;
    // Constants
    var kGutter = 18,
        kBorder = 2,
        kMinPos = 0;

    // To trigger only one layout we first read and then write to the DOM
    textWidgetWidth = _textWidgetNode.offsetWidth;
    leftPos = _textWidgetNode.offsetLeft + textWidgetWidth -
              Workbook.getScrollLeft();
    topPos = _textWidgetNode.offsetTop - Workbook.getScrollTop();
    autocompleteMenuWidth = _autocompleteMenu.getWidth();
    onscreenTopPos = _parentNode.offsetHeight - _autocompleteMenu.getHeight() -
                     kGutter;
    spaceRightTextWidget = _parentNode.offsetWidth - leftPos - kGutter;

    // Check if the menu width exceeds available space where the menu would
    // normally appear ie at the right of the text widget
    if (autocompleteMenuWidth > spaceRightTextWidget) {
      maxAutocompleteMenuWidth = spaceRightTextWidget;
      spaceLeftTextWidget = leftPos - textWidgetWidth;

      // When the menu is too wide for the space available, we:
      // 1) Choose if showing the menu at the left or at the right of the
      // inline widget checking where there is more space available
      // 2) Limit the menu width to the max space available
      if (spaceLeftTextWidget > spaceRightTextWidget) {
        // Show the menu at the left of the inline widget
        leftPos = spaceLeftTextWidget - autocompleteMenuWidth;
        maxAutocompleteMenuWidth = spaceLeftTextWidget;
      }
      if (autocompleteMenuWidth > maxAutocompleteMenuWidth) {
        _autocompleteMenu.setMaxWidth(maxAutocompleteMenuWidth - kBorder);
      }
    }

    // Make sure left and top positions are within a correct range and top
    // position is not bigger than onscreenTopPos
    leftPos = Math.max(leftPos, kMinPos);
    topPos = Math.max(Math.min(onscreenTopPos, topPos), kMinPos);

    _autocompleteMenu.setPosition(leftPos, topPos);
  }

  /**
   * @private
   * Creates the autocomplete menu widget.
   */
  function _createAutocompleteMenu() {
    if (!_autocompleteMenu) {
      _autocompleteMenu = WidgetFactory.create(AutocompleteConfig);
    }
  }

  /**
   * @private
   * Appends the autocomplete menu widget to the parent node.
   */
  function _appendAutocompleteMenu() {
    _parentNode = document.getElementById('qowt-sheet-container-panes');
    if (_autocompleteMenu) {
      _autocompleteMenu.appendTo(_parentNode);
    }
  }

  /**
   * @private
   * Deletes the candidate list. Resets the autocomplete menu.
   */
  function _clearCandidateList() {
    _candidates = [];
    _numOfRows = undefined;
    if (_autocompleteMenu) {
      _autocompleteMenu.reset();
    }
  }

  function _init() {
    PubSub.subscribe('qowt:doAction', _handleAction);
  }

  _init();

  return _api;
});
