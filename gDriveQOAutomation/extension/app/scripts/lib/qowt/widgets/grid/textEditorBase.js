/**
 * Text Editor Base
 * ================
 *
 * The text editor base module contains common code that is shared
 * by all text editor widgets in Quicksheet. Currently there are
 * two types of text editor widget in Quicksheet - the formula bar
 * widget and the floating editor widget.
 * Each text editor widget extends the API that is provided by
 * this text editor base module.
 *
 * @author          Lorraine Martin (lorrainemartin@google.com)
 * @constructor     Constructor for the text editor base API.
 * @return {object} The text editor base API.
 */
define([
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/formulaUtils'
  ],
  function(
  DomListener,
  NavigationUtils,
  PubSub,
  FormulaUtils) {

  'use strict';

  var _factory = {

    create: function() {

    // use module pattern for instance object
    var module = function() {

      var _node,

      // Signals that are published
      _kSignal_RequestFocus = "qowt:sheet:requestFocus",
      _kSignal_RequestFocusLost = "qowt:sheet:requestFocusLost",
      _kSignal_RequestAction = "qowt:requestAction",

      // Actions that are requested
      _kAction_CommitCellEdit = "commitCellEdit",
      _kAction_CancelCellEdit = "cancelCellEdit",

      _KRequest_Focus_Content_Type = 'sheetText',
      _KRequest_Action_Content_Type = 'sheetCell',
      // When inline editor/formula bar is in focus and tab key pressed,
      // inline editor/formula bar loses focus and activates right tool for
      // committing text. Text is committed and selection is moved to next
      // available cell.
      // In a scenario where inline editor/formula bar is in focus and tab key
      // navigation is started after clicking on main toolbar, tab key press on
      // formula bar should commit text and move selection to next available
      // cell.
      // However text is not committed as focus is lost to mainToolbar after
      // clicking and inline editor/Formula bar is not able to activate right
      // tool for commit action.
      // To solve this issue, text editor will activate right tool for
      // committing text whenever inline editor/formula bar is not in focus
      // during commit action.
      // This property will be initialised with false value and will be made
      // true whenever text editor is active. If text editor is active along
      // with activating right tool for commit action, text editor will also
      // remove focus from current text editor. This will help in selecting
      // right cell after commit action.
      _isTEActive = false,
      _kTabKeyCode = 9,
      _kEnterKeyCode = 13,
      _kEscapeKeyCode = 27,
      _kNewlineCharacter = '\n';

    var _api = {

        /**
         * Gets the text editor node
         *
         * @return {HTML node} The node
         * @method getNode()
         */
        getNode: function() {
          return _node;
        },

        /**
         * Sets the text editor node
         *
         * @param {HTML node} node The node
         * @method setNode(node)
         */
        setNode: function(node) {
          _isTEActive = true;
          _node = node;

          // now that the base node has been set,
          // add the event listeners on it
          _addListeners();
        },

        /**
         * Gives the text editor focus
         *
         * @method focus()
         */
        focus: function() {
          _isTEActive = true;
          _node.focus();
        },

        /**
         * Removes focus from the text editor
         *
         * @method blur()
         */
        blur: function() {
          _node.blur();
        },

        /**
         * Indicates whether this text editor currently has focus
         *
         * @return {boolean} True if the text editor has focus;
         *                   otherwise false
         * @method hasFocus()
         */
        hasFocus: function() {
          return _node === document.activeElement;
        },

        /**
         * Instructs the text editor widget to 'commit'
         * the current edit that is being performed in it.
         * This involves removing focus from the text editor
         * and publishing a 'qowt:requestAction' signal to commit
         * the changes
         *
         * @param {HTML event} event The HTML mouse or key event that
         *                           indicated a commit should occur
         * @param {boolean} isFormula True if the current edit is a formula,
         *                            false if it is normal text
         * @method commit(event)
         */
        commit: function(event, isFormula) {
          var text;
          if (isFormula) {
            text = FormulaUtils.addClosingParentheses(
                _api.getUncommittedText());
          } else {
            text = _api.getUncommittedText();
          }

          // Activate right tool by calling blur base, whenever inline editor
          // or text editor is not in focus. If both are in focus inline editor
          // will make sure to deactivate tool on focus lost.
          // Also when inline editor is not in focus and any of
          // floating editor or formula bar or text editor is active then,
          // call blur of source element to loose focus from current selection.
          if (_api.hasFocus() && _isTEActive) {
            _api.blur();
          } else {
            _api.onBlurBase();
            var formulaBar = event && event.srcElement &&
                event.srcElement.classList && event.srcElement.classList.
                contains('qowt-sheet-formula-bar-editor');
            var floatingEditor = event && event.srcElement &&
                event.srcElement.id === 'qowt-floating-editor';
            if (event && event.srcElement && (formulaBar || floatingEditor)) {
              event.srcElement.blur();
            }
            if (_isTEActive) {
              _api.blur();
            }
          }

          PubSub.publish(_kSignal_RequestAction, {
            'action': _kAction_CommitCellEdit,
            'context': {
              contentType: _KRequest_Action_Content_Type,
              cellText: text,
              commitEvent: event
            }
          });
        },

        /**
         * Instructs the text editor widget to 'cancel'
         * the current edit that is being performed in it.
         * This involves removing focus from the text
         * editor and then publishing a 'qowt:requestAction'
         * signal to cancel the edit
         *
         * @method cancel()
         */
        cancel: function() {
          _api.blur();

          PubSub.publish(_kSignal_RequestAction, {
            'action': _kAction_CancelCellEdit,
            'context': {
              contentType: _KRequest_Action_Content_Type
            }
          });
        },

        /**
         * Sets the display text of the text editor
         *
         * @param {string} text The text to be displayed
         * @method setDisplayText(text)
         */
        setDisplayText: function(text) {
          _isTEActive = true;
          if(text === undefined) {
            _node.textContent = '';
          }

          if(typeof(text) === 'string') {
            // innerText depends on the layout, textContent is the raw data
            _node.textContent = text;
          }
        },

        /**
         * Gets the display text of the text editor
         *
         * @return {string} The text
         * @method getDisplayText()
         */
        getDisplayText: function() {
          // innerText depends on the layout, textContent is the raw data
          return _node.textContent;
        },

        /**
         * Injects a cell ref into the text editor's text.
         * The specified object contains the cell ref to inject
         * and a flag indicating whether the user has injected
         * this cell ref using an arrow key or a mousedown event
         *
         * @param obj {object} The config object - e.g.
         *                     { cellRef: "F27",
         *                       byKey: true }
         * @method injectCellRef(obj)
         */
        injectCellRef: function(obj) {
          _injectCellRef(obj);
        },

        /**
         * Injects a cell range to the text editor's text.
         * The specified object contains the cell range to inject
         * and a flag indicating whether the user has injected
         * this cell range using a shift-arrow key or a mousemove event
         *
         * @param obj {object} The config object - e.g.
         *                     { cellRange: { topLeft: "F27",
         *                                    bottomRight: "H38" },
         *                       byKey: true }
         * @method injectCellRange(obj)
         */
        injectCellRange: function(obj) {
          _injectCellRange(obj);
        },

        /**
         * Injects a newline character into the text editor's text
         * at the current cursor position.
         */
        injectNewlineCharacter: function() {
          _injectNewlineCharacter();
        },

        /**
         * Gets the text which should be committed after the edit
         *
         * @method getUncommittedText()
         * @return {string} The uncommitted text - if the return value is
         *                  an empty string then the user has cleared the text
         */
        getUncommittedText: function() {
          // We have to use textContent instead of innerText because we need
          // to preserve the line breaks when committing the edit.
          return _node.textContent;
        },

        /**
         * Performs the common actions when a text editor
         * becomes focused
         *
         * @method onFocusBase()
         */
        onFocusBase: function(event) {
          // If inline editor is open and toolbar button is clicked,
          // then again clicking on cell where inline editor is opened
          // should not request focus.
          var mainToolbarActive = event && event.relatedTarget &&
              (NavigationUtils.isTargetWithinMainToolbar(event.relatedTarget) ||
              event.relatedTarget.tagName === 'DIALOG');

          if(!mainToolbarActive) {
            _isTEActive = false;
            // signal that this widget has become focused
            PubSub.publish(_kSignal_RequestFocus, {
              textWidget: _api,
              contentType: _KRequest_Focus_Content_Type
            });

            // place the cursor
            _placeCursor();
          }
        },

        /**
         * Performs the common actions when a text editor
         * becomes blurred
         *
         * @method onBlurBase()
         */
        onBlurBase: function(event) {
          // If main toolbar has gained focus or share button is clicked then
          // don't call blur base, so that focus is not lost and sheet text
          // tool listeners are active.
          var mainToolbarActive = event && event.relatedTarget &&
              (NavigationUtils.isTargetWithinMainToolbar(event.relatedTarget) ||
              event.relatedTarget.tagName === 'DIALOG');
          if(!mainToolbarActive) {
            // signal that this widget has lost focus
            PubSub.publish(_kSignal_RequestFocusLost);
          }
        },

        /**
         * Returns the final cell area in the display text,
         * prior to the current cursor position.
         * The cell area is either a single cell ref, or a cell range,
         * whichever comes last (prior to the current cursor position).
         *
         * For example, this method will return {startCellRef: "B12"} if the
         * text before the end cursor is "=F9+D32:E67+B12+", and it will return
         * {startCellRef: "D32", endCellRef: "E67"} if the text before the end
         * cursor is "=F9+D32:E67+"
         *
         * @return {object or undefined} The final cell area - e.g.
         *                               {startCellRef: "B12",
         *                                endCellRef: "D19"},
         *                               or undefined if there isn't one
         * @method finalCellAreaBeforeCursor()
         */
        finalCellAreaBeforeCursor: function() {
          var obj;
          var selection = _getSelectedRange();
          if(selection) {
            var substr = _node.textContent.substring(0, selection.endOffset);
            obj = FormulaUtils.findFinalCellArea(substr);
          }
          return obj;
        },

        /**
         * Indicates whether the text editor widget is inline or not.
         * NOTE: This method must be overriden by each text editor widget.
         *
         * @method isInline()
         */
        isInline: function() {
          throw new Error("isInline() is undefined");
        }
      };

      var _addListeners = function() {
        DomListener.addListener(_node, 'keydown', _onKeyDownEvent);
        DomListener.addListener(_node, 'contextmenu', _onContextMenu);
        DomListener.addListener(_node, 'click', _onClick);
      };

      var _onKeyDownEvent = function(event) {
        // set text node event true to activate right tool for committing text.
        _isTEActive = true;
        switch(event.keyCode) {
          case _kEnterKeyCode:
          case _kTabKeyCode:
          case _kEscapeKeyCode:
            // don't allow 'end edit' keys into the content editable text
            if (event.preventDefault) {
              event.preventDefault();
            }
            break;
          default:
            break;
        }
      };

      var _onContextMenu = function(event) {
        // stop this event from propagating, otherwise our context menu will
        // pop up
        if (event.stopPropagation) {
          event.stopPropagation();
        }
      };

      var _onClick = function(event) {
        // stop this event from propagating, otherwise the autocomplete menu
        // will disappear
        _isTEActive = true;
        if (event.stopPropagation) {
          event.stopPropagation();
        }
      };

      var _injectCellRef = function(obj) {
        if(obj.byKey) {
          _injectRefByKey(obj.cellRef);
        }
        else {
          _injectRefByMouse(obj.cellRef);
        }
      };

      /**
       * Injects a cell ref into the text editor's text.
       * This may result in a new cell ref being injected
       * or an existing cell ref being updated
       *
       * @param cellRef {string} The cell ref - e.g. "C28"
       */
      var _injectRefByKey = function(cellRef) {
        var selection = _getSelectedRange();
        if(selection) {
          // find the final prefix char that comes before the end cursor
          // position
          var substr = _node.textContent.substring(0, selection.endOffset);
          var finalPrefixCharIdx =
              FormulaUtils.findFinalPrefixCharIndex(substr);
          if(finalPrefixCharIdx !== -1) {
            if(substr.charAt(finalPrefixCharIdx) === ':') {
              // the cell ref being injected should replace this
              // entire range, so get the prefix char before the ':' char
              finalPrefixCharIdx = FormulaUtils.findFinalPrefixCharIndex(
                substr.substring(0, finalPrefixCharIdx));
            }

            // inject the cell ref into the text
            var preString =
                _node.textContent.substring(0, finalPrefixCharIdx + 1);
            var postString = _node.textContent.substring(selection.endOffset);
            _node.textContent = preString + cellRef + postString;

            // place the cursor at the end of the injected cell ref
            var cursorPos = preString.length + cellRef.length;
            _placeCursor(cursorPos);
          }
        }
      };

      /**
       * Injects a newline character into the text editor's text
       * at the current cursor position.
       */
      var _injectNewlineCharacter = function() {
        var selection = _getSelectedRange();
        if(selection && selection.startOffset !== undefined &&
           selection.endOffset !== undefined) {
          var preString = _node.textContent.substring(0, selection.startOffset);
          var postString = _node.textContent.substring(selection.endOffset);
          var newString = preString;
          newString += _kNewlineCharacter;

          // TODO(mikkor) If we don't put the extra \n then we can not get
          // new line if we try to enter it in the end of one-line text
          if(!postString) {
            newString += _kNewlineCharacter;
          }

          newString += postString;
          _node.textContent = newString;

          // place the cursor at the end of the injected new line
          var cursorPos = selection.endOffset - (selection.endOffset -
            selection.startOffset) + 1;
          _placeCursor(cursorPos);
        }
      };

      /**
       * Injects a cell ref into the text editor's text,
       * at the current cursor position.
       * A '=' or +' symbol may be added before the cell ref
       * depending on the character that precedes the current
       * cursor position
       *
       * @param cellRef {string} The cell ref - e.g. "C28"
       */
      var _injectRefByMouse = function(cellRef) {
        var selection = _getSelectedRange();
        if(selection) {
          // prepend a mathematical character to the cell ref, if required
          if(0 === selection.startOffset) {
            // the cursor is at the start of the text so prepend a '=' char
            cellRef = '=' + cellRef;
          }
          else if(!FormulaUtils.charIsValidCellRefPrefix(_node.textContent,
            selection.startOffset - 1)) {
            // the character before the cursor is not recognised as a valid
            // character to prefix a cell ref, so prepend a '+' char
            cellRef = '+' + cellRef;
          }

          // inject the cell ref into the text
          var preString = _node.textContent.substring(0, selection.startOffset);
          var postString = _node.textContent.substring(selection.endOffset);
          _node.textContent = preString + cellRef + postString;

          // place the cursor at the end of the injected cell ref
          var cursorOffset = cellRef.length;
          var cursorPos = selection.endOffset - (selection.endOffset -
            selection.startOffset) + cursorOffset;
          _placeCursor(cursorPos);
        }
      };

      var _injectCellRange = function(obj) {
        if(obj.byKey) {
          _injectRangeByKey(obj.cellRange);
        }
        else {
          _injectRangeByMouse(obj.cellRange);
        }
      };

      /**
       * Injects a cell range into the text editor's text.
       * This may result in a new cell range being injected
       * or an existing cell range being updated
       *
       * @param cellRange {object} The cell range - e.g.
       *                           {topLeft: "C28", bottomRight: "F37"}
       */
      var _injectRangeByKey = function(cellRange) {
        var selection = _getSelectedRange();
        if(selection) {
          var preLength = _node.textContent.length;

          // find the final prefix char that comes before the end cursor
          // position
          var substr = _node.textContent.substring(0, selection.endOffset);
          var finalPrefixCharIdx =
              FormulaUtils.findFinalPrefixCharIndex(substr);
          if(finalPrefixCharIdx !== -1) {
            if(substr.charAt(finalPrefixCharIdx) === ':') {
              // the cell range being injected should replace this
              // entire range, so get the prefix char before the ':' char
              finalPrefixCharIdx = FormulaUtils.findFinalPrefixCharIndex(
                substr.substring(0, finalPrefixCharIdx));
            }

            // inject the cell range into the text
            var preString =
                _node.textContent.substring(0, finalPrefixCharIdx + 1);
            var postString = _node.textContent.substring(selection.endOffset);
            _node.textContent = preString + cellRange.topLeft;
            if(cellRange.bottomRight !== cellRange.topLeft) {
              _node.textContent += ':' + cellRange.bottomRight;
            }
            _node.textContent += postString;

            // place the cursor at the end of the injected cell range
            var cursorOffset = _node.textContent.length - preLength;
            var cursorPos = selection.endOffset + cursorOffset;
            _placeCursor(cursorPos);
          }
        }
      };

      /**
       * Injects a cell range into the text editor's text.
       * This may result in a new cell range being injected
       * or an existing cell range being updated
       *
       * @param cellRange {object} The cell range - e.g.
       *                           {topLeft: "C28", bottomRight: "F37"}
       */
      var _injectRangeByMouse = function(cellRange) {
        var selection = _getSelectedRange();
        if(selection) {
          var preLength = _node.textContent.length;

          // get the index of the cell ref that starts the range
          var idxOfStartCellRef = _indexOfStartCellRef(selection.startOffset);

          // inject the cell range into the text
          var preString = _node.textContent.substring(0, idxOfStartCellRef);
          var postString = _node.textContent.substring(selection.endOffset);
          _node.textContent = preString + cellRange.topLeft;
          if(cellRange.bottomRight !== cellRange.topLeft) {
            _node.textContent += ':' + cellRange.bottomRight;
          }
          _node.textContent += postString;

          // place the cursor at the end of the injected cell range
          var cursorOffset = _node.textContent.length - preLength;
          var cursorPos = selection.endOffset - (selection.endOffset -
            selection.startOffset) + cursorOffset;
          _placeCursor(cursorPos);
        }
      };

      var _indexOfStartCellRef = function(cursorStartOffset) {
        var index;
        var substr = _node.textContent.substring(0, cursorStartOffset);
        var finalPrefixCharIdx = FormulaUtils.findFinalPrefixCharIndex(substr);
        if((finalPrefixCharIdx !== -1) &&
           (substr.charAt(finalPrefixCharIdx) === ":")) {
          // we want to update the existing range - we want to replace
          // the range's current 'end' cell ref with the new cell ref
          index = FormulaUtils.findFinalPrefixCharIndex(
            substr.substring(0, finalPrefixCharIdx)) + 1;
        }
        else {
          // we want to start a new range - we want to append
          // ':<cellRef>' at the current cursor position
          index = FormulaUtils.findFinalPrefixCharIndex(substr) + 1;
        }
        return index;
      };

      /**
       * Places the cursor in the appropriate place in the
       * text content of the text editor.
       * Note that the cursor will either be placed at the end
       * of the text or - if a cell ref or range has just been
       * injected - at the position immediately after the injected text
       *
       * @param {integer} cursorPos Optional parameter indicating the
       *                            position to place the cursor - only
       *                            specified when a cell ref or range
       *                            has just been injected
       */
      var _placeCursor = function(cursorPos) {
        var range = document.createRange();
        var sel = window.getSelection();

        if (_node.firstChild === null) {
          // the text editor has no content - place the cursor at pos 0
          cursorPos = 0;
          range.setStart(_node, cursorPos);
        }
        else {
          // the text editor has content
          if(cursorPos) {
            // place the cursor at the position that is specified
            range.setStart(_node.firstChild, cursorPos);
            // make this a single cursor and not a range to the end of the text
            range.collapse(true);
          }
          else {
            // place the cursor at the end of the text
            range.selectNodeContents(_node.firstChild);
            cursorPos = range.endOffset;
            range.setStart(_node.firstChild, cursorPos);
          }
        }

        sel.removeAllRanges();
        sel.addRange(range);
      };

      return _api;
    };

    var _getSelectedRange = function() {
      var selection;
      if(window.getSelection) {
        var sel = window.getSelection();
        if(sel.getRangeAt && sel.rangeCount) {
          var rangeObj = sel.getRangeAt(0);
          if(rangeObj) {
            selection = {
              startOffset: rangeObj.startOffset,
              endOffset: rangeObj.endOffset
            };
          }
        }
      }
      return selection;
    };

    // We create a new instance of the object by invoking
    // the module constructor function.
    var instance = module();
    return instance;
  }
};

return _factory;
});
