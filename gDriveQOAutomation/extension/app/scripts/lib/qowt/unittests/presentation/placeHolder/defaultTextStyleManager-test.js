/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/presentation/placeHolder/defaultTextStyleManager'
], function(
    DefaultTextStyleManager) {

  'use strict';

  describe('default text style manager tests', function() {
    var _defTxtStyleManager = DefaultTextStyleManager;

    it('should return proper resolved run property', function() {
      var someDefaultTextStyle = {
        'pPrArr': [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 32,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-342900',
              'leftMargin': '342900'
            }
          },
          {
            'pPrName': 'lvl2PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 28,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-285750',
              'leftMargin': '742950'
            }
          },
          {
            'pPrName': 'lvl3PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 24,
                'font': {latin: '+mn-lt'}
              },
              'indent': '-228600',
              'leftMargin': '1143000'
            }
          }
        ]
      };

      var expectedRunProperty = {
        'sz': 28,
        'font': {latin: '+mn-lt'}
      };

      _defTxtStyleManager.cacheDefTxtStyle(someDefaultTextStyle);
      var runProperty = _defTxtStyleManager.resolveRunPropertyFor(1);

      expect(runProperty).toEqual(expectedRunProperty);
    });

    it('should return undefined when resolved run property is not present',
       function() {
         var someDefaultTextStyle = {
           'pPrArr': [
             {
               'pPrName': 'lvl1PPr',
               'pPrValue': {
                 'jus': 'L',
                 'defRPr': {
                   'sz': 32,
                   'font': {latin: '+mn-lt'}
                 },
                 'indent': '-342900',
                 'leftMargin': '342900'
               }
             },
             {
               'pPrName': 'lvl2PPr',
               'pPrValue': {
                 'jus': 'L',
                 'defRPr': {
                   'sz': 28,
                   'font': {latin: '+mn-lt'}
                 },
                 'indent': '-285750',
                 'leftMargin': '742950'
               }
             },
             {
               'pPrName': 'lvl3PPr',
               'pPrValue': {
                 'jus': 'L',
                 'defRPr': {
                   'sz': 24,
                   'font': {latin: '+mn-lt'}
                 },
                 'indent': '-228600',
                 'leftMargin': '1143000'
               }
             }
           ]
         };

         _defTxtStyleManager.cacheDefTxtStyle(someDefaultTextStyle);
         var runProperty = _defTxtStyleManager.resolveRunPropertyFor(4);

         expect(runProperty).toEqual(undefined);
       });
  });
});
