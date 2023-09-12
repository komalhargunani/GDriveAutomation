define([
  'qowtRoot/commands/drawing/deleteShape',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts',
  'test/qowt/commands/commandTestUtils'
], function(
    DeleteShape,
    EditCommandStandardAsserts,
    CommandUtils) {

  'use strict';

  describe('Point: "deleteShape" Command', function() {

    var context_, containerWidget_, cmd_;

    beforeEach(function() {
      containerWidget_ = {
        removeShape: function() {}
      };
      context_ = {
        'action': 'deleteShape',
        'command': {
          eid: 'E123'
        }
      };
      cmd_ = DeleteShape.create(context_, containerWidget_, 1);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
      containerWidget_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(cmd_.name, 'deleteShape', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          DeleteShape.create(context_, containerWidget_, 1);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Delete Shape cmd missing context'
          },
          {
            // Missing command
            context: {},
            errorMsg: 'Delete Shape cmd missing command'
          },
          {
            // Missing eid
            context: {command: {}},
            errorMsg: 'Delete Shape cmd missing shape eid'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            DeleteShape, invalidContexts);
      });

      it('should throw error if container widget is not available while' +
          ' creation', function() {
            assert.throws(
                function() {
                  DeleteShape.create(context_, undefined, 1);
                },
                undefined,
                'Delete Shape cmd missing container widget',
                'onFailure throws missing container widget error');
          });

      it('should throw error if container number is not available while' +
          ' creation', function() {
            assert.throws(
                function() {
                  DeleteShape.create(context_, containerWidget_);
                },
                undefined,
                'Delete Shape cmd missing container number',
                'onFailure throws missing container number error');
          });
    });

    describe('changeHtml:', function() {
      it('should call remove shape method of container widget' +
          ' in changeHtml', function() {
            sinon.spy(containerWidget_, 'removeShape');
            cmd_.changeHtml();
            assert.isTrue(
                containerWidget_.removeShape.calledOnce,
                'deleteShape method called');
            assert.isTrue(
                containerWidget_.removeShape.calledWith('E123'),
                'deleteShape method called with shape eid');
            containerWidget_.removeShape.restore();
          });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'deleteShape.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'deleteShape', 'name values are equal');
      });

      it('should define eid property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(
            data.eid, context_.command.eid,
            'eid values are equal');
      });

      it('should define the containerNumber property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.cn, 1, 'containerNumber values are equal');
      });
    });

    describe('Delete shape editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
        EditCommandStandardAsserts.asOptimistic(cmd_, false, false);
      });
    });

    describe('Delete shape undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated' +
          ' command', function() {
            context_.command.type = 'dcpCommand';
            cmd_ = DeleteShape.create(context_, containerWidget_, 1);

            EditCommandStandardAsserts.standard(cmd_);
            EditCommandStandardAsserts.asCallsService(cmd_, false);
            EditCommandStandardAsserts.asOptimistic(cmd_, true, false);
          });
    });
  });
});
