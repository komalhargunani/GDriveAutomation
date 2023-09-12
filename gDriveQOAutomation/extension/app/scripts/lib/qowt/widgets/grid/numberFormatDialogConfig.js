// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Configuration file for number format dialog
 * This file includes the class names, IDs, loc names and choices 
 * of different controls in the number format dialog.
 *
 * @author mikkor@google.com (Mikko Rintala)
 * @constructor     Constructor for the Number Format Dialog config object
 * @return {object} A number format dialog config object
 */

define([
], function() {

  'use strict';

  return {
    
    // class, id and loc names
    kClassName: {
      dialog: 'qowt-number-format-dialog',
      title: 'qowt-number-format-title',
      titleLeft: 'qowt-number-format-title-left',
      titleRight: 'qowt-number-format-title-right',
      tabs: 'qowt-number-format-tabs',
      tab: 'qowt-number-format-tab',
      area: 'qowt-number-format-area',
      item: 'qowt-number-format-area-item',
      leftItem: 'qowt-number-format-area-item-left',
      rightItem: 'qowt-number-format-area-item-right',
      red: ' qowt-number-format-negative-color '
    },
    
    kIdName: {
      dialogContainer: 'qowt-number-format-dialog-container',
      titleClose: 'qowt-number-format-title-close',
      tabs: 'qowt-number-format-tabs',
      area: 'qowt-number-format-area',
      valueGeneral: 'qowt-number-format-general',
      valueDecimal: 'qowt-number-format-decimal',
      valueThousand: 'qowt-number-format-thousand',
      valueSymbol: 'qowt-number-format-symbol',
      valueNegativeRed: 'qowt-number-format-negative-red',
      valueNegative123: 'qowt-number-format-negative-123',
      valueDate: 'qowt-number-format-date'
    },
    
    kLocName: {
      title: "number_format_title",
      tabGeneral: "number_format_tab_general",
      tabNumber: "number_format_tab_number",
      tabCurrency: "number_format_tab_currency",
      tabAccounting: "number_format_tab_accounting",
      tabDate: "number_format_tab_date_time",
      tabPercentage: "number_format_tab_percentage",
      tabScientific: "number_format_tab_scientific",
      labelGeneral: "number_format_label_general",
      labelText: "number_format_label_text",
      labelOther: "number_format_label_other",
      labelDecimal: "number_format_label_decimal_places",
      labelThousand: "number_format_label_use_1000_separator",
      labelNegative: "number_format_label_negative_numbers",
      labelNegativeRed: "number_format_label_red",
      labelCurrency: "number_format_label_currency_symbol",
      labelDate: "number_format_label_date_type"
    },

    // options in the dialog
    dateOptions:  [
      /*
       * We have two sets of dates and times
       * The first set is shown on the dialog by default
       * The items in the 2nd set are added into the dialog
       * when they are found in the sheet (when user selects
       * different cells in the sheet)
       * This is to minimize the items in the UI but still to have
       * support for many options.
       * 
       * Options:
       * 'text' is what is shown in the dialog
       * 'value' is what is used in the formatting code
       * 'show' if it's true, the item is shown by default
       */
      
      // Shown by default
      {text: "3/14/2001", value: "m/d/yyyy;@", show: true},
      {text: "14/3/2001", value: "d/m/yyyy;@", show: true},
      {text: "2001-03-14", value: "yyyy\\-mm\\-dd;@", show: true},
      {text: "03-14-01", value: "mm\\-dd\\-yy;@", show: true},
      {text: "3/14/2001 0:00:00", value: "[$-409]m/d/yyyy\\ h:mm:ss;@", 
       show: true},
      {text: "13:30:55", value: "h:mm:ss;@", show: true},
      {text: "1:30 PM", value: "[$-409]h:mm\\ AM/PM;@", show: true},
      // Added into the dialog when needed
      {text: "*3/14/01", value: "1"},
      {text: "*Wednesday, March 14, 01", 
       value: "[$-F800]dddd\\,\\ mmmm\\ dd\\,\\ yyyy"},
      {text: "3/14", value: "m/d;@"},
      {text: "3/14/01", value: "m/d/yy;@"},
      {text: "03/14/01", value: "mm/dd/yy;@"},
      {text: "14-Mar", value: "[$-409]d\\-mmm;@"},
      {text: "14-Mar-01", value: "[$-409]d\\-mmm\\-yy;@"},
      {text: "14-Mar-01", value: "[$-409]dd\\-mmm\\-yy;@"},
      {text: "Mar-01", value: "[$-409]mmm\\-yy;@"},
      {text: "March-01", value: "[$-409]mmmm\\-yy;@"},
      {text: "March 14, 2001", value: "[$-409]mmmm\\ d\\,\\ yyyy;@"},
      {text: "M", value: "[$-409]mmmmm;@"},
      {text: "M-01", value: "[$-409]mmmmm\\-yy;@"},
      {text: "14-Mar-2001", value: "[$-409]d\\-mmm\\-yyyy;@"},
      {text: "*1:30:55 PM", value: "[$-F400]h:mm:ss\\ AM/PM"},
      {text: "13:30", value: "h:mm;@"},
      {text: "1:30 PM", value: "[$-409]h:mm\\ AM/PM;@"},
      {text: "1:30:55 PM", value: "[$-409]h:mm:ss\\ AM/PM;@"},
      {text: "30:55.2", value: "mm:ss.0;@"},
      {text: "37:30:55", value: "[h]:mm:ss;@"},
      {text: "3/14/01 1:30 PM", value: "[$-409]m/d/yy\\ h:mm\\ AM/PM;@"},
      {text: "3/14/01 13:30", value: "m/d/yy\\ h:mm;@"}
    ],

    /*
     * Currencies
     * There are 6 different currencies in the dialog by default.
     * Different currencies can have different locales
     * The currencies in the dialog all have one locale defined.
     * If a cell is using one of the 6 default currencies but with 
     * different locale,
     * then the cell number format is mapped into the same currency in 
     * the dialog
     * (but it will use different locale if the user changes the formatting)
     * If another currency (ie. not listed in the dialog) is detected, 
     * it's added into the dialog.
    
     * Options:
     * 'text' is what is shown in the dialog
     * 'value' is what is used in the formatting code
     * 'space' if true, a space is added between the currency symbol and 
     * the digit
     * 'end' if true, the currency symbol is shown after the digit part.
     */
    currencyOptions: [
      {text: "$", value: "\"$\""},
      {text: "\u20AC", value: "[$\u20AC-1]", space: true, end: true}, // Euro
      {text: "\u00A3", value: "[$\u00a3-809]"}, // Pound
      {text: "\u00A5", value: "[$\u00a5-411]"}, // Yen
      {text: "\u20A9", value: "[$\u20A9-412]"}, // Won
      {text: "CHF", value: "[$CHF-807]", space: true} // Swiss Franc
    ],

    /*
     * Generic options
     * There are two different generic options 'General' and 'Text' 
     * (as used in Excel).
     * If the current cell has a formatting that we clearly don't use
     * (for example fraction or a date/time format which is not supported 
     * by the dialog),
     * then we add another option called 'Other'.
     * This shows the user that the format is not mapped into the dialog
     * That is important for example if user has a non-supported formatting,
     * but he changes it into a supported one, then he can still change it 
     * back to the original one.
     * 
     * Options:
     * 'text' is what is shown in the dialog
     * 'value' is what is used in the formatting code
     * 'idx' is the index of the radio button node of the item (each line 
     *  consists of 3 HTML nodes)
      */
    generalOptions: [
      {text: "number_format_tab_general", value: "General", idx: 0},
      {text: "number_format_label_text", value: "@", idx: 3},
      {text: "number_format_label_other", value: "", idx: 6}
    ],
    
    // Max value in the decimal drop down
    decimalMaxValue: 30,
    
    // Currency formats always use this string as a thousand separator
    currencySeparator: "#,##"
  };
});
