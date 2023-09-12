define([
  'qowtRoot/commands/drawing/insertSlideNote',
  'qowtRoot/widgets/factory',
  'test/qowt/commands/commandTestUtils'
], function(
    InsertSlideNote,
    WidgetFactory,
    CommandUtils) {

  'use strict';

  describe('Point: "insertSlideNote" Command', function() {

    var context_, cmd_;

    beforeEach(function() {
      var parentNode = {
        appendChild: function() {},
        removeChild: function() {},
        getElementById: function() {},
        querySelector: function() {}
      };
      context_ = {
        'command': {
          rootEl: parentNode,
          sn: 1
        }
      };
      cmd_ = InsertSlideNote.create(context_);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.equal(
            cmd_.name, 'insertSlideNote',
            'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide non-optimistic', function() {
        assert.isFalse(
            cmd_.isOptimistic(),
            'insertSlideNote.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(
            cmd_.callsService(),
            'insertSlideNote.callsService()');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          InsertSlideNote.create(context_);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Insert Slide Note cmd missing context'
          },
          {
            // Missing command
            context: {},
            errorMsg: 'Insert Slide Note cmd missing command'
          },
          {
            // Missing sn
            context: {command: {}},
            errorMsg: 'Insert Slide Note cmd missing slide number'
          },
          {
            // Missing rootEl
            context: {command: {sn: '1'}},
            errorMsg: 'Insert Slide Note cmd missing rootEl'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            InsertSlideNote, invalidContexts);
      });

    });

    describe('changeHtml:', function() {
      var textBody, notesDiv;
      beforeEach(function() {
        notesDiv = document.createElement('DIV');
        notesDiv.id = 'slide-notes-div';
        textBody = {
          activate: function() {
          }
        };
        sinon.stub(context_.command.rootEl, 'appendChild');
        sinon.stub(context_.command.rootEl, 'removeChild');
        sinon.stub(context_.command.rootEl, 'querySelector');
        sinon.stub(WidgetFactory, 'create').returns(textBody);
        sinon.stub(textBody, 'activate');
      });

      afterEach(function() {
        context_.command.rootEl.appendChild.restore();
        context_.command.rootEl.removeChild.restore();
        context_.command.rootEl.getElementById.restore();
        context_.command.rootEl.querySelector.restore();
        WidgetFactory.create.restore();
        textBody.activate.restore();
      });
      it('should call appendChild and removeChild methods when there is ' +
          'existing slide-notes-div in the parentNode', function() {
           sinon.stub(context_.command.rootEl, 'getElementById').
               returns(notesDiv);
           cmd_.changeHtml();
           assert.isTrue(context_.command.rootEl.appendChild.calledOnce,
               'appendChild method called');
           assert.isTrue(context_.command.rootEl.removeChild.calledOnce,
               'removeChild method called');
           assert.isTrue(WidgetFactory.create.calledOnce,
               'WidgetFactory create method called');
           assert.isTrue(textBody.activate.calledOnce,
               'textBody activate method called');
         });

      it('should not call removeChild methods when there is ' +
          'no existing slide-notes-div in the parentNode', function() {
           sinon.stub(context_.command.rootEl, 'getElementById').
               returns(null);
           cmd_.changeHtml();
           assert.isTrue(context_.command.rootEl.appendChild.calledOnce,
               'appendChild method called');
           assert.isFalse(context_.command.rootEl.removeChild.called,
               'removeChild method not called');
           assert.isTrue(WidgetFactory.create.calledOnce,
               'WidgetFactory create method called');
           assert.isTrue(textBody.activate.calledOnce,
               'textBody activate method called');
         });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(
            cmd_.dcpData,
            'insertSlideNote.dcpData()');
      });
      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });
      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'insertSlideNote',
            'name values are equal');
      });
      it('should define the slide number property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.sn, 1, 'slide number values are equal');
      });
    });
  });
});

