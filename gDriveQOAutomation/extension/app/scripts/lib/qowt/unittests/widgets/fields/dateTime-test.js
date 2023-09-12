/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the DateTime widget
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/fields/dateTime',
  'qowtRoot/utils/dateFormatter'
], function(
    Factory,
    DateTimeWidget,
    DateFormatter) {

  'use strict';

  describe('DateTime Widget Factory', function() {

    beforeEach(function() {});
    afterEach(function() {});

    it('should return 0 when "confidence" is called with null config',
        function() {
          var ret = DateTimeWidget.confidence();
          expect(ret).toBe(0);
        });

    it('should create a widget instance for correctly structured dateTime ' +
        'config', function() {
          var widget = DateTimeWidget.create({
            newFieldId: 'E1',
            format: 'mm/dd/yyyy'
          });
          expect(widget).not.toBe(undefined);
        });

    it('should return undefined when attempting to construct from incorrect ' +
        'config', function() {
          var widget = DateTimeWidget.create({});
          expect(widget).toBe(undefined);
        });

    it('should keep only one child node for widget node, removing others if ' +
        'exists; when update is invoked on field widget', function() {

          var config = {
            newFieldId: 'E1',
            format: 'mm/dd/yyyy',
            lang: 'en'
          };
          var widget = DateTimeWidget.create(config);
          var dummyDiv = document.createElement('div');
          widget.appendTo(dummyDiv);

          // create spans and add them to widget node
          var span1 = document.createElement('span');
          var span2 = document.createElement('span');
          var span3 = document.createElement('span');


          widget.getWidgetElement().appendChild(span1);
          widget.getWidgetElement().appendChild(span2);
          widget.getWidgetElement().appendChild(span3);
          widget.update();
          expect(widget.getWidgetElement().childNodes.length).toEqual(1);

          expect(widget.getWidgetElement().firstChild).toBe(span1);

        });

    it('should create different output for different languages', function() {
      // NOTE: we are not testing the actual language translations here
      // that should be tested in the DateFormatter unit tests. We merely
      // verify that we call the formatter with the correct language setting
      var dummyDate = {
        getTime: function() { return 'dummy Time'; }
      };

      spyOn(window, 'Date').andReturn(dummyDate);
      spyOn(DateFormatter, 'formatDate');

      var config1 = {
        newFieldId: 'E1',
        format: 'mm/dd/yyyy',
        lang: 'en'
      };
      var config2 = {
        newFieldId: 'E2',
        format: 'mm/dd/yyyy',
        lang: 'it'
      };

      var widget1 = DateTimeWidget.create(config1);
      var widget2 = DateTimeWidget.create(config2);
      var dummyDiv1 = document.createElement('div');
      var dummyDiv2 = document.createElement('div');
      widget1.appendTo(dummyDiv1);
      widget2.appendTo(dummyDiv2);

      // add a content node to the date widget node so that it can
      // be updated with the actual fomatted date
      widget1.getWidgetElement().appendChild(document.createElement('span'));
      widget2.getWidgetElement().appendChild(document.createElement('span'));

      widget1.update();
      expect(DateFormatter.formatDate).toHaveBeenCalledWith(config1.format,
          dummyDate, config1.lang);

      widget2.update();
      expect(DateFormatter.formatDate).toHaveBeenCalledWith(config2.format,
          dummyDate, config2.lang);
    });

    it('should ensure the dateTime field is non-editable', function() {
      var dummyDiv = document.createElement('div');
      var widget = DateTimeWidget.create({
        newFieldId: 'e1',
        format: 'hh:mm'
      });
      widget.appendTo(dummyDiv);
      expect(dummyDiv.firstChild.getAttribute('contenteditable')).toBe('false');
    });

    it('should construct an instance from existing html', function() {
      var dummyDiv = document.createElement('div');
      var widget = DateTimeWidget.create({
        newFieldId: 'e1',
        format: 'hh:mm'
      });
      widget.appendTo(dummyDiv);

      var widgetFromNode = DateTimeWidget.create({
        fromNode: dummyDiv.firstChild
      });
      expect(widgetFromNode).not.toBe(undefined);
      expect(widgetFromNode.getEid()).toBe(widget.getEid());
    });

    it('should return undefined when attempting to construct from wrong html',
       function() {
         var dummyDiv = document.createElement('div');
         var widgetFromNode = DateTimeWidget.create({
           fromNode: dummyDiv
         });
         expect(widgetFromNode).toBe(undefined);
       });


    describe('DateTime Widget API', function() {

      beforeEach(function() {});
      afterEach(function() {});

      it('should support widget factory creation', function() {
        // NOTE: this test uses the Factory, and thus is dependent
        // on it's inner workings. Ideally tests do not depend on
        // other modules like this, but for a quick factory test
        // this will do
        var dummyDiv = document.createElement('div');
        var widget = DateTimeWidget.create({
          newFieldId: 'e1',
          format: 'hh:mm'
        });
        widget.appendTo(dummyDiv);

        var widgetFromFactory = Factory.create({
          fromNode: dummyDiv.firstChild
        });
        expect(widgetFromFactory).not.toBe(undefined);
        expect(widgetFromFactory.getEid()).toBe(widget.getEid());
      });

      it('should return the correct eid of the dateTime field', function() {
        var widget = DateTimeWidget.create({
          newFieldId: 'e1',
          format: 'hh:mm'
        });
        expect(widget.getEid()).toBe('e1');
      });

      it('should return the correct node as widget element', function() {
        var dummyDiv = document.createElement('div');
        var widget = DateTimeWidget.create({
          newFieldId: 'e1',
          format: 'hh:mm'
        });
        widget.appendTo(dummyDiv);
        expect(widget.getWidgetElement()).toBe(dummyDiv.firstChild);
      });

      it('should append itself to a node when told do so', function() {
        var dummyDiv = document.createElement('div');
        var widget = DateTimeWidget.create({
          newFieldId: 'e1',
          format: 'hh:mm'
        });

        expect(dummyDiv.childNodes.length).toBe(0);
        widget.appendTo(dummyDiv);
        expect(dummyDiv.childNodes.length).toBe(1);
      });
    });

  });

  return {};
});

