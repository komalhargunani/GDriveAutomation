// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A module for generating new TextDecorator instances on demand.
 * The client can use individual formatting APIs or use the generic
 * decorate function by supplying it a textFormatting dcp object
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
    'qowtRoot/utils/typeUtils',
    'qowtRoot/utils/converters/converter',
    'qowtRoot/utils/fontManager',
    'qowtRoot/configs/common',
    'qowtRoot/models/env',
    'qowtRoot/errors/qowtError'
  ], function(
    TypeUtils,
    Converter,
    FontManager,
    CommonConfig,
    EnvModel,
    QOWTError) {

  'use strict';

  var _api = {

    /**
     * Get a render policy value.
     * @param policyName {string}
     * @return {*} The value of the render policy or undefined.
     */
    getPolicy: function getPolicy(policyName) {
      var policyValue;
      if (policyName && policyName.toString) {
        policyValue = _policies[policyName.toString()];
      }
      return policyValue;
    },

    /**
     * Set a render policy value.
     * @param policyName {string}
     * @param policyValue {*} The value of the render policy
     */
    setPolicy: function setPolicy(policyName, policyValue) {
      if (policyName && policyName.toString) {
        _policies[policyName.toString()] = policyValue;
      }
    },

    /**
     * Style our element with a supported font family.
     *
     * @param {HTML Element} elm The html element to decorate.
     * @param {string} fontFace The requested fontface.
     */
    setFontFace: function(elm, fontface) {
      FontManager.setFontClassName(elm, fontface);
    },

    /**
     * Query the effective resulting font face on the specified element.
     * @param {element} elm The element to query.
     * @returns {string|undefined} the 'naked' font face active on this element,
     *                  with all characters removed from the name.
     */
    getFontFace: function(elm) {
      var computedStyle = window.getComputedStyle(elm);
      return Converter.fontFamily2fontFace(computedStyle.fontFamily);
    },

    /**
     * Style our element with a specified font size (in points).
     * @param {HTML Element} elm The html element to decorate.
     * @param {string|number} size The requested font size in points.
     */
    setFontSize: function(elm, size) {
      // Convert to app specific font unit. Defaults to pt if app does not
      // specify a font unit.
      var unit = EnvModel.fontUnit || 'pt';
      switch (unit) {
        case 'pt':
          break;
        case 'em':
          size = Converter.pt2em(size);
          break;
        default:
          throw new QOWTError('Unsupported font unit conversion.');
      }

      elm.style.fontSize = parseFloat(size) + unit;
    },

    /**
     * Query the effective font size in points of the specified element.
     * @param {HTML Element} elm The html element to decorate
     * @returns {number|undefined} a floating point font size.
     */
    getFontSizePoints: function(elm) {
      var computedStyle = window.getComputedStyle(elm);
      return Converter.cssSize2pt(computedStyle.fontSize);
    },

    /*
     * Sets underline on or off, and underline style if given.
     * @param {node} elm The element to decorate.
     * @param {boolean} underline True to set underlie, False to remove it.
     * @param {string} style The underline style to apply if underline true.
     */
    setUnderline: function(elm, underline /* style */) {
      if (underline !== undefined) {
        if (underline) {
          _addDecoration(elm, 'underline');
        } else {
          _removeDecoration(elm, 'underline');
        }
      }
    },

    /**
     * Query the resulting underline of an element either inherited or explicit.
     * @return True if underlined, False if not.
     */
    hasUnderline: function(elm) {
      // textDecoration is not inherited and defaults to 'none'.
      // So even if underline is set on a parent then we will not see it as
      // set here. Whatever value is set on this node will win through.
      var cssString = window.getComputedStyle(elm).textDecoration;
      return (_hasDecoration(cssString, 'underline') ?
          true :
          false);
    },

    /**
     * Query the resulting underline of an element either inherited or explicit.
     * @return True if underlined, False if not.
     */
    hasStrikethrough: function(elm) {
      // textDecoration is not inherited and defaults to 'none'.
      // So even if underline is set on a parent then we will not see it as
      // set here. Whatever value is set on this node will win through.
      var cssString = window.getComputedStyle(elm).textDecoration;
      return (_hasDecoration(cssString, 'line-through') ?
          true :
          false);
    },

    setOverline: function(elm, overline) {
      if (overline) {
        elm.style.textDecoration += ' overline';
      }
    },

    setBlink: function(elm, blink) {
      // JELTE TODO: this conflicts with other text decorations??
      if (blink) {
        elm.style.textDecoration += ' blink';
      }
    },

    // support only on/off no styles
    setStrikethrough: function(elm, strikethrough) {
      if (strikethrough !== undefined) {
        if (strikethrough) {
          _addDecoration(elm, 'line-through');
        } else {
          _removeDecoration(elm, 'line-through');
        }
      }
    },

    setFontColor: function(elm, color) {
      if (color === 'auto') {
        elm.style.color = '#000';
      } else {
        elm.style.color = color;
      }
    },

    getFontColor: function(elm) {
      var cssString = window.getComputedStyle(elm);
//      return Converter.colorString2hex(colorPrimitive);
      return cssString.color;
    },

    setFontHighlight: function(elm, color) {
      elm.style.backgroundColor = color;
    },

    getFontHighlight: function(elm) {
      var cssString = window.getComputedStyle(elm);
//      return Converter.colorString2hex(colorPrimitive);
      return cssString.backgroundColor;
    },

    /*
     * Sets italics on or off
     *
     * @param {node} elm The element to decorate.
     * @param {boolean} italics True to set italics on, false to set it off.
     *
     * @method setItalics(elm, italics)
     */
    setItalics: function(elm, italics) {
      if (italics !== undefined) {
        if (italics) {
          _api.setFontStyle(elm, 'italic');
        }
        else {
          _api.setFontStyle(elm, 'normal');
        }
      }
    },

    setFontStyle: function(elm, style) {
      elm.style.fontStyle = style;
    },

    /**
     * Query the font style of an element, either inherited or explicit.
     * @return True if italic or oblique, otherwise False.
     */
    hasItalic: function(elm) {
      var fontStyle = window.getComputedStyle(elm)['font-style'];
      return (fontStyle === 'italic' || fontStyle === 'oblique');
    },

    /*
     * Sets bold on or off
     *
     * @param {node} elm The element to decorate.
     * @param {boolean} boldness True to set bold on, false to set it off.
     *
     * @method setBold(elm, boldness)
     */
    setBold: function(elm, boldness) {
      if (boldness !== undefined) {
        if (boldness) {
          _api.setFontWeight(elm, 'bold');
        }
        else {
          _api.setFontWeight(elm, 'normal');
        }
      }
    },

    setFontWeight: function(elm, weight) {
      elm.style.fontWeight = weight;
    },

    /**
     * Query the font weight of an element, either inherited or explicit.
     * @return {boolean} True if anything other than 'normal' or '400',
     * false otherwise. (As per CSS standards, font-weight Property 'bold'
     * or '700' represent bold text and 'normal' or '400' represent normal text)
     */
    hasFontWeight: function(elm) {
      var fontWeight = window.getComputedStyle(elm)['font-weight'];
      return (fontWeight !== '400' && fontWeight !== 'normal' &&
          fontWeight !== '');
    },

    setHidden: function(elm, hidden) {
      if (hidden) {
        elm.style.display = 'none';
      } else {
        elm.style.display = 'inline-block';
      }
    },

    setSubScript: function(elm, normalFontSize) {
      var subs = parseFloat(normalFontSize);
      elm.style.fontSize = subs + 'pt';
      elm.style.zoom = _api.getPolicy('sub_or_super_script_font_ratio');
      elm.style.verticalAlign = _api.getPolicy('subscript_vertical_align');
      elm.style.lineHeight = _api.getPolicy('sub_or_super_script_line_height');
    },

    setSuperScript: function(elm, normalFontSize) {
      var sups = parseFloat(normalFontSize);
      elm.style.fontSize = sups + 'pt';
      elm.style.zoom = _api.getPolicy('sub_or_super_script_font_ratio');
      elm.style.verticalAlign = _api.getPolicy('superscript_vertical_align');
      elm.style.lineHeight = _api.getPolicy('sub_or_super_script_line_height');
    },

    setAllCaps: function(elm, allCaps) {
      if (allCaps) {
        elm.style.textTransform = 'uppercase';
      } else {
        elm.style.textTransform = 'none';
      }
    },

    setSmallCaps: function(elm, smallCaps) {
      if (smallCaps) {
        elm.style.fontVariant = 'small-caps';
      } else {
        elm.style.fontVariant = 'normal';
      }
    },

    setShadow: function(elm, shadow) {
      if (shadow) {
        elm.style.textShadow = CommonConfig.TEXT_STYLE.shadowText.setValue;
      }
    },

    setOutline: function(elm, outline) {
      if (outline) {
        elm.style.webkitTextFillColor =
          CommonConfig.TEXT_STYLE.outlineText.webkitTextFillColor;
        elm.style.webkitTextStroke =
          CommonConfig.TEXT_STYLE.outlineText.webkitTextStroke;
      }
    },

    setEmboss: function(elm, emboss) {
      if (emboss) {
        elm.style.color = CommonConfig.TEXT_STYLE.embossedText.setColor;
        elm.style.textShadow = CommonConfig.TEXT_STYLE.embossedText.setShadow;
      }
    },

    setEngrave: function(elm, engrave) {
      if (engrave) {
        elm.style.color = CommonConfig.TEXT_STYLE.engravedText.setColor;
        elm.style.textShadow = CommonConfig.TEXT_STYLE.engravedText.setShadow;
      }
    },

    /**
     * Adorn the element with the provided data.
     * Set the element styling from the provided data.
     * Formatting is set with a mixture of inline styling
     * and css class use.
     *
     * @param {HTML Element} elm The html element to decorate
     * @param {Object} formatting Object defining text formatting properties.
     * @see ../pronto/src/dcp/schemas/responses/properties/text-formatting.json
     */
    decorate: function(elm, formatting) {
      if(formatting !== undefined && !TypeUtils.isString(formatting)) {

        _api.setShadow(elm, formatting.shw);
        _api.setOutline(elm, formatting.otl);
        _api.setEmboss(elm, formatting.emb);
        _api.setEngrave(elm, formatting.eng);

        var style;
        if (formatting.udl !== undefined) {
          style = formatting.ustlye ? formatting.ustyle : 'single';
          _api.setUnderline(elm, formatting.udl, style);
        }

        _api.setOverline(elm, formatting.ovl);

        // No easy way to achieve double strike through in
        // CSS so just fall back to single strike for now
        _api.setStrikethrough(elm, formatting.strikethrough || formatting.dstr);

        _api.setBlink(elm, formatting.bli);

        if(formatting.font) {
          _api.setFontFace(elm, formatting.font);
        }

        if(formatting.siz !== undefined) {
          _api.setFontSize(elm, formatting.siz);
        }

        if(formatting.clr) {
          _api.setFontColor(elm, formatting.clr);
        }

        if(formatting.hgl) {
          _api.setFontHighlight(elm, formatting.hgl);
        }

        // NOTE a general concept for boolean properties is
        // that if a property IS defined in the DCP, but set to
        // false, then we need to set the CSS to "normal"
        // or the equivalent thereof, so that the text does
        // not inherit the parent style (which is what it
        // should do in case the property isn't even defined)
        if(formatting.itl !== undefined) {
          if(formatting.itl) {
            _api.setFontStyle(elm, 'italic');
          } else {
            _api.setFontStyle(elm, 'normal');
          }
        }

        if(formatting.bld !== undefined) {
          if(formatting.bld) {
            _api.setFontWeight(elm, 'bold');
          } else {
            _api.setFontWeight(elm, 'normal');
          }
        }

        if(formatting.hid !== undefined) {
          _api.setHidden(elm, formatting.hid);
        }

        if(formatting.sub !== undefined) {
          if(formatting.sub) {
            _api.setSubScript(elm, formatting.siz);
          }
        }

        if(formatting.sup !== undefined) {
          if(formatting.sup) {
            _api.setSuperScript(elm, formatting.siz);
          }
        }

        if(formatting.acp !== undefined) {
          _api.setAllCaps(elm, formatting.acp);
        }

        if(formatting.scp !== undefined) {
          _api.setSmallCaps(elm, formatting.scp);
        }
      }
    },

    /**
     * Removes element decorations.
     *
     * @param {HTML Element} elm The element you want to remove decoration from.
     * @param {Array} opt_properties List of formatting property names to remove
     *                from the element. If undefined all properties are removed.
     */
    undecorate: function(elm, opt_properties) {
      var properties = opt_properties || Object.keys(_removePropertiesFuncs);
      _undecorate(elm, properties);
    }
  };

  // PRIVATE

  /**
   * Render Policies
   * Contains arbitrary values or flags that control aspects of rendering,
   * the purpose of this object is to group and provide a standard API to
   * values that have traditionally been hard-coded public member data.
   */
  var _policies = {
    /*
     * sub_or_super_script_font_ratio field defines font size ratio between
     * normal fonts and subscript font, Our assumption to keep font size of
     * super/Subscript, 75% of actual font size
     *
     * Use sub_or_super_script_font_ratio as zoom factor for super/sub script
     * text(span).
     * This way, we don't need to change original font size (hence help ful for
     * editing), and we are able to show/render it as shrunken than original
     * size
     */
    sub_or_super_script_font_ratio: '75%',

    /*
     * In order to make superscripts and subscripts not push up or push down
     * the surrounding lines, we make the line height 0.
     */
    sub_or_super_script_line_height: '0',

    /*
     * Vertical align value, in case of superscript.
     */
    superscript_vertical_align: 'super',

    /*
     * Vertical align value, in case of subscript.
     */
    subscript_vertical_align: 'sub'
  };


  function _addDecoration(elm, decoration) {
    if (!_styleHasDecoration(elm, decoration)) {
      if (elm.style.textDecoration === 'initial') {
        // 'initial' prevents any further value from taking effect so remove it.
        elm.style.textDecoration = '';
      }

      // Css ignores everything after 'none' so we must remove before
      // setting a new value.
      elm.style.textDecoration =
        elm.style.textDecoration.replace(/\s*none\s*/gi,"");
      elm.style.textDecoration +=
        (elm.style.textDecoration ? ' ' : '') + decoration;
    }
    return _api;
  }

  function _removeDecoration(elm, decoration) {
    var textStyle = elm.style.textDecoration;
    textStyle = textStyle.
      replace(new RegExp("(^|\\s+)" + decoration + "(\\s+|$)"), ' ');
    textStyle = textStyle.replace(/^\s+/, '').replace(/\s+$/, '');
    // When removing decoration we have to set empty string rather than
    // 'text-decoration: none'.
    // During edits when we review changed CSS Primitives, 'none' is reported as
    // an empty string for text-decoration - this is what we need to match.
    textStyle = (textStyle === '') ? '' : textStyle;
    elm.style.textDecoration = textStyle;
    return _api;
  }

  function _styleHasDecoration(elm, decoration) {
    var textStyle = elm.style.textDecoration;
    return _hasDecoration(textStyle, decoration);
  }

  function _hasDecoration(cssString, decoration) {
    return ((cssString.length > 0) &&
      (new RegExp("(^|\\s)" + decoration + "(\\s|$)").test(cssString)));
  }

  function _unsetFontFace(elm) {
    FontManager.removeFontClassName(elm);
  }

  /**
   * @private
   * Remove the given formatting properties from the specified element.
   *
   * @param {boolean} name argument for x y z
   */
  function _undecorate(elm, keys) {
    if (!keys || keys.length < 1) {
      return;
    }

    keys.forEach(function(key) {
      var func = _removePropertiesFuncs[key];
      if (func) {
        func(elm);
      } else {
        console.warn('text decorator found unrecognised format ' +
            'property key: ' + key);
      }
    });
  }

  function _unsetTextEffect(elm) {
    elm.style.textShadow = '';
    elm.style.webkitTextFillColor = '';
    elm.style.webkitTextStroke = '';
    elm.style.color = '';
  }

  function _makeCssUnsetter(property) {
    return function(elm) {
      elm.style[property] = '';
    };
  }

  var _removePropertiesFuncs = {
    font: _unsetFontFace,
    hgl: _makeCssUnsetter('backgroundColor'),
    bld: _makeCssUnsetter('fontWeight'),
    itl: _makeCssUnsetter('fontStyle'),
    siz: _makeCssUnsetter('fontSize'),
    clr: _makeCssUnsetter('color'),
    shw: _unsetTextEffect,
    otl: _unsetTextEffect,
    emb: _unsetTextEffect,
    eng: _unsetTextEffect,
    udl: function(elm) {_removeDecoration(elm, 'underline');},
    ovl: function(elm) {_removeDecoration(elm, 'line-through');},
    strikethrough: function(elm) {_removeDecoration(elm, 'line-through');},
    hid: function(elm) {elm.style.display = 'inline-block';},
    sub: _makeCssUnsetter('verticalAlign'),
    sup: _makeCssUnsetter('verticalAlign'),
    acp: _makeCssUnsetter('textTransform'),
    dcp: _makeCssUnsetter('fontVariant')
  };

  return _api;
});
