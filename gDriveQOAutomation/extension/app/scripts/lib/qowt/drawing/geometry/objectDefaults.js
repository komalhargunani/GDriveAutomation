// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Object Defaults is a utility which return the default shapeJson
 * required to draw the text box or any shape.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
], function() {

  'use strict';

  //TODO (Pankaj Avhad) Need to replace these ids with preset name,
  //when service/core starts sending preset name instead of preset ids.
  //Array of presetIds with shape specific properties.
  var _shapesWithNoFillStyle = [126, 117, 144, 40, 136, 19];
  var _shapesWithFntRefTxt1 = [6, 18, 126, 117, 144, 40, 136, 19,
    164, 140, 160, 104, 58, 153, 122, 169, 8, 146, 89, 22, 174, 150, 94];
  var _api = {
    /**
     * Get default shape data for given preset shape id.
     *
     * @param {number} presetId preset shape id for which data to be returned
     * @return {object} preset shape data for given preset shape id
     */
    getShapeDefaults: function(presetId) {
      return _generateDefaults(presetId);
    },
    /**
     * Get default data for text box.
     * @return {object} default data for text box
     */
    getTextBoxDefaults: function() {
      return _generateDefaults();
    }
  };

  /**
   * Modifies the _shapeJson to apply no fill style
   * @param {object} _shapeJson object to modify.
   * @private
   */
  var _setShapesWithNoFillStyle = function(_shapeJson) {
    _shapeJson.style.lnRef.color.effects = {};
    _shapeJson.style.lnRef.idx = 1;
    _shapeJson.style.fillRef.idx = 0;
  };

  /**
   * Modifies the _shapeJson to apply tx1 font style
   * @param {object} _shapeJson object to modify.
   * @private
   */
  var _setShapesWithFntRefTxt1 = function(_shapeJson) {
    //TODO:Pankaj Avhad(pankaj.avhad@synerzip.com) This need to be handled via
    //fill object of endParaRPr or rpr.
    _shapeJson.style.fntRef.color.scheme = 'tx1';
  };

  /**
   * Get default shape data for given preset shape id.
   *
   * @param  {number} presetId [optional] preset shape id for which data to
   *                             be returned. if preset id is not passed it will
   *                             return the defaults for text box.
   * @return {object} preset shape data for given preset shape id or text box.
   * @private
   */
  var _generateDefaults = function(presetId) {

    //TODO:Pankaj Avhad(pankaj.avhad@synerzip.com) This is default JSON that
    //might change or needs recalculation for some parameters depending on theme
    //and related parameters.
    //ObjectDefaults in theme which needs a special handling can be addressed
    //here, in successive commits.
    var _shapeJson = {
      'eid': 'def1',
      'elm': [
        {
          'bodyPr': {
          },
          'eid': 'def2',
          'elm': [
            {
              'eid': 'def3',
              'endParaRPr': {
                'eid': 'def4'
              },
              'etp': 'para'
            }
          ],
          'etp': 'txBody'
        }
      ],
      'etp': 'sp',
      'isShapeWithinTable': false,
      'nvSpPr': {
        'isHidden': false,
        'isTxtBox': false
      },
      'spPr': {
        'geom': {
          'prst': 88
        },
        'xfrm': {
          'ext': {},
          'flipH': false,
          'flipV': false,
          'off': {},
          'rot': 0

        }
      }
    };

    if (presetId > -1) {
      _shapeJson.spPr.geom.prst = presetId;
      _shapeJson.style = {
        'effectRef': {
          'color': {
            'scheme': 'accent1',
            'type': 'schemeClr'
          },
          'idx': 0
        },
        'fillRef': {
          'color': {
            'scheme': 'accent1',
            'type': 'schemeClr'
          },
          'idx': 1
        },
        'fntRef': {
          'color': {
            'scheme': 'lt1',
            'type': 'schemeClr'
          },
          'idx': 'minor'
        },
        'lnRef': {
          'color': {
            'effects': [
              {
                'name': 'shade',
                'value': 50000
              }
            ],
            'scheme': 'accent1',
            'type': 'schemeClr'
          },
          'idx': 2
        }
      };
      _shapeJson.elm[0].bodyPr = {'anchor': 'ctr'};
      _shapeJson.elm[0].elm[0].ppr = {'jus': 'C'};
      if (_shapesWithNoFillStyle.indexOf(presetId) > -1) {
        _setShapesWithNoFillStyle(_shapeJson);
      }
      if (_shapesWithFntRefTxt1.indexOf(presetId) > -1) {
        _setShapesWithFntRefTxt1(_shapeJson);
      }
    } else {
      _shapeJson.nvSpPr.isTxtBox = true;
      _shapeJson.spPr.fill = {'type': 'noFill'};
      _shapeJson.elm[0].bodyPr = {'wrap': 'square'};
    }
    return _shapeJson;
  };
  return _api;
});
