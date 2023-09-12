define([
  'qowtRoot/models/env',
  'common/elements/ui/formatButton/formatButton'
], function(
    EnvModel
    /* format button itself */) {

  'use strict';

  describe('QowtFormatButton Polymer Element', function() {
    var formatButton, api_, originalModel;

    before(function() {
      api_ = {
        is: 'format-button-test-element',
        behaviors: [ QowtFormatButtonBehavior ]
      };

      Polymer(api_);
      originalModel = EnvModel.app;
      EnvModel.app = 'word';
    });

    after(function() {
      api_ = undefined;
      //reset to default app instead of undefining it.
      EnvModel.app = originalModel;
    });

    describe('Test Creation', function() {
      beforeEach(function() {
        this.stampOutTempl('format-button-test-template');
        formatButton = document.querySelector('format-button-test-element');
      });


      afterEach(function() {
        formatButton = undefined;
      });


      it('should have the value of empty string for widgetFormat', function() {
        assert.strictEqual(formatButton.widgetFormat, '',
            'widgetFormat should be an empty string');
      });
    });

    /** TODO: This should be a generic test once we similar signals for
             Word,Point and Sheet
    */
    describe('Test Signals', function() {
      var signalToCallbackMap;

      afterEach(function() {
        signalToCallbackMap = undefined;
        formatButton = undefined;
      });


      describe('For Word', function() {
        beforeEach(function() {
          //Assumes word as default app.
          this.stampOutTempl('format-button-test-template');
          formatButton = document.querySelector('format-button-test-element');
          signalToCallbackMap = formatButton.getSignalToCallbackMap();
        });


        it('should have the correct PubSub signal in callback map', function() {
          assert.isTrue(_.isObject(signalToCallbackMap),
              'signalToCallbackMap should be an object');
          assert.isTrue('qowt:transientModelUpdate' in signalToCallbackMap,
              'map should have transient model update signal');
          assert.isTrue('qowt:selectionChanged' in signalToCallbackMap,
              'map should have selection changed signal');
        });


        it('should have callback function associated to signals', function() {
          assert.isTrue(
              _.isFunction(signalToCallbackMap['qowt:transientModelUpdate']),
              'transient model update should have an associated function');
          assert.isTrue(
              _.isFunction(signalToCallbackMap['qowt:selectionChanged']),
              'selection changed should have  an associated function');
        });
      });

      describe('For Sheet', function() {
        beforeEach(function() {
          //override the default app.
          EnvModel.app = 'sheet';
          this.stampOutTempl('format-button-test-template');
          formatButton = document.querySelector('format-button-test-element');
          signalToCallbackMap = formatButton.getSignalToCallbackMap();
        });


        it('should have the correct PubSub signal in callback map', function() {
          assert.isTrue(_.isObject(signalToCallbackMap),
              'signalToCallbackMap should be an object');
          assert.isTrue('qowt:selectionChanged' in signalToCallbackMap,
              'map should have selection change signal');
          assert.isTrue('qowt:formattingChanged' in signalToCallbackMap,
              'map should have formattingChanged signal');
        });


        it('should have callback function associated to signals', function() {
          assert.isTrue(
              _.isFunction(signalToCallbackMap['qowt:selectionChanged']),
              'selection changed should have an associated function');
          assert.isTrue(
              _.isFunction(signalToCallbackMap['qowt:formattingChanged']),
              'formattingChanged should have an associated function');
        });
      });
    });
  });
});