// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview tableStyleDefinitions defines all point table styles.
 *
 * @author sunil.enalde@quickoffice.com (Sunil Enadle)
 */

define([ ], function() {

  'use strict';


  /**
   * Returns the solid fill JSON
   * @param scheme - scheme name
   * @param schemeType - color scheme type
   * @param effectName - effect name
   * @param effectValue - effect value
   */
  var _getSolidFill = function(scheme, schemeType, effectName, effectValue) {
    schemeType = schemeType || '';
    return {
      "color": _getSchemeColor(scheme, effectName, effectValue),
      "type": "solidFill"
    };
  };

  /**
   * Returns the SRGB color
   * @param color - hex value of color
   * @param effectName - color effect name
   * @param effectValue - color effect value
   */
  var _getSrgbColor = function(color, effectName, effectValue) {
    return {
      "clr": color,
      "effects": [
        _getEffects(effectName, effectValue)
      ],
      "type": "srgbClr"
    };
  };

  /**
   * Returns the scheme color JSON
   * @param scheme - the color scheme (dk1, accent1, accent2..)
   * @param effectName - color effect name
   * @param effectValue - color effect value
   * @return scheme color JSON
   */
  var _getSchemeColor = function(scheme, effectName, effectValue) {
    if (effectName && effectValue) {
      return {
        "effects": [
          _getEffects(effectName, effectValue)
        ],
        "scheme": scheme,
        "type": "schemeClr"
      };
    } else {
      return {
        "scheme": scheme,
        "type": "schemeClr"
      };

    }
  };

  /**
   * Return the color effect JSON
   * @param effectName
   * @param effectValue
   * @return color effect JSON
   */
  var _getEffects = function(effectName, effectValue) {
    return {
      "name": effectName,
      "value": effectValue
    };
  };

  /**
   * Return the noFill json
   */
  var _getNoFill = function() {
    return {
      "type": "noFill"
    };
  };

  /**
   * Return the noFill json for line.
   */
  var _getNoFillLine = function() {
    return {
      "ln": {
        "fill": {
          "type": "noFill"
        }
      }
    };
  };

  /**
   * Return the lineRef JSON
   * @param scheme - The color scheme name
   * @param schemeType - Scheme Type
   * @param idx - scheme IdX
   * @param effectName - The color effect name
   * @param effectValue - The color effect value
   */
  var _getLineRef = function(scheme, schemeType, idx, effectName, effectValue) {
    schemeType = schemeType || '';
    return {
      "lnRef": {
        "color": _getSchemeColor(scheme, effectName, effectValue),
        "idx": idx
      }
    };
  };

  /**
   * Return the fillRef JSON
   * @param schemeClr
   * @param idx
   * @param effectName - The color effect name
   * @param effectValue - The color effect Value
   */
  var _getFillRef = function(schemeClr, idx, effectName, effectValue) {
    return {
      "color": _getSchemeColor(schemeClr, effectName, effectValue),
      "idx": idx
    };
  };


  /**
   * Return the fontRef JSON
   * @param color - hex value of color
   * @param idx
   * @param effectName - The color effect name
   * @param effectValue - The color effect value
   */
  var _getFontRef = function(color, idx, effectName, effectValue) {
    if (effectName && effectValue) {
      return {
        "color": {
          "clr": color,
          "effects": [
            _getEffects(effectName, effectValue)
          ],
          "type": "srgbClr"
        },
        "idx": idx
      };
    } else {
      return {
        "color": {
          "clr": color,
          "type": "srgbClr"
        },
        "idx": idx
      };
    }
  };


  var _ThemedStyle1 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _ThemedStyle1.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 40000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 40000.0),
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideH": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideV": _getNoFillLine(),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "2"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
          "tcBdr": {
            "bottom": _getLineRef("lt1", "schemeClr", "2"),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcStyle": {
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideH": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideV": _getNoFillLine(),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "2"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "2"),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "2")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "tblBg": {
        "fillRef": _getFillRef(this.clrScheme1, "2")
      },
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideH": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideV": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _ThemedStyle2 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _ThemedStyle2.prototype.getTableStyle = function() {
    return {
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr", "alpha", 20000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr", "alpha", 20000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "tcBdr": {
            "right": _getLineRef("lt1", "schemeClr", "2")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": _getLineRef("lt1", "schemeClr", "3")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcStyle": {
          "tcBdr": {
            "left": _getLineRef("lt1", "schemeClr", "2")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "top": _getLineRef("lt1", "schemeClr", "2")
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "neCell": {
        "tcStyle": {
          "tcBdr": {
            "bottom": _getNoFillLine()
          }
        }
      },
      "seCell": {
        "tcStyle": {
          "tcBdr": {
            "left": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        }
      },
      "styleId": this.styleId,
      "swCell": {
        "tcStyle": {
          "tcBdr": {
            "right": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        }
      },
      "tblBg": {
        "fillRef": {
          "color": _getSchemeColor(this.clrScheme1),
          "idx": "3"
        }
      },
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom":
                _getLineRef(this.clrScheme1, "schemeClr", "1", "tint", 50000.0),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left":
                _getLineRef(this.clrScheme1, "schemeClr", "1", "tint", 50000.0),
            "right":
                _getLineRef(this.clrScheme1, "schemeClr", "1", "tint", 50000.0),
            "top":
                _getLineRef(this.clrScheme1, "schemeClr", "1", "tint", 50000.0)
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("lt1"),
          "fontRef": {
            "color": _getSrgbColor("#000000", "alpha", 100000.0),
            "idx": "minor"
          }
        }
      }
    };
  };


  var _DarkStyle2 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _DarkStyle2.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme2, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "dbl",
                "fill": _getSolidFill("dk1", "schemeClr"),
                "w": 50800
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "bottom": _getNoFillLine(),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };

  };

  var _DarkStyle1dk1 = function(clrScheme1, clrScheme2) {
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _DarkStyle1dk1.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 40000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 40000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 60000.0),
          "tcBdr": {
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 60000.0),
          "tcBdr": {
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 60000.0),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": "Dark Style 1",
      "neCell": {
        "tcStyle": {
          "tcBdr": {
            "left": _getNoFillLine()
          }
        }
      },
      "nwCell": {
        "tcStyle": {
          "tcBdr": {
            "right": _getNoFillLine()
          }
        }
      },
      "seCell": {
        "tcStyle": {
          "tcBdr": {
            "left": _getNoFillLine()
          }
        }
      },
      "styleId": "{E8034E78-7F5D-4C2E-B375-FC64B27BC917}",
      "swCell": {
        "tcStyle": {
          "tcBdr": {
            "right": _getNoFillLine()
          }
        }
      },
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "bottom": _getNoFillLine(),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };


  var _DarkStyle1 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _DarkStyle1.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "shade", 60000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "shade", 60000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "shade", 60000.0),
          "tcBdr": {
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "shade", 60000.0),
          "tcBdr": {
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "shade", 40000.0),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "neCell": {
        "tcStyle": {
          "tcBdr": {
            "left": _getNoFillLine()
          }
        }
      },
      "nwCell": {
        "tcStyle": {
          "tcBdr": {
            "right": _getNoFillLine()
          }
        }
      },
      "seCell": {
        "tcStyle": {
          "tcBdr": {
            "left": _getNoFillLine()
          }
        }
      },
      "styleId": this.styleId,
      "swCell": {
        "tcStyle": {
          "tcBdr": {
            "right": _getNoFillLine()
          }
        }
      },
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
          "tcBdr": {
            "bottom": _getNoFillLine(),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _MediumStyle1 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _MediumStyle1.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr"),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "dbl",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 50800
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideH": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideV": _getNoFillLine(),
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };

  };

  var _MediumStyle2 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _MediumStyle2.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 38100
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 38100
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            },
            "insideH": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            },
            "insideV": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            },
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            },
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            },
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("lt1", "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };

  };

  var _MediumStyle3 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _MediumStyle3.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 20000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill("dk1", "schemeClr", "tint", 20000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("dk1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("lt1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr"),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "dbl",
                "fill": _getSolidFill("dk1", "schemeClr"),
                "w": 50800
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "seCell": {
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "styleId": this.styleId,
      "swCell": {
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill("lt1", "schemeClr"),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("dk1", "schemeClr"),
                "w": 25400
              }
            },
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("dk1", "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _MediumStyle4 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _MediumStyle4.prototype.getTableStyle = function() {
    return {
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 40000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0)
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "tint", 20000.0),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideH": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideV": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("dk1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _LightStyle1 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _LightStyle1.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 20000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 20000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("tx1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _LightStyle2 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _LightStyle2.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        }
      },
      "band1V": {
        "tcStyle": {
          "tcBdr": {
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        }
      },
      "band2V": {
        "tcStyle": {
          "tcBdr": {
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fillRef": _getFillRef(this.clrScheme1, "1")
        },
        "tcTxStyle": {
          "b": "on",
          "color": _getSchemeColor("bg1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "dbl",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 50800
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "right": _getLineRef(this.clrScheme1, "schemeClr", "1"),
            "top": _getLineRef(this.clrScheme1, "schemeClr", "1")
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("tx1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };

  };

  var _LightStyle3 = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _LightStyle3.prototype.getTableStyle = function() {
    return{
      "band1H": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 20000.0)
        }
      },
      "band1V": {
        "tcStyle": {
          "fill": _getSolidFill(this.clrScheme1, "schemeClr", "alpha", 20000.0)
        }
      },
      "etp": "tbStyl",
      "firstCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "firstRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 25400
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastCol": {
        "tcTxStyle": {
          "b": "on"
        }
      },
      "lastRow": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "top": {
              "ln": {
                "cmpd": "dbl",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 50800
              }
            }
          }
        },
        "tcTxStyle": {
          "b": "on"
        }
      },
      "name": this.styleName,
      "styleId": this.styleId,
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideH": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "insideV": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            },
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill(this.clrScheme1, "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("tx1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };


  var _NoStyleNoGrid = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _NoStyleNoGrid.prototype.getTableStyle = function() {
    return{
      "etp": "tbStyl",
      "name": "No Style, No Grid",
      "styleId": "{2D5ABB26-0587-4C30-8999-92F81FD0307C}",
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": _getNoFillLine(),
            "insideH": _getNoFillLine(),
            "insideV": _getNoFillLine(),
            "left": _getNoFillLine(),
            "right": _getNoFillLine(),
            "top": _getNoFillLine()
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("tx1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };

  var _NoStyleTableGrid = function(clrScheme1, clrScheme2) {
    this.styleId = undefined;
    this.styleName = undefined;
    this.clrScheme1 = clrScheme1;
    this.clrScheme2 = clrScheme2;
  };

  _NoStyleTableGrid.prototype.getTableStyle = function() {
    return{
      "etp": "tbStyl",
      "name": "No Style, Table Grid",
      "styleId": "{5940675A-B579-460E-94D1-54222C63F5DA}",
      "wholeTbl": {
        "tcStyle": {
          "fill": _getNoFill(),
          "tcBdr": {
            "bottom": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            },
            "insideH": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            },
            "insideV": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            },
            "left": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            },
            "right": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            },
            "top": {
              "ln": {
                "cmpd": "sng",
                "fill": _getSolidFill("tx1", "schemeClr"),
                "w": 12700
              }
            }
          }
        },
        "tcTxStyle": {
          "color": _getSchemeColor("tx1"),
          "fontRef": _getFontRef("#000000", "minor", "alpha", 100000.0)
        }
      }
    };
  };


  var _tblStyleDefinitions = {
    'Themed-Style-1': _ThemedStyle1,
    'Themed-Style-2': _ThemedStyle2,
    'Dark-Style-1-dk1': _DarkStyle1dk1,
    'Dark-Style-1': _DarkStyle1,
    'Dark-Style-2': _DarkStyle2,
    'Medium-Style-1': _MediumStyle1,
    'Medium-Style-2': _MediumStyle2,
    'Medium-Style-3': _MediumStyle3,
    'Medium-Style-4': _MediumStyle4,
    'Light-Style-1': _LightStyle1,
    'Light-Style-2': _LightStyle2,
    'Light-Style-3': _LightStyle3,
    'No-Style-No-Grid': _NoStyleNoGrid,
    'No-Style-Table-Grid': _NoStyleTableGrid

  };

  return _tblStyleDefinitions;
});
