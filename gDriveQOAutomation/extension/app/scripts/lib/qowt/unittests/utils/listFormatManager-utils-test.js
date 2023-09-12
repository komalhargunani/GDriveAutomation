/**
 * @fileoverview Unit test module for the List Format Manager Utils.
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/listFormatManager-utils'
], function(
    ListFormatManagerUtils) {

  'use strict';

  var testData, testEntry, testTemplate, testLevel;

  describe('List Format Manager Utils', function() {

    beforeEach(function() {
      testData = {
        entryToTemplate: {
          'entry1': 'template1'
        },
        templateToEntry: {
          'template1': 'entry1'
        },
        templateData: {
          'template1': {}
        },
        classnames: {
          'template1': {
            '0': 'qowt-li-template1-0'
          }
        },
        defaultTemplates: {
          'b': 'template1',
          'n': 'template1'
        },
        compiledCss: []
      };
      testEntry = 'entry1';
      testTemplate = 'template1';
      testLevel = 0;
    });

    afterEach(function() {
      testData = undefined;
      testEntry = undefined;
      testTemplate = undefined;
      testLevel = undefined;
    });

    describe('ListFormatManagerUtils.validateTemplateData', function() {
      beforeEach(function() {
        spyOn(ListFormatManagerUtils, 'listFormatDataError').andCallThrough();
      });
      it('should return true if validation passes', function() {
        var result = ListFormatManagerUtils.validateTemplateData(testData,
            testEntry, testTemplate, testLevel);
        expect(result).toBe(true);
        expect(ListFormatManagerUtils.listFormatDataError).not.
            toHaveBeenCalled();
      });
      it('should call listFormatDataError for invalid template ID', function() {
        var result = ListFormatManagerUtils.validateTemplateData(testData,
            testEntry, null, testLevel);
        expect(result).toBe(false);
        expect(ListFormatManagerUtils.listFormatDataError).toHaveBeenCalled();
      });
      it('should call listFormatDataError for invalid entry ID', function() {
        var result = ListFormatManagerUtils.validateTemplateData(testData, null,
            testTemplate, testLevel);
        expect(result).toBe(false);
        expect(ListFormatManagerUtils.listFormatDataError).toHaveBeenCalled();
      });
      it('should call listFormatDataError for invalid data object', function() {
        var invalidData = testData;
        invalidData.templateToEntry = {};
        var result = ListFormatManagerUtils.validateTemplateData(invalidData,
            testEntry, testTemplate, testLevel);
        expect(result).toBe(false);
        expect(ListFormatManagerUtils.listFormatDataError).toHaveBeenCalled();
      });
      it('should call listFormatDataError for invalid level', function() {
        var result = ListFormatManagerUtils.validateTemplateData(testData,
            testEntry, testTemplate, NaN);
        expect(result).toBe(false);
        expect(ListFormatManagerUtils.listFormatDataError).toHaveBeenCalled();
      });
      it('should call listFormatDataError for duplicated level templates',
         function() {
           var dupeData = testData;
           dupeData.templateData.template1['0'] = {};
           var result = ListFormatManagerUtils.validateTemplateData(dupeData,
               testEntry, testTemplate, testLevel);
           expect(result).toBe(false);
           expect(ListFormatManagerUtils.listFormatDataError).
               toHaveBeenCalled();
         });
    });

    describe('ListFormatManagerUtils.makeClassName', function() {
      it('should return a class name string', function() {
        expect(ListFormatManagerUtils.makeClassName(testTemplate, testLevel)).
            toBe('qowt-li-template1_0');
      });
    });

    describe('ListFormatManagerUtils.makeStyleName', function() {
      it('should return a style name string', function() {
        expect(ListFormatManagerUtils.makeStyleName(testTemplate, testLevel,
            false)).toBe('#qowt-msdoc p.qowt-li-template1_0');
        expect(ListFormatManagerUtils.makeStyleName(testTemplate, testLevel,
            true)).toBe('#qowt-msdoc p.qowt-li-template1_0[id]');
      });
    });

    describe('ListFormatManagerUtils.stripParagraphIndents', function() {
      it('should remove indent properties from an object', function() {
        var testPpr = {
          'fli': 1,
          'hin': 2,
          'lin': 3,
          'rin': 4,
          'donotremove': true
        };
        var result = ListFormatManagerUtils.stripParagraphIndents(testPpr);
        expect(Object.keys(result).length).toBe(1);
        expect(result.donotremove).toBe(true);
        // The original object should remain unchanged.
        expect(Object.keys(testPpr).length).toBe(5);
      });
    });

    describe('ListFormatManagerUtils.formatLvlTxt', function() {
      it('should replace place holders with CSS counter declarations',
         function() {
           var testLvltxt = '%1.%2.%3.%4.%5.%6.%7.%8.%9';
           var result = ListFormatManagerUtils.formatLvlTxt(testData, testEntry,
               testTemplate, testLvltxt);
           expect(result).toBe('"" counter(lc-entry1-0, decimal) "." ' +
               'counter(lc-entry1-1, decimal) "." ' +
               'counter(lc-entry1-2, decimal) "." ' +
               'counter(lc-entry1-3, decimal) "." ' +
               'counter(lc-entry1-4, decimal) "." ' +
               'counter(lc-entry1-5, decimal) "." ' +
               'counter(lc-entry1-6, decimal) "." ' +
               'counter(lc-entry1-7, decimal) "." ' +
               'counter(lc-entry1-8, decimal) ""');
         });
    });

    describe('ListFormatManagerUtils.getNumFormatForLevel', function() {
      it('should return the numformat from the template data', function() {
        expect(ListFormatManagerUtils.getNumFormatForLevel(testData,
            testTemplate, testLevel)).toBe('decimal');
        var newData = testData;
        newData.templateData.template1['0'] = {'numformat': 'testFormat'};
        expect(ListFormatManagerUtils.getNumFormatForLevel(newData,
            testTemplate, testLevel)).toBe('testFormat');
      });
    });

    describe('ListFormatManagerUtils.getStartAtForLevel', function() {
      it('should return the startat from the template data', function() {
        expect(ListFormatManagerUtils.getStartAtForLevel(testData, testTemplate,
            testLevel)).toBe(0);
        var newData = testData;
        newData.templateData.template1['0'] = {'startat': 100};
        expect(ListFormatManagerUtils.getStartAtForLevel(newData, testTemplate,
            testLevel)).toBe(99);
      });
    });

    describe('ListFormatManagerUtils.makeLvltxtNode', function() {
      it('should return a span node that contains the correct lvltxt',
         function() {
           var dcpData = {'correctedLvlTxt': '%1.', 'ppr': {}, 'rpr': {}};
           var result = ListFormatManagerUtils.makeLvltxtNode(dcpData,
               testEntry, testLevel);
           expect(result.nodeName).toBe('SPAN');
           expect(result.id).toBe('qowt-lvltxt-entry1-0');
           expect(result.textContent).toBe('www.');
         });
    });

    describe('ListFormatManagerUtils.makeBinNode', function() {
      it('should return a div node that with the bullet indent width',
         function() {
           var result = ListFormatManagerUtils.makeBinNode({'ppr': {}},
               testEntry, testLevel);
           expect(result.nodeName).toBe('DIV');
           expect(result.id).toBe('qowt-bin-entry1-0');
           expect(result.style.width).toBe('18pt');
           result = ListFormatManagerUtils.makeBinNode({'ppr': {'hin': 20}},
               testEntry, testLevel);
           expect(result.nodeName).toBe('DIV');
           expect(result.id).toBe('qowt-bin-entry1-0');
           expect(result.style.width).toBe('20pt');
           result = ListFormatManagerUtils.makeBinNode({'ppr': {'fli': -50}},
               testEntry, testLevel);
           expect(result.nodeName).toBe('DIV');
           expect(result.id).toBe('qowt-bin-entry1-0');
           expect(result.style.width).toBe('50pt');
         });
    });

    describe('ListFormatManagerUtils.gatherMetrics', function() {
      it('should get the metrics from the div nodes', function() {
        // Simply testing that this does not throw as no nodes exist in the DOM
        expect(function() {
          ListFormatManagerUtils.gatherMetrics({}, testEntry, testLevel);
        }).not.toThrow();
      });
    });

    describe('ListFormatManagerUtils.compileMainListCss', function() {
      it('should add a CSS string array to the compiledCss array', function() {
        ListFormatManagerUtils.compileMainListCss(testData,
            {'ppr': {'lin': 36}, 'nameWithWidows': 'testName'});
        var result = testData.compiledCss[0];
        expect(result[0]).toBe('testName');
        expect(result[1]).toBe('position:relative;margin-left:36pt;');
      });
    });

    describe('ListFormatManagerUtils.compileCounterCss', function() {
      it('should add a CSS string array to the compiledCss array', function() {
        ListFormatManagerUtils.compileCounterCss(testData,
            {'ppr': {'lin': 36}, 'nameWoutWidows': 'testName'},
            testEntry,
            testLevel);
        var result = testData.compiledCss[0];
        expect(result[0]).toBe('testName');
        expect(result[1]).toBe('counter-increment: lc-entry1-0 1; ' +
            'counter-reset: ' +
            'lc-entry1-1 0 ' +
            'lc-entry1-2 0 ' +
            'lc-entry1-3 0 ' +
            'lc-entry1-4 0 ' +
            'lc-entry1-5 0 ' +
            'lc-entry1-6 0 ' +
            'lc-entry1-7 0 ' +
            'lc-entry1-8 0;');
      });
    });

    describe('ListFormatManagerUtils.compileBeforeCss', function() {
      it('should add a CSS string array to the compiledCss array', function() {
        ListFormatManagerUtils.compileBeforeCss(testData,
            {
              'ppr': {'lin': 36},
              'content': 'testContent',
              'nameWoutWidows': 'testName',
              'lvltxtNodeMetrics': {'width': 36},
              'binNodeMetrics': {'width': 24}
            });
        var result = testData.compiledCss[0];
        expect(result[0]).toBe('testName:before');
        expect(result[1]).toBe(
            'content:testContent;' +
            'position:absolute;' +
            'text-indent:0;' +
            'margin-left:-18pt;');
      });
    });

    describe('ListFormatManagerUtils.calculateBulletPosition', function() {
      it('should return the bullet indent value if the level text is shorter',
         function() {
           var dcpData = {
             'ppr': {'hin': 18},
             'lvltxtNodeMetrics': {'width': 35},
             'binNodeMetrics': {'width': 20}
           };
           expect(ListFormatManagerUtils.calculateBulletPosition(dcpData)).toBe(
               '-18pt;');
         });
      it('should return the level text width value if the level text is longer',
         function() {
           var dcpData = {
             'ppr': {'hin': 18},
             'lvltxtNodeMetrics': {'width': 45},
             'binNodeMetrics': {'width': 20}
           };
           expect(ListFormatManagerUtils.calculateBulletPosition(dcpData)).toBe(
               '-45px;');
         });
      it('should return the correct bullet indent value if the level text is ' +
          'shorter and hangingIndent is undefined', function() {
           var dcpData = {
             'ppr': {'hin': undefined},
             'lvltxtNodeMetrics': {'width': 35},
             'binNodeMetrics': {'width': 20}
           };
           expect(ListFormatManagerUtils.calculateBulletPosition(dcpData)).toBe(
               '-18pt;');
         });
    });

    describe('ListFormatManagerUtils.compileCountersInitCss', function() {
      it('should return counter initialization CSS text', function() {
        expect(ListFormatManagerUtils.compileCountersInitCss(testData)).toBe(
            'counter-reset: ' +
            'lc-entry1-0 0 ' +
            'lc-entry1-1 0 ' +
            'lc-entry1-2 0 ' +
            'lc-entry1-3 0 ' +
            'lc-entry1-4 0 ' +
            'lc-entry1-5 0 ' +
            'lc-entry1-6 0 ' +
            'lc-entry1-7 0 ' +
            'lc-entry1-8 0;');
      });
    });

    describe('ListFormatManagerUtils.compileTemplateData', function() {
      it('should compile the required data and store it in the dcp object',
         function() {
           var dcpData = {};
           ListFormatManagerUtils.compileTemplateData(testData, dcpData,
               testEntry, testTemplate, testLevel);
           expect(dcpData.nameWithWidows).toBe(
               '#qowt-msdoc p.qowt-li-template1_0');
           expect(dcpData.nameWoutWidows).toBe(
               '#qowt-msdoc p.qowt-li-template1_0[id]');
           expect(dcpData.ppr.lin).toBe(0);
           expect(dcpData.correctedLvlTxt).toBe('');
           expect(dcpData.content).toBe('""');
         });
    });

  });

});
