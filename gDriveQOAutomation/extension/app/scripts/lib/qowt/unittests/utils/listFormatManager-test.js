/**
 * @fileoverview Unit test module for the List Format Manager.
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/pubsub/pubsub'
], function(
    ListFormatManager,
    PubSub) {

  'use strict';

  describe('List Format Manager', function() {

    beforeEach(function() {
      ListFormatManager.init();
      ListFormatManager.addIds('entry1', 'template1');
      ListFormatManager.addIds('entry2', 'template2');
      ListFormatManager.addIds('entry3', 'template3');
      ListFormatManager.addIds('entry4', 'template4');
      ListFormatManager.setDefault('template1', 'bulleted');
      ListFormatManager.setDefault('template2', 'numbered');
      for (var ti = 0, tt = 9; ti < tt; ti++) {
        ListFormatManager.addTemplateData('template1', {
          'level': ti,
          'bulleted': true,
          'lvltxt': '',
          'bin': 12,
          'ppr': {
            'lin': 6
          },
          'rpr': {
            'font': 'Calibri'
          }
        });
      }
      for (ti = 0, tt = 9; ti < tt; ti++) {
        ListFormatManager.addTemplateData('template2', {
          'level': ti,
          'bulleted': false,
          'lvltxt': '',
          'bin': 12,
          'ppr': {
            'lin': 6
          },
          'rpr': {
            'font': 'Calibri'
          }
        });
      }
      for (ti = 0, tt = 9; ti < tt; ti++) {
        ListFormatManager.addTemplateData('template3', {
          'level': ti,
          'bulleted': true,
          'lvltxt': '',
          'bin': 24,
          'ppr': {
            'lin': 12
          },
          'rpr': {
            'font': 'Symbol'
          }
        });
      }
      for (ti = 0, tt = 9; ti < tt; ti++) {
        ListFormatManager.addTemplateData('template4', {
          'level': ti,
          'bulleted': false,
          'lvltxt': '',
          'bin': 24,
          'ppr': {
            'lin': 12
          },
          'rpr': {
            'font': 'Symbol'
          }
        });
      }
      PubSub.publish('qowt:getListFormats', {'success': true});
    });

    it('should throw if listFormatManager.init() called multiple times',
       function() {
         expect(
             function() {
               ListFormatManager.init();
             }).toThrow('listFormatManager.init() called multiple times.');
       });

    describe('ListFormatManager.getTemplateId', function() {
      it('lookup a template ID using an entry ID', function() {
        expect(ListFormatManager.getTemplateId('entry1')).toBe('template1');
        expect(ListFormatManager.getTemplateId('entry2')).toBe('template2');
        expect(ListFormatManager.getTemplateId('entry3')).toBe('template3');
        expect(ListFormatManager.getTemplateId('entry4')).toBe('template4');
      });
    });

    describe('ListFormatManager.getEntryId', function() {
      it('lookup an entry ID using a template ID', function() {
        expect(ListFormatManager.getEntryId('template1')).toBe('entry1');
        expect(ListFormatManager.getEntryId('template2')).toBe('entry2');
        expect(ListFormatManager.getEntryId('template3')).toBe('entry3');
        expect(ListFormatManager.getEntryId('template4')).toBe('entry4');
      });
    });

    describe('ListFormatManager.get', function() {
      it('lookup a CSS classname using a template ID', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.get('template1', ti)).toBe(
              'qowt-li-template1_' + ti);
        }
        for (ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.get('template2', ti)).toBe(
              'qowt-li-template2_' + ti);
        }
      });
      it('lookup a CSS classname using an entry ID', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.get('entry1', ti)).toBe(
              'qowt-li-template1_' + ti);
        }
        for (ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.get('entry2', ti)).toBe(
              'qowt-li-template2_' + ti);
        }
      });
    });

    describe('ListFormatManager.getListType', function() {
      it('lookup list type using a bulleted template ID', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.getListType('template1', ti)).toBe('b');
        }
      });
      it('lookup list type using a bulleted template ID', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          expect(ListFormatManager.getListType('template2', ti)).toBe('n');
        }
      });
    });

    describe('Defaults', function() {
      it('set default template for bulleted lists', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          var defaultInfo = ListFormatManager.getDefaultInfo('b', ti);
          expect(defaultInfo.entryId).toBe('entry1');
          expect(defaultInfo.templateId).toBe('template1');
          expect(defaultInfo.level).toBe(ti);
        }
      });
      it('set default template for numbered lists', function() {
        for (var ti = 0, tt = 8; ti < tt; ti++) {
          var defaultInfo = ListFormatManager.getDefaultInfo('n', ti);
          expect(defaultInfo.entryId).toBe('entry2');
          expect(defaultInfo.templateId).toBe('template2');
          expect(defaultInfo.level).toBe(ti);
        }
      });
    });

    describe('List Format Corruptions', function() {
      it('detect overwritting the default bulleted format', function() {
        spyOn(console, 'warn').andCallThrough();
        ListFormatManager.setDefault('template3', 'bulleted');
        expect(console.warn).toHaveBeenCalled();
      });
      it('detect overwritting the default numbered format', function() {
        spyOn(console, 'warn').andCallThrough();
        ListFormatManager.setDefault('template4', 'numbered');
        expect(console.warn).toHaveBeenCalled();
      });
      it('detect list format corruption during addTemplateData', function() {
        spyOn(console, 'warn').andCallThrough();
        ListFormatManager.addTemplateData('bad_template', {});
        expect(console.warn).toHaveBeenCalled();
      });
    });

  });

});
