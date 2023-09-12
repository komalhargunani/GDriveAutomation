define([
  'qowtRoot/commands/drawing/formatObject',
  'qowtRoot/events/errors/point/pointEditError',
  'qowtRoot/pubsub/pubsub',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts',
  'test/qowt/commands/commandTestUtils'
], function(
    FormatObjectCmd,
    PointEditError,
    PubSub,
    EditCommandStandardAsserts,
    CommandUtils) {

  'use strict';

  describe('Point: "formatObject" Command', function() {

    var context_, shapeElement_, cmd_;

    beforeEach(function() {
      shapeElement_ = new QowtPointShape();
      context_ = {
        command: {
          node: shapeElement_,
          eid: 'E633',
          formatting: {
            ln: {
              w: 38100
            }
          },
          name: 'formatObject',
          sn: 1
        },
        contentType: 'shape'
      };
      cmd_ = FormatObjectCmd.create(context_);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
      shapeElement_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'formatObject', 'Command name');
      });
    });

    describe('create:', function() {
      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'formatObject missing context'
          },
          {
            // Missing command
            context: {},
            errorMsg: 'formatObject missing command object'
          },
          {
            // Missing eid or node
            context: {command: {}},
            errorMsg: 'formatObject missing eid or node'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            FormatObjectCmd, invalidContexts);
      });
    });

    describe('changeHtml:', function() {
      it('should decorate the shape in changeHtml', function() {
        sinon.stub(shapeElement_, 'decorate');
        var expectedProperties = {
          ln: {
            w: 38100
          }
        };
        cmd_.changeHtml();
        assert.isTrue(
            shapeElement_.decorate.calledWith(expectedProperties),
            'decorate method called with correct formatting');
        shapeElement_.decorate.restore();
      });
    });

    describe('onFailure:', function() {
      it('should handle the dcp failure', function() {
        sinon.stub(PointEditError, 'create').returns({});
        sinon.stub(PubSub, 'publish');
        cmd_.onFailure();
        assert.isTrue(
            PointEditError.create.calledWith('format_object_error', false),
            'decorate method called with correct formatting');
        assert.isTrue(
            PubSub.publish.calledWith('qowt:error', {}),
            'decorate method called with correct formatting');
        PointEditError.create.restore();
        PubSub.publish.restore();
      });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'formatObject.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'formatObject', 'name values are equal');
      });

      it('should define eid property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.eid, context_.command.eid, 'eids are equal');
      });
    });

    describe('Format object editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
        EditCommandStandardAsserts.asOptimistic(cmd_, true, true);
      });
    });

    describe('Format object undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated' +
          ' command', function() {
            context_.command.type = 'dcpCommand';
            cmd_ = FormatObjectCmd.create(context_);

            EditCommandStandardAsserts.standard(cmd_);
            EditCommandStandardAsserts.asCallsService(cmd_, false);
            EditCommandStandardAsserts.asOptimistic(cmd_, true, false);
          });
    });
  });
});
