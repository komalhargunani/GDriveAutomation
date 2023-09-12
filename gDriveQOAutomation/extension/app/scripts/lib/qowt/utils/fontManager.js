// Copyright 2012 Google Inc. All Rights Reserved.
/**
 * @fileoverview font manager; ensures font names are matches to
 * sensible font families (eg fallbacks), and keeps the model up
 * to date with the font names such that other elements in the system
 * (eg font dropdown buttons) can update correctly
 *
 * @author jelte@google.com (Jelte Liebrand)
 */



define([
    'qowtRoot/models/model',
    'qowtRoot/utils/stringUtils',
    'qowtRoot/utils/arrayUtils',
    'qowtRoot/utils/cssManager'
  ], function (
    ViewModel,
    StringUtils,
    ArrayUtils,
    CssManager
  ) {

  'use strict';

  var _api = {

    /**
     * reset the list of fonts known to the manager; used mainly by unit tests
     */
    reset: function () {
      _resetFonts();
    },

    /**
     * given a list of font names, will set dynamic css rules for
     * listing the font-family for each name (if known). It will also
     * store a map of all font names to css classNames for retrieval later
     *
     * @param {array} fontNames array of all font names as strings
     */
    initFonts: function (fontNames) {
      _resetFonts();

      // remove any duplicate names
      fontNames = ArrayUtils.unique(fontNames);

      // get font families for all font names
      fontNames.forEach(function (fontName) {
        _initFont(fontName);
      });

      CssManager.flushCache();
    },

    /**
     * return the family for a given font name
     *
     * @param {string} fontName the font to use for family lookup
     * @return {string} the family string
     */
    family: function (fontName) {
      return(fontName !== undefined) ? _family(fontName) : undefined;
    },


    /**
     * retrieve the font name for a given element or font className
     *
     * @param {HTML Element|string} src either an html element to check
     *                                  or a string containing className
     *                                  which contains a font css className
     * @return {string} returns the font name if set (undefined otherwise)
     */
    getFontName: function (src) {
      var fontName;
      if(src) {
        var fontClass = _currentFontClass(src);
        fontName = _classNameToFontName(fontClass);
      }
      return fontName;
    },

    /**
     * Query if a given fontface is a symbol font or not.
     * Encapsulates knowledge of symbol fonts within the font manager module.
     *
     * @param {String} fontName The fontName to check.
     * @preturnd {Boolean} True if fontName is a symbol font otherwise False.
     */
    isSymbolFont: function(fontName) {
      var symbol;
      switch (fontName) {
        case 'Symbol':
        case 'Webdings':
        case 'Wingdings':
        case 'Wingdings 2':
        case 'Wingdings 3':
          symbol = true;
          break;
        default:
          symbol = false;
      }
      return symbol;
    },

    /**
     * remove any font related css className an element MIGHT have
     *
     * @param {HTML Element} elm the element to strip of font class
     */
    removeFontClassName: function (elm) {
      _removeFontClass(elm);
    },

    /**
     * set the font on a given element. Replaces any fonts previous set
     * and will append the font to the dynamic css rules if it's new
     *
     * @param {HTML Element} elm element to which to apply the font to
     * @param {string} fontFace name of the font to set
     */
    setFontClassName: function (elm, fontFace) {
      var font = _faceToFont(fontFace);

      _removeFontClass(elm);
      _setFontClass(elm, font);
    },

    /**
     * Certain characters used by Microsoft seem to be custom code points in
     * unicode, one example being the default bullet character which is
     * represented in MSWord as:
     *  PRIVATE USE AREA-F0B7 Unicode: U+F0B7, UTF-8: EF 82 B7
     * This character is not present on Mac or Linux so we need to replace it
     * with a more suitable character.
     * This function will check each character in a string and replace any
     * that match the glyph map.
     * @param str {String} The character string to correct
     * @return {String} Corrected string
     */
    replaceProblemGlyphs: function replaceProblemGlyphs(str) {
      var corrected = "";
      if(str && str.length) {
        var si, st = str.length;
        for(si = 0; si < st; si++) {
          var chr = _charToHex(str[si]);
          if(_GLYPH_MAP.hasOwnProperty(chr)) {
            corrected += _GLYPH_MAP[chr];
          } else {
            corrected += str[si];
          }
        }
      }
      return corrected;
    }

  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  /**
   * Converts a single character in a string to its hex value
   * @param chr {String} Character string to convert
   * @return {String} Converted Character
   */

  function _charToHex(chr) {
    var hex;
    if(chr && chr.length) {
      hex = chr.charCodeAt(0).toString(16);
    }
    return hex;
  }

  var _GLYPH_MAP = {
    "f0a7": "\u25aa",
    "f0b7": "\u25cf",
    "f0d8": "\u27a2"
  };

  var _fonts = [],
    _SELECTOR = '.qowt-root ',
    _FAMILIES = {
      'Agency FB': '"Agency FB", sans-serif',
      'Aharoni': 'Aharoni',
      'Andalus': 'Andalus, serif',
      'Algerian': 'Algerian, serif',
      'Angsana New': 'Angsana New',
      'AngsanaUPC': 'AngsanaUPC',
      'Aparajita': 'Aparajita',
      'Arial': 'Arial, "Arial Unicode MS", Arimo, "Microsoft Sans serif",' +
          ' sans-serif',
      'Arial Bold': '"Arial Bold", Arial, "Arial Unicode MS", Arimo,' +
          ' "Microsoft Sans serif", sans-serif',
      'Arial Italic': '"Arial Italic", Arial, "Arial Unicode MS", Arimo,' +
          ' "Microsoft Sans serif", sans-serif',
      'Arial Narrow': '"Arial Narrow", sans-serif',
      'Arial Unicode MS': '"Arial Unicode MS", Arial, Arimo, sans-serif',
      'Arial Rounded MT': '"Arial Rounded MT", Arial, "Arial Unicode MS",' +
          ' Arimo, "Microsoft Sans serif", sans-serif',
      'Arabic Typesetting': 'Arabic Typesetting',
      'Baskerville Old Face': '"Baskerville Old Face", Baskerville, ' +
          '"Times New Roman", Tinos, "Bell MT", serif',
      'Batang': 'Batang, serif',
      'BatangChe': 'BatangChe',
      'Bauhaus 93': '"Bauhaus 93", sans-serif',
      'Bell MT': '"Bell MT", "Times New Roman", Tinos, ' +
          '"Baskerville Old Face", Baskerville, serif',
      'Bernard MT Condensed': '"Bernard MT Condensed", serif',
      'Blackadder ITC': '"Blackadder ITC" , cursive',
      'Book Antiqua': 'Book Antiqua, Palatino Linotype, serif',
      'Bodoni MT Black': '"Bodoni MT Black", serif',
      'Bodoni MT Condensed': '"Bodoni MT Condensed", serif',
      'Bodoni MT Poster Compressed': '"Bodoni MT Poster Compressed", serif',
      'Bodoni MT': '"Bodoni MT", serif',
      'Bookman Old Style': '"Bookman Old Style", serif',
      'Bradley Hand ITC': '"Bradley Hand ITC", cursive',
      'Browallia New': 'Browallia New',
      'BrowalliaUPC': 'BrowalliaUPC',
      'Britannic Bold': '"Britannic Bold", sans-serif',
      'Berlin Sans FB': '"Berlin Sans FB", Calibri, sans-serif',
      'Broadway': 'Broadway, "Bodoni MT Black", serif',
      'Brush Script MT': '"Brush Script MT", "Brush Script", cursive',
      'Bookshelf Symbol 7': 'Bookshelf Symbol 7',
      'Brush Script': '"Brush Script", "Brush Script MT", cursive',
      'Calibri': 'Calibri, Carlito, sans-serif',
      'Californian FB': '"Californian FB", serif',
      'Calisto MT': '"Calisto MT", serif',
      'Cambria': 'Cambria, "Times New Roman", Tinos, serif',
      'Cambria Math': 'Cambria Math, "Times New Roman", Tinos, serif',
      'Candara': 'Candara, Calibri, sans-serif',
      'Castellar': 'Castellar, Monospace',
      'Century Schoolbook': '"Century Schoolbook", Century, ' +
          '"Bookman Old Style", serif',
      'Centaur': 'Centaur, serif',
      'Century': 'Century, "Century Schoolbook", "Bookman Old Style", serif',
      'Century Gothic': '"Century Gothic", "Lucida Sans", "Malgun Gothic", ' +
          'sans-serif',
      'Chiller': 'Chiller, cursive',
      'Colonna MT': '"Colonna MT", serif',
      'Comic Sans MS': '"Comic Sans MS", cursive',
      'Consolas': 'Consolas, monospace',
      'Constantia': 'Constantia, "Baskerville Old Face", "Bell MT", serif',
      'Cooper Black': 'Cooper Black, serif',
      'Copperplate Gothic Bold': '"Copperplate Gothic Bold", serif',
      'Copperplate Gothic Light': '"Copperplate Gothic Light", serif',
      'Corbel': 'Corbel, sans-serif',
      'Cordia New': 'Cordia New',
      'CordiaUPC': 'CordiaUPC',
      'Courier': 'Courier, monospace',
      'Courier New': '"Courier New", Cousine, monospace',
      'Curlz MT': '"Curlz MT", cursive',
      'DaunPenh': 'DaunPenh',
      'David': 'David, "Times New Roman", Tinos, serif',
      'DFKai-SB': 'DFKai-SB',
      'DilleniaUPC': 'DilleniaUPC',
      'DokChampa': 'DokChampa',
      'Dotum': 'Dotum, Arial, Arimo, sans-serif',
      'DotumChe': 'DotumChe, Arial, Arimo, sans-serif',
      'Ebrima': 'Ebrima',
      'Edwardian Script ITC': '"Edwardian Script ITC", cursive',
      'Elephant': 'Elephant, serif',
      'Engravers': 'Engravers, monospace',
      'Engravers MT': 'Engravers MT',
      'Eras Bold ITC': '"Eras Bold ITC", "Arial Black", ' +
          '"MS Reference Sans serif", Verdana, sans-serif',
      'Eras Demi ITC': '"Eras Demi ITC", "Segoe UI", sans-serif',
      'Eras Light ITC': '"Eras Light ITC", "Segoe UI Light", sans-serif',
      'Eras Medium ITC': '"Eras Medium ITC", "Segoe UI", sans-serif',
      'Estrangelo Edessa': 'Estrangelo Edessa',
      'EucrosiaUPC': 'EucrosiaUPC',
      'Euphemia': 'Euphemia',
      'FangSong': 'FangSong',
      'Felix Titling': '"Felix Titling", "Perpetua Titling MT", serif',
      'Forte': 'Forte, cursive',
      'Franklin Gothic Book': '"Franklin Gothic Book", Calibri, sans-serif',
      'FrankRuehl': 'FrankRuehl',
      'FreesiaUPC': 'FreesiaUPC',
      'Freestyle Script': '"Freestyle Script", cursive',
      'French Script MT': '"French Script MT", cursive',
      'Footlight MT Light': '"Footlight MT Light", serif',
      'Gabriola': 'Gabriola',
      'Garamond': 'Garamond, "Palantino Linotype", serif',
      'Gautami': 'Gautami',
      'Georgia': 'Georgia, "Book Antiqua", serif',
      'Gigi': 'Gigi, cursive',
      'Gill Sans MT': '"Gill Sans MT", Calibri, sans-serif',
      'Gill Sans MT Ext Condensed Bold': '"Gill Sans MT Ext Condensed Bold",' +
          ' serif',
      'Gisha': 'Gisha',
      'Gloucester MT Extra Condensed': '"Gloucester MT Extra Condensed", serif',
      'Goudy Old Style': '"Goudy Old Style", "Baskerville Old Face", ' +
          '"Book Antiqua", serif',
      'Goudy Stout': '"Goudy Stout", serif',
      'Gulim': 'Gulim',
      'GulimChe': 'GulimChe',
      'Gungsuh': 'Gungsuh',
      'GungsuhChe': 'GungsuhChe',
      'Harlow Solid Italic': '"Harlow Solid Italic", cursive',
      'Harrington': 'Harrington, cursive',
      'Haettenschweiler': 'Haettenschweiler, sans-serif',
      'High Tower Text': '"High Tower Text", "Bell MT", Georgia, ' +
          '"Times new Roman", serif',
      'Impact': 'Impact, sans-serif',
      'Imprint MT Shadow': '"Imprint MT Shadow", "Colonna MT", "Bodoni MT",' +
          ' "Book Antiqua", Cambria, Constantia, Georgia, serif',
      'Informal Roman': 'Informal Roman',
      'IrisUPC': 'IrisUPC',
      'Iskoola Pota': 'Iskoola Pota',
      'JasmineUPC': 'JasmineUPC',
      'Jokerman': 'Jokerman, cursive',
      'Juice ITC': '"Juice ITC", cursive',
      'KaiTi': 'KaiTi',
      'Kalinga': 'Kalinga',
      'Kartika': 'Kartika',
      'Khmer UI': 'Khmer UI',
      'KodchiangUPC': 'KodchiangUPC',
      'Kokila': 'Kokila',
      'Kristen ITC': '"Kristen ITC" , cursive',
      'Kunstler Script': '"Kunstler Script", cursive',
      'Lao UI': 'Lao UI',
      'Latha': 'Latha',
      'Leelawadee': 'Leelawadee',
      'Levenim MT': 'Levenim MT',
      'LilyUPC': 'LilyUPC',
      'Lucida Bright': '"Lucida Bright", Batang, "Book Antiqua", ' +
          '"Bookman old Style", serif',
      'Lucida Console': '"Lucida Console", monospace',
      'Lucida Handwriting Italic': '"Lucida Handwriting Italic", cursive',
      'Lucida Sans': '"Lucida Sans", Arial, "Arial Unicode MS", Arimo, ' +
          'sans-serif',
      'Magneto': 'Magneto, cursive',
      'Maiandra GD': '"Maiandra GD", sans-serif',
      'Mangal': 'Mangal',
      'Malgun Gothic': '"Malgun Gothic", "Segoe UI", sans-serif',
      'Marlett': 'Marlett',
      'Matura MT Script Capitals': '"Matura MT Script Capitals", cursive',
      'Meiryo': 'Meiryo, "Meiryo UI", "Lucida Sans", sans-serif',
      'Meiryo UI': '"Meiryo UI", Meiryo, "Lucida Sans", sans-serif',
      'Microsoft Himalaya': 'Microsoft Himalaya',
      'Microsoft JhengHei': 'Microsoft JhengHei',
      'Microsoft New Tai Lue': 'Microsoft New Tai Lue',
      'Microsoft PhagsPa': 'Microsoft PhagsPa',
      'Microsoft Tai Le': 'Microsoft Tai Le',
      'Microsoft Uighur': 'Microsoft Uighur',
      'Microsoft YaHei': '"Microsoft YaHei", "Microsoft sans-serif", ' +
          'sans-serif',
      'Microsoft Yi Baiti': 'Microsoft Yi Baiti',
      'MingLiU': 'MingLiU',
      'MingLiU_HKSCS': 'MingLiU_HKSCS',
      'MingLiU_HKSCS-ExtB': 'MingLiU_HKSCS-ExtB',
      'MingLiU-ExtB': 'MingLiU-ExtB',
      'Miriam': 'Miriam',
      'Miriam Fixed': '"Miriam Fixed", monospace',
      'Mistral': 'Mistral, cursive',
      'Modern No. 20': '"Modern No. 20", "Times New Roman", Tinos, serif',
      'Mongolian Baiti': 'Mongolian Baiti',
      'Monotype Corsiva': '"Monotype Corsiva", cursive',
      'MoolBoran': 'MoolBoran',
      'MS Gothic': 'MS Gothic',
      'MS Mincho': '"MS Mincho", monospace',
      'MS Outlook': 'MS Outlook',
      'MS PGothic': 'MS PGothic',
      'MS PMincho': 'MS PMincho',
      'MS Reference Sans serif': '"MS Reference Sans serif", Verdana, ' +
          'sans-serif',
      'MS UI Gothic': 'MS UI Gothic',
      'MT Extra': 'MT Extra',
      'MV Boli': 'MV Boli',
      'Narkisim': 'Narkisim',
      'Niagara Engraved': '"Niagara Engraved", "Niagara Solid"',
      'Niagara Solid': '"Niagara Solid", "Niagara Engraved"',
      'NSimSun': 'NSimSun',
      'Nyala': 'Nyala, serif',
      'OCR A Extended': '"OCR A Extended", serif',
      'Old English Text MT': '"Old English Text MT", cursive',
      'Onyx': 'Onyx',
      'Palace Script MT': '"Palace Script MT", cursive',
      'Palatino Linotype': '"Palatino Linotype", "Book Antiqua", serif',
      'Papyrus': 'Papyrus, cursive',
      'Parchment': 'Parchment, cursive',
      'Perpetua Titling MT': '"Perpetua Titling MT", "Felix Titling", serif',
      'Perpetua': 'Perpetua, serif',
      'Plantagenet Cherokee': 'Plantagenet Cherokee',
      'Playbill': 'Playbill, serif',
      'PMingLiU': 'PMingLiU',
      'PMingLiU-ExtB': 'PMingLiU-ExtB',
      'Poor Richard': '"Poor Richard", "Book Antiqua", Garamond, ' +
          '"Times New Roman", Tinos, serif',
      'Pristina': 'Pristina, cursive',
      'Rage Italic': '"Rage Italic", cursive',
      'Raavi': 'Raavi',
      'Ravie': 'Ravie, cursive',
      'Rod': 'Rod',
      'Rockwell Condensed': '"Rockwell Condensed", serif',
      'Rockwell': 'Rockwell, "Bodoni MT", BookAntiqua, "Times New Roman", ' +
          'Tinos, serif',
      'Sakkal Majalla': 'Sakkal Majalla',
      'Script MT Bold': '"Script MT Bold", cursive',
      'Segoe Print': 'Segoe Print',
      'Segoe Script': '"Segoe Script", cursive',
      'Segoe UI': '"Segoe UI", sans-serif',
      'Shonar Bangla': 'Shonar Bangla',
      'Showcard Gothic': '"Showcard Gothic", cursive',
      'Shruti': 'Shruti',
      'SimHei': 'SimHei',
      'Simplified Arabic': 'Simplified Arabic',
      'Simplified Arabic Fixed': 'Simplified Arabic Fixed',
      'SimSun': 'SimSun',
      'SimSun-ExtB': 'SimSun-ExtB',
      'Snap ITC': '"Snap ITC" , cursive',
      'Stencil': 'Stencil, "Copperplate Gothic Bold", serif',
      'Sylfaen': 'Sylfaen, "Baskerville Old Face", "Times New Roman", Tinos,' +
          ' serif',
      'Symbol': 'Symbol',
      'Tahoma': 'Tahoma, "Microsoft Sans serif", sans-serif',
      'Tempus Sans ITC': '"Tempus Sans ITC", cursive',
      'Times New Roman': '"Times New Roman", Tinos, "Baskerville Old Face",' +
          ' "Bell MT", serif',
      'Traditional Arabic': 'Traditional Arabic',
      'Trebuchet MS': '"Trebuchet MS", sans-serif',
      'Tunga': 'Tunga',
      'Tw Cen MT': '"Tw Cen MT", Calibri, sans-serif',
      'Univers': 'Univers, "Segoe UI", sans-serif',
      'Utsaah': 'Utsaah',
      'Vani': 'Vani',
      'Verdana': 'Verdana, sans-serif',
      'Vijaya': 'Vijaya',
      'Viner Hand ITC': '"Viner Hand ITC", cursive',
      'Vivaldi Italic': '"Vivaldi Italic", cursive',
      'Vladimir Script': '"Vladimir Script", cursive',
      'Vrinda': 'Vrinda',
      'Webdings': 'Webdings',
      'Wide Latin': '"Wide Latin", serif',
      'Wingdings': 'Wingdings',
      'Wingdings 2': '"Wingdings 2"',
      'Wingdings 3': '"Wingdings 3"'
    };


  function _resetFonts() {
    _fonts = [];
  }


  function _initFont(fontName) {
    // get the family or fallback to just the font name itself
    var fontObject = {
      fontName: fontName,
      family: _family(fontName),
      className: 'qowt-font' + (_fonts.length + 1)
    };

    var cssFriendly = StringUtils.cssFriendly(fontName);
    if(cssFriendly && cssFriendly.length > 0) {
      fontObject.className += '-' + cssFriendly;
    }

    _fonts.push(fontObject);

    _writeFont(fontObject);

    _updateModel();

    return fontObject;
  }


  function _family(fontName) {
    // return the font family or fallback to just the font name
    // if the font is unknown to us.
    return _FAMILIES[fontName] || StringUtils.doubleQuote(fontName);
  }


  function _removeFontClass(elm) {
    var currentFontClass = _currentFontClass(elm);
    if(currentFontClass) {
      elm.classList.remove(currentFontClass);
    }
  }


  /**
   * get the font className from either an HTML element or from
   * a className string
   *
   * @param {HTLM Element|string} src element or css className
   */

  function _currentFontClass(src) {
    var classString;
    if(typeof src === 'string') {
      classString = src;
    } else {
      // assume it's an HTML element
      classString = src.className;
    }

    var matches = classString.match(/\bqowt-font[^\s]*/);
    var className = matches ? matches[0] : undefined;
    return className;
  }


  function _setFontClass(elm, fontObject) {
    if (fontObject.className) {
      elm.classList.add(fontObject.className);
    }
  }


  function _faceToFont(fontName) {
    var fontObject;
    _fonts.forEach(function (font) {
      // case insensitive matching...
      if(font.fontName.toLowerCase() === fontName.toLowerCase()) {
        fontObject = font;
      }
    });

    if(!fontObject) {
      fontObject = _initFont(fontName);
    }

    return fontObject;
  }


  function _classNameToFontName(className) {
    var fontName;
    _fonts.forEach(function (font) {
      if(font.className === className) {
        fontName = font.fontName;
      }
    });

    return fontName;
  }


  function _writeFont(fontObject) {
    var selector = _SELECTOR + '.' + fontObject.className;
    CssManager.addRule(selector, 'font-family:' + fontObject.family +
        ' !important;', 100);
  }


  // NOTE: this will update the model on every init font...
  // this might result in poor performance, so we could debounce this
  // if needed... for now there is no noticable delay, so keep it syncronous


  function _updateModel() {
    var fontNames = _fonts.map(function (fontObject) {
      return fontObject.fontName;
    });
    ViewModel.set('fontList', 'names', fontNames);
  }

  return _api;
});
