// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/decorators/listItemDecorator',
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/pubsub/pubsub'
], function(TestUtils,
            ListItemDecorator,
            ListFormatManager,
            PubSub) {

  'use strict';

  describe('DCP.Decorators.listItemDecorator', function() {
    var test_node, list_item;

    beforeEach(function() {
      ListFormatManager.init();
      ListFormatManager.addIds('12345', '54321');
      ListFormatManager.addTemplateData('54321',
          {
            'level': 1,
            'lvltxt': '*',
            'bulleted': true,
            'bin': 12,
            'ppr': {
              'lin': 6
            },
            'rpr': {
              'font': 'Symbol'
            }
          }
      );

      PubSub.publish('qowt:getListFormats', {'success': true});
      test_node = TestUtils.createTestAppendArea();
      list_item = document.createElement('P');
      list_item.id = 'UT-ELM-01';
      list_item.setAttribute('qowt-divtype', 'list');
      list_item.setAttribute('qowt-eid', 'UT-ELM-01');
      ListItemDecorator.decorate(
          list_item,
          {
            'lfeID': '12345',
            'lvl': 1
          });
      test_node.appendChild(list_item);
    });

    afterEach(function() {
      TestUtils.removeTestHTMLElement(test_node);
      list_item = undefined;
      ListFormatManager.reset();
    });

    describe('Decorate a List Item', function() {
      it('Should set the list properties', function() {
        expect(list_item.getAttribute('qowt-entry')).toBe('12345');
        expect(list_item.getAttribute('qowt-template')).toBe('54321');
        expect(list_item.getAttribute('qowt-lvl')).toBe('1');
        expect(list_item.classList.contains('qowt-li-54321_1')).toBe(true);
        expect(list_item.getAttribute('qowt-list-type')).toBe('b');
      });
    });

    describe('Un-Decorate a List Item', function() {
      it('Should unset the list properties', function() {
        list_item.setAttribute('qowt-entry', '67890');
        list_item.setAttribute('qowt-template', '09876');
        list_item.setAttribute('qowt-lvl', 1);
        list_item.classList.add('qowt-li-09876_1');
        list_item.setAttribute('qowt-list-type', 'b');
        ListItemDecorator.undecorate(list_item);
        expect(list_item.getAttribute('qowt-entry')).toBe(null);
        expect(list_item.getAttribute('qowt-template')).toBe(null);
        expect(list_item.getAttribute('qowt-lvl')).toBe(null);
        expect(list_item.classList.contains('qowt-li-09876_1')).toBe(false);
        expect(list_item.getAttribute('qowt-list-type')).toBe(null);
      });
    });
  });
});
