/**
 * Formula Bar
 * ===========
 *
 * The formula bar widget encapsulates the part of the HTML DOM representing a
 * workbook that displays the formula bar above the grid. The formula bar
 * is used to display the content of the currently selected cell, and the user
 * can use it to edit the contents of that cell.
 *
 * @author          Lorraine Martin (lorrainemartin@google.com)
 * @constructor     Constructor for the Formula Bar widget.
 * @return {object} A Formula Bar widget.
 */
define([
  'qowtRoot/features/utils',
  'qowtRoot/utils/domListener',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/textEditorBase'
  ], function(
    Features,
    DomListener,
    PubSub,
    TextEditorBase) {

  'use strict';

  var _kFormula_Bar = {
    Tag: 'div',
    Class: 'qowt-sheet-formula-bar-editor',
    NonActiveClass: 'qowt-sheet-formula-bar-editor-non-active',
    ActiveClass: 'qowt-sheet-formula-bar-editor-active',
    EditModeHoverClass: 'qowt-sheet-formula-bar-editor-edit-mode-hover'
  },

  _kFunctionIcon = {
    Tag: 'div',
    Class: 'qowt-sheet-formula-bar-function-icon'
  },

  _formulaBarNode,
  _functionIconNode,
  _destroyToken,
  _isActive = false,

  // Signals that are published
  _kSignal_FormulaBarFocused = "qowt:formulaBar:focused";

  // Extend text editor base
  var _api = TextEditorBase.create();

  /**
   * Initialise this singleton - should not be called during load, but
   * instead by the layout control responsible for configuring the widgets
   *
   * @method init()
   */
  _api.init = function() {
    _init();
  };

  /**
   * Remove the html elements from their parents and destroy all references.
   * @public
   */
  _api.destroy = function() {
    _destroy();
  };

  /**
   * Makes the formula bar editable
   */
  _api.enableEdits = function() {
    _formulaBarNode.contentEditable = true;
    _formulaBarNode.classList.add(_kFormula_Bar.EditModeHoverClass);

    // ensure the cursor is not present in the formula bar
    var sel = window.getSelection();
    sel.removeAllRanges();
  };

  /**
   * Makes the formula bar non-editable
   */
  _api.disableEdits = function() {
    _formulaBarNode.contentEditable = false;
    _formulaBarNode.classList.remove(_kFormula_Bar.EditModeHoverClass);
  };

  /**
   * Returns whether or not this text widget is inline or not.
   * In the case of the formula bar, returns false.
   * NOTE: This method overrides the implementation in TextEditorBase
   *
   * @return {boolean} False
   * @method isInline()
   */
  _api.isInline = function() {
    return false;
  };

  /**
   * Every widget has an appendTo() method.
   * This is used to attach the HTML elements of the widget to a
   * specified node in the HTML DOM.
   * Here the formula bar node and formula icon node are appended as
   * children to the specified node
   *
   * @param node {object} The HTML node that this widget is to
   * attach itself to
   * @method appendTo(node)
   */
  _api.appendTo = function(node) {
    if (node === undefined) {
      throw ("FormulaBar.appendTo(): missing node parameter!");
    }
    node.appendChild(_functionIconNode);
    node.appendChild(_formulaBarNode);
  };

  /**
   * @api private
   */
  var _init = function() {

    if (_destroyToken) {
      throw new Error('formulaBar.init() called multiple times.');
    }

    _formulaBarNode = document.createElement(_kFormula_Bar.Tag);
    _formulaBarNode.classList.add(_kFormula_Bar.Class);
    _formulaBarNode.classList.add(_kFormula_Bar.NonActiveClass);

    _functionIconNode = document.createElement(_kFunctionIcon.Tag);
    _functionIconNode.classList.add(_kFunctionIcon.Class);

    if (Features.isEnabled('edit')) {
      _formulaBarNode.contentEditable = true;
      _formulaBarNode.spellcheck = false;
      _formulaBarNode.style.background = "white";
      _formulaBarNode.classList.add(_kFormula_Bar.EditModeHoverClass);
      _formulaBarNode.setAttribute('tabIndex', 0);
    }

    // store the base text editor node
    _api.setNode(_formulaBarNode);

    _addListeners();
  };

  var _addListeners = function() {
    if (Features.isEnabled('edit')) {
      DomListener.addListener(_formulaBarNode, 'blur', _onBlur);
      DomListener.addListener(_formulaBarNode, 'focus', _onFocus);
    }
    _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
  };

  var _onBlur = function() {
    // only process the blur event if it has occured because something
    // else has gained focus *within* the QO app (in which case the
    // document's activeElement will have changed); ignore it if the
    // focus has gone to something *outwith* the QO app (in which case
    // the document's activeElement will remain the same) - e.g. another
    // browser window.
    if (document.activeElement !== _formulaBarNode) {
      _isActive = false;
      _formulaBarNode.classList.remove(_kFormula_Bar.ActiveClass);
      _formulaBarNode.classList.add(_kFormula_Bar.NonActiveClass);
      _api.onBlurBase();
    }
  };

  var _onFocus = function() {
    // only process the focus event if the formula
    // bar node wasn't already the active element.
    if (!_isActive) {
      _isActive = true;

      PubSub.publish(_kSignal_FormulaBarFocused);
      _formulaBarNode.classList.remove(_kFormula_Bar.NonActiveClass);
      _formulaBarNode.classList.add(_kFormula_Bar.ActiveClass);
      _api.onFocusBase();
    }
  };

  /**
   * Resets everything which is initialized in init method.
   * @private
   */
  var _destroy = function() {
    if (_formulaBarNode && _formulaBarNode.parentNode) {
      if (Features.isEnabled('edit')) {
        DomListener.removeListener(_formulaBarNode, 'blur', _onBlur);
        DomListener.removeListener(_formulaBarNode, 'focus', _onFocus);
      }
      _formulaBarNode.parentNode.removeChild(_formulaBarNode);
    }

    if (_functionIconNode && _functionIconNode.parentNode) {
      _functionIconNode.parentNode.removeChild(_functionIconNode);
    }

    PubSub.unsubscribe(_destroyToken);
    _destroyToken = undefined;
    _formulaBarNode = undefined;
    _functionIconNode = undefined;
    _isActive = false;
  };

  return _api;
});
