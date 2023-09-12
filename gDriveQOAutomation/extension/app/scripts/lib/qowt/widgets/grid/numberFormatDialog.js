// Copyright 2013 Google Inc. All Rights Reserved.



/**
 * @fileoverview The number format widget encapsulates the part of the HTML DOM
 * representing a number format dialog.
 * The dialog has tabs on the left side and HTML controls on the right.
 * The controls on the right depend on which of the tabs is currently selected.
 * The dialog can be displayed and hidden.
 *
 * @author mikkor@google.com (Mikko Rintala)
 * @constructor     Constructor for the Number Format Dialog widget
 * @return {object} A Number Format Dialog widget.
*/

define([
  'qowtRoot/utils/domListener',
  'qowtRoot/utils/htmlConstructor',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/grid/numberFormatDialogConfig',
  'qowtRoot/utils/i18n',
  'qowtRoot/utils/domUtils'
], function(
    DomListener,
    Html,
    PubSub,
    WidgetFactory,
    Config,
    I18n,
    DomUtils) {

  'use strict';

  /**
     * @private
     */
  // actions to be published
  var _toggleEvent = 'toggleNumberFormatDialog',
      _formatEvent = 'numberFormat',

      // signals to be published
      _requestAction = 'qowt:requestAction',
      _doAction = 'qowt:doAction',

      _classSelected = 'selected',

      // method to be called when the format is submitted
      _formatSubmitMethod,

      _kGenOther = 6,

      // Private members
      _kGeneral = 1,
      _kDecimal = 2,
      _kThousand = 4,
      _kSymbol = 8,
      _kNegative = 16,
      _kDate = 32,

      // Indeces of the format tabs
      _kGen = 0,
      _kNum = 1,
      _kCur = 2,
      _kAcc = 3,
      _kDat = 4,
      _kPer = 5,
      _kSci = 6,

      // HTML nodes of different components in the UI
      _domNodes = {},
      _titleClose,
      _tabs,
      _formatArea,
      _valueGeneral,
      _valueDecimal,
      _valueThousand,
      _valueSymbol,
      _valueNegativeRed,
      _valueNegative123,
      _valueDate,
      _destroyToken,
      _selectionChangedToken,
      _domListenerId = 'numberFormatDialog';

  // The public API of this component
  var _api = {
    /**
     * Initialise this singleton - should not be called during load, but
     * instead by the layout control responsible for configuring the widgets
     *
     */
    init: function() {
      if (_destroyToken) {
        throw new Error('numberFormatDialog.init() called multiple times.');
      }

      _setupHtml();

      _formatArea = _domNodes.dialog.getElementById(Config.kIdName.area);
      _tabs = _domNodes.dialog.getElementById(Config.kIdName.tabs);
      _titleClose = _domNodes.dialog.getElementById(Config.kIdName.titleClose);

      _valueGeneral =
          _domNodes.dialog.getElementById(Config.kIdName.valueGeneral);
      _valueDecimal =
          _domNodes.dialog.getElementById(Config.kIdName.valueDecimal);
      _valueThousand =
          _domNodes.dialog.getElementById(Config.kIdName.valueThousand);
      _valueSymbol =
          _domNodes.dialog.getElementById(Config.kIdName.valueSymbol);
      _valueNegativeRed =
          _domNodes.dialog.getElementById(Config.kIdName.valueNegativeRed);
      _valueNegative123 =
          _domNodes.dialog.getElementById(Config.kIdName.valueNegative123);
      _valueDate = _domNodes.dialog.getElementById(Config.kIdName.valueDate);

      _domNodes.dialog.style.visibility = 'hidden';

      _initializeOptions();
      _initalizeHandlers();

      _destroyToken = PubSub.subscribe('qowt:destroy', _api.destroy);
      _selectionChangedToken = PubSub.subscribe('qowt:selectionChanged',
          _onSelectionChanged);
    },

    /**
     * Every widget has an appendTo() method.
     * This is used to attach the HTML elements of the widget to a
     * specified node in the HTML DOM.
     *
     * @param {Node} node The HTML node that this widget is to append itself
     */
    appendTo: function(node) {
      if (node !== undefined) {
        node.appendChild(_domNodes.dialog);
      }
    },

    /**
     * Toggles the visibility of the dialog.
     * If it's currently shown, it's hidden and vice versa.
     *
     */
    toggleVisibility: function() {
      if (_domNodes.dialog.style.visibility === 'visible') {
        _domNodes.dialog.style.visibility = 'hidden';
      } else {
        _domNodes.dialog.style.visibility = 'visible';
      }
    },

    /**
     * Takes a number format code as a parameter, fills up the dialog
     * according to the formula and opens the correct tab.
     *
     * There's a try catch statement in case there's a very
     * malicious number format code in the sheet.
     *
     * @param {string} code formula code to be applied in the dialog
     */
    applyFormat: function(code) {
      try {
        _applyFormat(code);
      } catch (e) {
        // No op
      }
    },

    /**
     * Takes whatever is currently in the dialog and sends it to the core.
     * Should be used by the unit tests only.
     *
     */
    __unitTestSendFormat: function() {
      _handleSubmitFormat();
    },

    /**
     * Remove the html elements from their parents and destroy all references.
     */
    destroy: function() {

      if (_destroyToken) {
        DomListener.removeGroup(_domListenerId);
      }

      if (_valueDecimal && _valueDecimal.hasChildNodes()) {
        while (_valueDecimal.hasChildNodes()) {
          DomUtils.removeNode(_valueDecimal.firstChild);
        }
      }

      if (_valueDate && _valueDate.hasChildNodes()) {
        while (_valueDate.hasChildNodes()) {
          DomUtils.removeNode(_valueDate.firstChild);
        }
      }

      if (_valueSymbol && _valueSymbol.hasChildNodes()) {
        while (_valueSymbol.hasChildNodes()) {
          DomUtils.removeNode(_valueSymbol.firstChild);
        }
      }

      if (_valueGeneral && _valueGeneral.hasChildNodes()) {
        while (_valueGeneral.hasChildNodes()) {
          DomUtils.removeNode(_valueGeneral.firstChild);
        }
      }

      DomUtils.removeNode(_titleClose);
      if (_tabs) {
        DomUtils.removeNode(_tabs.childNodes[_kGen]);
        DomUtils.removeNode(_tabs.childNodes[_kNum]);
        DomUtils.removeNode(_tabs.childNodes[_kCur]);
        DomUtils.removeNode(_tabs.childNodes[_kAcc]);
        DomUtils.removeNode(_tabs.childNodes[_kDat]);
        DomUtils.removeNode(_tabs.childNodes[_kPer]);
        DomUtils.removeNode(_tabs.childNodes[_kSci]);
      }

      DomUtils.removeNode(_valueDecimal);
      DomUtils.removeNode(_valueThousand);
      DomUtils.removeNode(_valueSymbol);
      DomUtils.removeNode(_valueDate);
      DomUtils.removeNode(_valueNegativeRed);
      DomUtils.removeNode(_valueNegative123);

      DomUtils.removeNode(_domNodes.dialog);

      PubSub.unsubscribe(_destroyToken);
      PubSub.unsubscribe(_selectionChangedToken);
      _domNodes.dialog = undefined;
      _domNodes = {};

      _formatArea = undefined;
      _tabs = undefined;
      _titleClose = undefined;

      _valueGeneral = undefined;
      _valueDecimal = undefined;
      _valueThousand = undefined;
      _valueSymbol = undefined;
      _valueNegativeRed = undefined;
      _valueNegative123 = undefined;
      _valueDate = undefined;
      _destroyToken = undefined;
      _selectionChangedToken = undefined;
    }
  };

  // Private methods

  var _applyFormat = function(code) {
    var dec, sep, negR = false, neg123 = false;
    var gen, cur, date, sci, unsup;

    // Check if we support the formatting code
    if (code !== undefined && typeof code === 'string' && code !== '') {

      // Any of the date options
      date = _handleMatchingDate(code);

      if (date === undefined) {
        // Is it one of the general options
        gen = _handleMatchingGeneral(code);

        if (gen === undefined) {
          dec = _getNumberOfDecimals(code);
          if (dec !== undefined) {
            cur = _handleMatchingCurrency(code);
            negR = _hasNegativeRed(code);
            neg123 = _hasNegativeParentheses(code);
            sep = _hasSeparator(code);
            if (!cur) {
              sci = _isScientific(code);
              unsup = _isPossiblyUnsupportedFormat(code);
              if (unsup) {
                gen = _kGenOther;
              }
            }
          } else {
            gen = _kGenOther;
          }
        }
      }
    } else { // no format code -> it's general
      gen = 0;
    }

    // Function to open the correct tab
    var openTabFunction;

    // See which tab should be opened
    if (gen !== undefined || unsup) {
      openTabFunction = _handleOpenGeneral;
    } else if (date !== undefined) {
      openTabFunction = _handleOpenDate;
    } else if (sci) {
      openTabFunction = _handleOpenScientific;
    } else if (code.indexOf('#,##') !== -1 && code.indexOf('* ') !== -1) {
      openTabFunction = _handleOpenAccounting;
    } else if (cur !== undefined) {
      openTabFunction = _handleOpenCurrency;
    } else if (code.indexOf('%') !== -1) {
      openTabFunction = _handleOpenPercentage;
    } else {
      openTabFunction = _handleOpenNumber;
    }

    // Reset values
    if (gen === undefined) {
      gen = 0;
    }
    if (date === undefined) {
      date = 0;
    }
    if (cur === undefined) {
      cur = 0;
    }
    if (sep === undefined) {
      sep = false;
    }

    // Set the values in the widgets
    _valueDecimal.selectedIndex = dec;
    _valueThousand.checked = sep;
    _valueDate.selectedIndex = date;
    _valueSymbol.selectedIndex = cur;
    _valueNegativeRed.checked = negR;
    _valueNegative123.checked = neg123;

    _valueGeneral.childNodes[gen].checked = true;
    // Show 'other' when the current format is other..
    if (gen === _kGenOther) {
      _valueGeneral.childNodes[_kGenOther].style.display = 'inline-block';
      _valueGeneral.childNodes[_kGenOther + 1].style.display = 'inline';
      _valueGeneral.childNodes[_kGenOther].value = code; // store the original
    } else { // Hide 'other' when we have a supported formatting code
      _valueGeneral.childNodes[_kGenOther].style.display = 'none';
      _valueGeneral.childNodes[_kGenOther + 1].style.display = 'none';
    }

    if (openTabFunction) {
      openTabFunction();
    }
  };

  // Is scientific
  var _isScientific = function(code) {
    return code.indexOf('E') !== -1 ? true : false;
  };

  // Gets the number of decimals from the format code
  var _getNumberOfDecimals = function(code) {
    var dec, tmp = '0.';
    if (code.indexOf('0') !== -1) {
      dec = 0; // At least a number
    }
    if (code.indexOf(tmp) !== -1) {
      for (var i = 0; i < 30; i++) {
        tmp += '0';
        if (code.indexOf(tmp) !== -1) {
          dec++;
        } else {
          break;
        }
      }
    }
    return dec;
  };

  // Checks if the format code has a separator
  var _hasSeparator = function(code) {
    return code.indexOf('#') !== -1 ? true : false;
  };

  // Checks if the format code has 'red negative value'
  var _hasNegativeRed = function(code) {
    return code.indexOf(';[Red]') !== -1 ? true : false;
  };

  // Checks if the format code has negative values in parentheses
  var _hasNegativeParentheses = function(code) {
    return code.indexOf('\\(') !== -1 ? true : false;
  };

  // Checks if a format code is possibly an unsupported format
  // It's 'possibly' because this returns true for all the date and time
  // formats, too. So make sure '_handleMatchingDate' is called too to
  // find out if the format is one of the pre-defined date/time formats.
  var _isPossiblyUnsupportedFormat = function(code) {
    var i, ret = false, unsupportedLetters = [
      'm', 'y', 'h', 'm', 's', '/?', '?/'
    ];
    for (i = 0; i < unsupportedLetters.length; i++) {
      if (code.indexOf(unsupportedLetters[i]) !== -1) {
        ret = true;
      }
    }
    return ret;
  };

  // Checks if the format code is one of the predefined general codes
  var _handleMatchingGeneral = function(code) {
    var i, gen;
    for (i = 0; i < Config.generalOptions.length; i++) {
      if (code === Config.generalOptions[i].value) {
        gen = Config.generalOptions[i].idx;
      }
    }
    return gen;
  };

  // Checks if the format is one of the pre-defined date formats
  var _handleMatchingDate = function(code) {
    var i, j, date, opt;
    // Is it one of the date options in the long list
    for (i = 0; i < Config.dateOptions.length; i++) {
      // Sometimes the formats have ';@', sometimes not, so ignore it
      var tunedCode = code.replace(';@', '');
      if (tunedCode === Config.dateOptions[i].value.replace(';@', '')) {
        // if it's not shown, add it to the UI
        if (!Config.dateOptions[i].show) {
          opt = document.createElement('option');
          opt.textContent = Config.dateOptions[i].text;
          opt.value = Config.dateOptions[i].value;
          _valueDate.appendChild(opt);
          Config.dateOptions[i].show = true;
        }
        for (j = 0; j < _valueDate.children.length; j++) {
          if (tunedCode === _valueDate.children[j].value.replace(';@', '')) {
            date = j;
            break;
          }
        }
        break;
      }
    }
    return date;
  };

  /*
   * Takes the format code as a parameter.
   * Looks for a possible currency string.
   * Currency strings are formatted like this:
   * [$NOK-1234] ie. it starts with '[$' and
   * is followed by the currency symbol itself.
   * Then the locale is added into the string
   * (separated by '-' from the currency symbol).
   * The whole string is closed by the ']' character.
   * This method finds the currency, tries to match it
   * into the predefined currencies.
   * If it's not there, adds it into the currency list
   * and returns the index of the new currency.
   * If no currency is found, returns undefined.
   * @param code {String} The format code
   * @return {Number} The index (in the Config.currencyOptions array)
   *                  of the currency found in the number format code.
   */
  var _handleMatchingCurrency = function(code) {
    var symbS = '[$';
    var loc = '-';
    var symbE = ']';
    var spaceS = '\\ ';
    var curIdx, curCode, curDisplay;
    var symbSI, symbEI, locI, i, opt;

    // Check first if the currency is one of the predefined ones..
    for (i = 0; i < Config.currencyOptions.length; i++) {
      if (code.indexOf(Config.currencyOptions[i].value) !== -1) {
        curIdx = i;
        break;
      }
    }

    if (curIdx === undefined) { // not predefined..
      symbSI = code.indexOf(symbS);
      if (symbSI >= 0) {
        locI = code.substr(symbSI).indexOf(loc);
        symbEI = code.substr(symbSI).indexOf(symbE);
        if (locI === -1) { // If no locale, use the ']' as the end position
          locI = symbEI;
        }
        // found both start and end position of the currency
        if (symbEI > symbS.length && locI > symbS.length) {
          // take the whole currency string
          curCode = code.substr(symbSI, symbEI + symbE.length);
          // take the displayed currency string
          curDisplay = code.substr(symbSI + symbS.length, locI - symbS.length);

          // Check the position of the symbol and possible space
          var valI; // Index of the actual value
          var curEnd; // Is the currency after the value
          var space; // Is there no space between currency and value
          valI = code.indexOf('0');
          if (valI < symbSI) { // currency after the value
            curEnd = true;
            if (code.substr(symbSI - spaceS.length, spaceS.length) === '\\ ') {
              space = true; // space between currency and value
            }
          } else { // currency front of the value
            var endLen = symbSI + symbEI + symbE.length;
            if (code.substr(endLen, spaceS.length) === '\\ ') {
              space = true; // space between value and currency
            }
          }

          // Can we map it now to predefined currencies?
          // When we support custom formats, we don't want to do this mapping
          for (i = 0; i < Config.currencyOptions.length; i++) {
            if (Config.currencyOptions[i].text === curDisplay) {
              curIdx = i;
              break;
            }
          }

          // Cannot map, create a new one..
          if (curIdx === undefined) {
            var newCur = {};
            newCur.text = curDisplay;
            newCur.value = curCode;
            newCur.end = curEnd;
            newCur.space = space;

            Config.currencyOptions.push(newCur);
            curIdx = Config.currencyOptions.length - 1;

            opt = document.createElement('option');
            opt.textContent = newCur.text;
            opt.value = newCur.value;
            _valueSymbol.appendChild(opt);
          }
        }
      }
    }
    return curIdx;
  };

  // Create a skeleton dialog
  var _setupHtml = function() {
    _domNodes.dialog = document.createElement('div');
    _domNodes.dialog.id = Config.kIdName.dialogContainer;
    Html.constructHTML([{
      className: Config.kClassName.dialog,
      children: [
        // DIALOG TITLE
        {
          className: Config.kClassName.title,
          children: [{
            className: Config.kClassName.titleLeft,
            textContent: I18n.getMessage(Config.kLocName.title)
          },{
            className: Config.kClassName.titleRight,
            id: Config.kIdName.titleClose,
            textContent: 'X'
          }]
        },
        // TABS
        {
          className: Config.kClassName.tabs,
          id: Config.kIdName.tabs,
          children: [{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabGeneral)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabNumber)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabCurrency)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabAccounting)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabDate)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabPercentage)
          },{
            className: Config.kClassName.tab,
            textContent: I18n.getMessage(Config.kLocName.tabScientific)
          }]
        },
        // FORMAT AREA
        {
          className: Config.kClassName.area,
          id: Config.kIdName.area,
          children: [
            { // General
              className: Config.kClassName.item,
              id: Config.kIdName.valueGeneral,
              elType: 'form'
            },
            { // Decimal
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueDecimal,
                elType: 'select'
              },
              {
                className: Config.kClassName.rightItem,
                textContent: I18n.getMessage(Config.kLocName.labelDecimal)
              }]
            },
            { // Thousand
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueThousand,
                elType: 'input',
                type: 'checkbox'
              },
              {
                className: Config.kClassName.rightItem,
                textContent: I18n.getMessage(Config.kLocName.labelThousand)
              }]
            },
            { // Currency
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueSymbol,
                elType: 'select'
              },
              {
                className: Config.kClassName.rightItem,
                textContent: I18n.getMessage(Config.kLocName.labelCurrency)
              }]
            },
            { // Negative title
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.rightItem,
                textContent: I18n.getMessage(Config.kLocName.labelNegative),
                id: Config.kIdName.labelNegative
              }]
            },
            { // Negative red
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueNegativeRed,
                elType: 'input',
                type: 'checkbox'
              },
              {
                className: Config.kClassName.rightItem + Config.kClassName.red,
                textContent: I18n.getMessage(Config.kLocName.labelNegativeRed)
              }]
            },
            { // Negative ()
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueNegative123,
                elType: 'input',
                type: 'checkbox'
              },
              {
                className: Config.kClassName.rightItem,
                textContent: '(123)'
              }]
            },
            { // Date
              className: Config.kClassName.item,
              children: [{
                className: Config.kClassName.leftItem,
                id: Config.kIdName.valueDate,
                elType: 'select'
              },
              {
                className: Config.kClassName.rightItem,
                textContent: I18n.getMessage(Config.kLocName.labelDate)
              }]
            }]
        }]
    }], _domNodes.dialog);
  };

  var _onSelectionChanged = function(signal, signalData) {
    signal = signal || '';
    var widget = WidgetFactory.create(signalData);

    if (widget) {
      if (widget.numberFormat) {
        var nf = widget.numberFormat();
        _api.applyFormat(nf);
      }
    }
  };

  var _handleClickOnX = function() {
    PubSub.publish(_doAction, {
      'action': _toggleEvent,
      'context': {contentType: 'workbook'}
    });
  };

  /**
   * Creates the string used by the thousand separator
   */
  var _getSeparatorString = function(dec) {
    var tmp = '#', i;
    if (dec > 0) {
      tmp += ',';
      for (i = 0; i < dec; i++) {
        tmp += '#';
      }
    } else {
      // This is strange but if there are no decimals, Excel still adds ',##'
      tmp += ',##';
    }
    return tmp;
  };

  /**
   * Creates a numeric formatting string according to the given parameters.
   *
   * @param {number} dec the number of decimals
   * @param {number} curIdx the index of the currency
   * @param {string} sepStr separator string to be used in this format
   * @param {boolean} negR whether negative numbers should be red or not
   * @param {boolean} neg123 whether negative numbers should be in ()
   * @param {boolean} perc whether the number is a percentage
   */
  var _createNumericString = function(dec, curIdx, sepStr,
      negR, neg123, perc) {
    var code = '', curStr = '', curEnd = false, curSpace = false, i;
    if (curIdx >= 0) {
      curStr = Config.currencyOptions[curIdx].value;
      curEnd = Config.currencyOptions[curIdx].end;
      curSpace = Config.currencyOptions[curIdx].space;
    }

    // If currency before the value, add it and the possible space
    if (curStr && !curEnd) {
      code += curStr;
      if (curSpace) {
        code += '\\ ';
      }
    }

    // Add thousand separator and the value itself
    code += sepStr;
    code += '0';

    // Add possible decimals
    if (dec > 0) {
      code += '.';
      for (i = 0; i < dec; i++) {
        code += '0';
      }
    }

    // If currency in the end, add it and the possible space
    if (curStr && curEnd) {
      if (curSpace) {
        code += '\\ ';
      }
      code += curStr;
    }

    // Handle showing negative values
    if (negR || neg123) {
      // When negative values have parenthesis, we need to use them in pos too
      if (neg123) {
        code += '_)';
      }

      // End the positive area
      code += ';';

      // Color code
      if (negR) {
        code += '[Red]';
      }

      // Negative parentheses
      if (neg123) {
        code += '\\(';
      }

      // If currency before the value, add it and the possible space
      if (curStr && !curEnd) {
        code += curStr;
        if (curSpace) {
          code += '\\ ';
        }
      }

      code += sepStr;
      code += '0';

      // Decimals
      if (dec > 0) {
        code += '.';
        for (i = 0; i < dec; i++) {
          code += '0';
        }
      }

      // If currency in the end, add it and the possible space
      if (curStr && curEnd) {
        if (curSpace) {
          code += '\\ ';
        }
        code += curStr;
      }

      // Negative parentheses
      if (neg123) {
        code += '\\)';
      }
    } else if (perc) {
      code += '%';
    }

    return code;
  };

  var _publishCode = function(code) {
    if (code) {
      PubSub.publish(_requestAction, {
        'action': _formatEvent,
        'context': {value: code}
      });
    }
  };

  var _handleSubmitGeneral = function() {
    var items = _valueGeneral.getElementsByTagName('input');
    var i, code;
    for (i = 0; i < items.length; i++) {
      if (items[i].checked) {
        code = items[i].value;
        break;
      }
    }
    _publishCode(code);
  };

  var _handleSubmitNumber = function() {
    var dec, code, sepStr = '';
    dec = parseInt(_valueDecimal.selectedIndex, 10);

    if (_valueThousand.checked) {
      sepStr = _getSeparatorString(dec);
    }

    code = _createNumericString(dec, -1, sepStr,
        _valueNegativeRed.checked, _valueNegative123.checked);
    _publishCode(code);
  };

  var _handleSubmitCurrency = function() {
    var dec, idx, code, negR, neg123;
    dec = parseInt(_valueDecimal.selectedIndex, 10);
    idx = _valueSymbol.selectedIndex;
    negR = _valueNegativeRed.checked;
    neg123 = _valueNegative123.checked;

    // Currencies always use #,## as separator..
    code = _createNumericString(dec, idx,
        Config.currencySeparator, negR, neg123);
    _publishCode(code);
  };

  var _handleSubmitDate = function() {
    var code = _valueDate[_valueDate.selectedIndex].value;
    _publishCode(code);
  };

  var _handleSubmitPercentage = function() {
    var dec, code;
    dec = parseInt(_valueDecimal.selectedIndex, 10);
    code = _createNumericString(dec, -1, '', false, false, true);
    _publishCode(code);
  };

  var _handleSubmitScientific = function() {
    var dec, code, i;
    dec = parseInt(_valueDecimal.selectedIndex, 10);
    code = '0';
    if (dec > 0) {
      code += '.';
      for (i = 0; i < dec; i++) {
        code += '0';
      }
    }
    code += 'E+00';
    _publishCode(code);
  };

  /**
   * Accounting formats are unfortunately so different to other numeric
   * (number, currency, percentage) formats that it needs a separate method.
   */
  var _handleSubmitAccounting = function() {
    var dec, d1, d2, idx, code, tmp, i;
    // The format has 4 parts so there are separate variables for each
    var p1, p2, p3, p4 = '_(@_)';
    // get decimals and currency
    dec = parseInt(_valueDecimal.selectedIndex, 10);
    idx = _valueSymbol.selectedIndex;
    // the decimal strings are different in the first and second parts
    d1 = '0';
    d2 = '';
    if (dec > 0) {
      d1 += '.';
      for (i = 0; i < dec; i++) {
        d1 += '0';
        d2 += '?';
      }
    }
    // Is currency after the digit
    var end = Config.currencyOptions[idx].end;

    if (end) {
      tmp = '_ ';
    } else {
      tmp = '_(';
      tmp += Config.currencyOptions[idx].value;
      if (Config.currencyOptions[idx].space) {
        tmp += '\\ ';
      }
    }

    // Asterisk means the currency is left aligned and the rest on the right
    tmp += '* ';
    p1 = tmp;
    p2 = tmp;
    p2 += '\\(';

    // Add the separator and the decimals
    p1 += Config.currencySeparator;
    p2 += Config.currencySeparator;
    p1 += d1;
    p2 += d1;
    p1 += '_)';
    p2 += '\\)';

    // If currency is in the end, add it now (with possible space)
    if (end) {
      if (Config.currencyOptions[idx].space) {
        p1 += '\\ ';
        p2 += '\\ ';
      }
      p1 += Config.currencyOptions[idx].value;
      p2 += Config.currencyOptions[idx].value;
      p1 += '_ ';
      p2 += '_ ';
    }

    // End parts 1 and 2
    p1 += ';';
    p2 += ';';

    // Create part 3
    if (end) {
      p3 = '_ ';
    } else {
      p3 = '_(';
      p3 += Config.currencyOptions[idx].value;
      if (Config.currencyOptions[idx].space) {
        p3 += '\\ ';
      }
    }
    p3 += '* \"-\"';
    p3 += d2;
    p3 += '_)';

    if (end) {
      if (Config.currencyOptions[idx].space) {
        p3 += '\\ ';
      }
      p3 += Config.currencyOptions[idx].value;
    }
    p3 += ';';

    code = p1 + p2 + p3 + p4;
    _publishCode(code);
  };

  var _openItems = function(items) {
    _formatArea.childNodes[0].style.display =
        (items & _kGeneral) ? 'block' : 'none';
    _formatArea.childNodes[1].style.display =
        (items & _kDecimal) ? 'block' : 'none';
    _formatArea.childNodes[2].style.display =
        (items & _kThousand) ? 'block' : 'none';
    _formatArea.childNodes[3].style.display =
        (items & _kSymbol) ? 'block' : 'none';
    _formatArea.childNodes[4].style.display =
        (items & _kNegative) ? 'block' : 'none';
    _formatArea.childNodes[5].style.display =
        (items & _kNegative) ? 'block' : 'none';
    _formatArea.childNodes[6].style.display =
        (items & _kNegative) ? 'block' : 'none';
    _formatArea.childNodes[7].style.display =
        (items & _kDate) ? 'block' : 'none';
  };

  // If 'event' is defined in the following methods, it means we have clicked
  // them and we need to apply the style immediately
  var _handleOpenGeneral = function(event) {
    _formatSubmitMethod = _handleSubmitGeneral;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kGen].classList.add(_classSelected);
    _openItems(_kGeneral);
    _formatSubmitMethod = _handleSubmitGeneral;
  };

  var _handleOpenNumber = function(event) {
    _formatSubmitMethod = _handleSubmitNumber;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kNum].classList.add(_classSelected);
    _openItems(_kDecimal + _kThousand + _kNegative);
  };

  var _handleOpenCurrency = function(event) {
    _formatSubmitMethod = _handleSubmitCurrency;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kCur].classList.add(_classSelected);
    _openItems(_kDecimal + _kSymbol + _kNegative);
  };

  var _handleOpenAccounting = function(event) {
    _formatSubmitMethod = _handleSubmitAccounting;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kAcc].classList.add(_classSelected);
    _openItems(_kDecimal + _kSymbol);
  };

  var _handleOpenDate = function(event) {
    _formatSubmitMethod = _handleSubmitDate;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kDat].classList.add(_classSelected);
    _openItems(_kDate);
  };

  var _handleOpenPercentage = function(event) {
    _formatSubmitMethod = _handleSubmitPercentage;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kPer].classList.add(_classSelected);
    _openItems(_kDecimal);
  };

  var _handleOpenScientific = function(event) {
    _formatSubmitMethod = _handleSubmitScientific;
    if (event) {
      _formatSubmitMethod();
    }
    _closeAll();
    _tabs.childNodes[_kSci].classList.add(_classSelected);
    _openItems(_kDecimal);
  };

  var _closeAll = function() {
    var i, j = _tabs.childNodes.length;
    for (i = 0; i < j; i++) {
      _tabs.childNodes[i].classList.remove(_classSelected);
    }
  };

  var _handleSubmitFormat = function() {
    if (_formatSubmitMethod) {
      _formatSubmitMethod();
    }
  };

  // Initializing
  var _initializeOptions = function() {
    var i, opt, opt2, p;

    // Initialize decimal drop down
    for (i = 0; i <= Config.decimalMaxValue; i++) {
      opt = document.createElement('option');
      opt.textContent = i;
      opt.value = i;
      _valueDecimal.appendChild(opt);
    }

    // Initialize date options
    for (i = 0; i < Config.dateOptions.length; i++) {
      if (Config.dateOptions[i].show) {
        opt = document.createElement('option');
        opt.textContent = Config.dateOptions[i].text;
        opt.value = Config.dateOptions[i].value;
        _valueDate.appendChild(opt);
      }
    }

    // Initialize currency options
    for (i = 0; i < Config.currencyOptions.length; i++) {
      opt = document.createElement('option');
      opt.textContent = Config.currencyOptions[i].text;
      opt.value = Config.currencyOptions[i].value;
      _valueSymbol.appendChild(opt);
    }

    // Initialize general radio buttons
    for (i = 0; i < Config.generalOptions.length; i++) {
      p = document.createElement('p');
      opt = document.createElement('input');
      opt.value = Config.generalOptions[i].value;
      opt.type = 'radio';
      opt.name = 'general';
      opt.className = Config.kClassName.leftItem;
      opt2 = document.createElement('div');
      opt2.textContent = I18n.getMessage(Config.generalOptions[i].text);
      opt2.className = Config.kClassName.rightItem;
      _valueGeneral.appendChild(opt);
      _valueGeneral.appendChild(opt2);
      _valueGeneral.appendChild(p);
      DomListener.add(_domListenerId, opt, 'click', _handleSubmitGeneral);
    }
  };

  var _initalizeHandlers = function() {
    DomListener.add(_domListenerId, _titleClose, 'click', _handleClickOnX);
    DomListener.add(_domListenerId, _tabs.childNodes[_kGen],
        'click', _handleOpenGeneral);
    DomListener.add(_domListenerId, _tabs.childNodes[_kNum],
        'click', _handleOpenNumber);
    DomListener.add(_domListenerId, _tabs.childNodes[_kCur],
        'click', _handleOpenCurrency);
    DomListener.add(_domListenerId, _tabs.childNodes[_kAcc],
        'click', _handleOpenAccounting);
    DomListener.add(_domListenerId, _tabs.childNodes[_kDat],
        'click', _handleOpenDate);
    DomListener.add(_domListenerId, _tabs.childNodes[_kPer],
        'click', _handleOpenPercentage);
    DomListener.add(_domListenerId, _tabs.childNodes[_kSci],
        'click', _handleOpenScientific);

    DomListener.add(_domListenerId, _valueDecimal, 'change',
        _handleSubmitFormat);
    DomListener.add(_domListenerId, _valueThousand, 'change',
        _handleSubmitFormat);
    DomListener.add(_domListenerId, _valueSymbol, 'change',
        _handleSubmitFormat);
    DomListener.add(_domListenerId, _valueDate, 'change',
        _handleSubmitFormat);
    DomListener.add(_domListenerId, _valueNegativeRed,
        'change', _handleSubmitFormat);
    DomListener.add(_domListenerId, _valueNegative123,
        'change', _handleSubmitFormat);
  };

  return _api;

});

