/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/presentation/explicitTextStyleManager'
], function(
    ExplicitTextStyleManager) {

  'use strict';

  describe('Explicit Text Style Manager Test', function() {
    var _explicitTextStyleManager = ExplicitTextStyleManager;
    var _someExplicitTextStyles;

    beforeEach(function() {
      _someExplicitTextStyles = {
        'pPrArr' : [
          {
            'pPrName': 'lvl1PPr',
            'pPrValue': {
              'jus': 'L',
              'defRPr': {
                'sz': 32,
                'font': '+mn-lt'
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
                'font': '+mn-lt',
                'bld': true,
                'itl': true,
                'udl': true
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
                'font': '+mn-lt'
              },
              'indent': '-228600',
              'leftMargin': '1143000'
            }
          }
        ]
      };
    });

    afterEach(function() {
      _explicitTextStyleManager.resetCache();
    });

    it('should resolve paragraph properties and add resolved properties to ' +
        'given paragraph properties object when explicit text styles are ' +
        'present', function() {
          _explicitTextStyleManager.cacheExplicitTxtStyle(
              _someExplicitTextStyles);

          var someParaProperties = {
            'indent': '-228600',
            'level': 1
          };

          var expectedParaProperties = {
            'jus': 'L',
            'indent': '-228600',
            'level': 1,
            'leftMargin': '742950'
          };

          _explicitTextStyleManager.resolveParaPropertyFor(someParaProperties);

          expect(someParaProperties).toEqual(expectedParaProperties);
        });

    it('should not resolve paragraph properties and not add any properties ' +
        'to given paragraph properties object when explicit text styles for ' +
        'given paragraph level are absent', function() {
          _explicitTextStyleManager.cacheExplicitTxtStyle(
              _someExplicitTextStyles);

          var someParaProperties = {
            'indent': '-228600',
            'level': 4
          };

          var expectedParaProperties = {
            'indent': '-228600',
            'level': 4
          };

          _explicitTextStyleManager.resolveParaPropertyFor(someParaProperties);

          expect(someParaProperties).toEqual(expectedParaProperties);
        });

    it('should not resolve paragraph properties and not add any properties ' +
        'to given paragraph properties object when explicit text styles are ' +
        'absent', function() {
          _someExplicitTextStyles = undefined;

          var someParaProperties = {
            'indent': '-228600',
            'level': 1
          };

          var expectedParaProperties = {
            'indent': '-228600',
            'level': 1
          };

          _explicitTextStyleManager.resolveParaPropertyFor(someParaProperties);

          expect(someParaProperties).toEqual(expectedParaProperties);
        });

    it('should not resolve paragraph properties and not add any properties ' +
        'to given paragraph properties object when explicit text styles is ' +
        'not defined for defRPr', function() {
          _someExplicitTextStyles = { 'pPrArr': [
            {
              'pPrName': 'lvl1PPr',
              'pPrValue': {
                'jus': 'L',
                'lvl1RPr': {
                  'sz': 32,
                  'font': '+mn-lt'
                },
                'indent': '-342900',
                'leftMargin': '342900'
              }
            }
          ]
          };

          var someParaProperties = {
            'indent': '-228600',
            'level': 1
          };

          var expectedParaProperties = {
            'indent': '-228600',
            'level': 1
          };

          _explicitTextStyleManager.resolveParaPropertyFor(someParaProperties);

          expect(someParaProperties).toEqual(expectedParaProperties);
        });

    it('should resolve run properties and add resolved properties to given ' +
        'run properties object when explicit text styles are present',
        function() {
          _explicitTextStyleManager.cacheExplicitTxtStyle(
              _someExplicitTextStyles);

          var someRunProperties = {
            'sz': 14
          };

          var expectedRunProperties = {
            'sz': 14,
            'font': '+mn-lt',
            'bld': true,
            'itl': true,
            'udl': true
          };

          _explicitTextStyleManager.resolveRunPropertyFor(1, someRunProperties);

          expect(someRunProperties).toEqual(expectedRunProperties);
        });

    it('should not resolve run properties and not add any properties to ' +
        'given run properties object when explicit text styles for given ' +
        'paragraph level are absent', function() {
          _explicitTextStyleManager.
              cacheExplicitTxtStyle(_someExplicitTextStyles);

          var someRunProperties = {
            'sz': 14,
            'bld': false,
            'itl': false,
            'udl': true
          };

          var expectedRunProperties = {
            'sz': 14,
            'bld': false,
            'itl': false,
            'udl': true
          };

          _explicitTextStyleManager.resolveRunPropertyFor(4, someRunProperties);

          expect(someRunProperties).toEqual(expectedRunProperties);
        });

    it('should not resolve run properties and not add any properties to ' +
        'given run properties object when explicit text styles are absent',
        function() {
          _someExplicitTextStyles = undefined;

          var someRunProperties = {
            'sz': 14,
            'bld': true,
            'itl': true,
            'udl': false
          };

          var expectedRunProperties = {
            'sz': 14,
            'bld': true,
            'itl': true,
            'udl': false
          };

          _explicitTextStyleManager.resolveRunPropertyFor(4, someRunProperties);

          expect(someRunProperties).toEqual(expectedRunProperties);
        });
  });
});
