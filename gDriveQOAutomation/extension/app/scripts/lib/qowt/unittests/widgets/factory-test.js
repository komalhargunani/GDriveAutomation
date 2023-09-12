define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils'
], function(
  TestUtils,
  WidgetFactory,
  ArrayUtils) {

  'use strict';

  afterEach(function() {
    WidgetFactory.unregisterWidgets();
  });

  describe("WidgetFactory", function() {

    beforeEach(function() {
      TestUtils.createTestAppendArea();

      // register our mock widget
      WidgetFactory.register({
        create: function() {
          return {
            'name': 'MockWidget'
          };
        },
        supportedActions: ['mock'],
        confidence: function(config) {
          // First check that we match the required feature set.
          if (config.supportedActions &&
            !ArrayUtils.subset(config.supportedActions, ['mock'])) {
            return 0;
          }
          // now make sure the fromNode is 'one of us'
          if (config.fromNode && config.fromNode.nodeName &&
            config.fromNode.nodeName.toLowerCase() === 'p') {
            return 100;
          }
          // support if parent is 'p'
          var parent = config.fromNode && config.fromNode.parentNode;
          if (parent && parent.nodeName &&
            parent.nodeName.toLowerCase() === 'p') {
            return 90;
          }
        }
      });
    });
    afterEach(function() {
      TestUtils.removeTestAppendArea();
    });

    describe('Abstract Widget Factory', function() {

      describe('WidgetFactory.create', function() {

        it('should return an instance of the widget with the highest ' +
          'confidence score', function() {
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '-10 widget instance'
                };
              },
              'confidence': function() {
                return -10;
              },
              'name': '-10 widget factory',
              'supportedActions': []
            });
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '0 widget instance'
                };
              },
              'confidence': function() {
                return 0;
              },
              'name': '0 widget factory',
              'supportedActions': []
            });
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '100 widget instance'
                };
              },
              'confidence': function() {
                return 100;
              },
              'name': '100 widget factory',
              'supportedActions': []
            });
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '90 widget instance'
                };
              },
              'confidence': function() {
                return 90;
              },
              'name': '90 widget factory',
              'supportedActions': []
            });
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '80 widget instance'
                };
              },
              'confidence': function() {
                return 80;
              },
              'name': '80 widget factory',
              'supportedActions': []
            });
            var widgetInstance = WidgetFactory.create({});
            expect(widgetInstance.name).toBe('100 widget instance');
          });

        it('should return undefined if no factory has a confidence score',
          function() {
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '-10 widget instance'
                };
              },
              'confidence': function() {
                return -10;
              },
              'name': '-10 widget factory',
              'supportedActions': []
            });
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '0 widget instance'
                };
              },
              'confidence': function() {
                return 0;
              },
              'name': '0 widget factory',
              'supportedActions': []
            });
            var widgetInstance = WidgetFactory.create({});
            expect(widgetInstance).toBe(undefined);
          });

        it('should return only widgets that score 100 in strict mode',
          function() {
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '90 widget instance'
                };
              },
              'confidence': function() {
                return 90;
              },
              'name': '90 widget factory',
              'supportedActions': []
            });
            var widgetInstance = WidgetFactory.create({
              strict: true
            });
            expect(widgetInstance).toBe(undefined);
            WidgetFactory.register({
              'create': function() {
                return {
                  'name': '100 widget instance'
                };
              },
              'confidence': function() {
                return 100;
              },
              'name': '100 widget factory',
              'supportedActions': []
            });
            widgetInstance = WidgetFactory.create({
              strict: true
            });
            expect(widgetInstance.name).toBe('100 widget instance');
          });

      });
    });
  });
});