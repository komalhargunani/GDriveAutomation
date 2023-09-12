define([
  'qowtRoot/commands/drawing/addShape',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(
    AddShape,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "addShape" Command', function() {

    var context_, containerWidget_, cmd_;

    beforeEach(function() {
      containerWidget_ = {
        addShape: function() {},
        removeShape: function() {}
      };
      context_ = {
        'command': {
          sp: {
            shapeId: '1',
            prstId: '88',
            transforms: {
              ext: {x: 10, y: 10},
              off: {x: 10, y: 10}
            }
          }
        }
      };
      cmd_ = AddShape.create(context_, containerWidget_, 1);
    });

    afterEach(function() {
      cmd_ = undefined;
      context_ = undefined;
      containerWidget_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.equal(
            cmd_.name, 'insertShape',
            'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isTrue(
            cmd_.isOptimistic(),
            'addShape.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(
            cmd_.callsService(),
            'addShape.callsService()');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          AddShape.create(context_, containerWidget_, 1);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Add Shape cmd missing context'
          },
          {
            // Missing command
            context: {},
            errorMsg: 'Add Shape cmd missing command'
          },
          {
            // Missing eid
            context: {command: {}},
            errorMsg: 'Add Shape cmd missing shape Json'
          }
        ];
        CommandUtils.expectInvalidConstructionContextsToThrow(
            AddShape, invalidContexts);
      });

      it('should throw error if container widget is not available while' +
          ' creation', function() {
            assert.throws(
                function() {
                  AddShape.create(context_, undefined, 1);
                },
                undefined,
                'Add Shape cmd missing container widget',
                'onFailure throws missing container widget error');
          });

      it('should throw error if container number is not available while' +
          ' creation', function() {
            assert.throws(
                function() {
                  AddShape.create(context_, containerWidget_);
                },
                undefined,
                'Add Shape cmd missing container number',
                'onFailure throws missing container number error');
          });
    });

    describe('changeHtml:', function() {
      it('should call add shape method of container widget' +
          ' in changeHtml', function() {
            sinon.stub(containerWidget_, 'addShape', function() {
              return {
                getAttribute: function() {}
              };
            });
            cmd_.changeHtml();
            assert.isTrue(
                containerWidget_.addShape.calledOnce,
                'addShape method called');
            containerWidget_.addShape.restore();
          });
    });

    describe('doRevert:', function() {
      it('should call remove shape method of container widget' +
          ' in doRevert', function() {
            sinon.spy(containerWidget_, 'removeShape');
            cmd_.doRevert();
            assert.isTrue(
                containerWidget_.removeShape.calledOnce,
                'removeShape method called');
            containerWidget_.removeShape.restore();
          });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(
            cmd_.dcpData,
            'addShape.dcpData()');
      });
      it('should return a JSON object', function() {
        var data = cmd_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });
      it('should define the name property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.name, 'insertShape', 'name values are equal');
      });
      it('should define the prevSibling property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.siblingId, -1, 'sibling Id values are equal');
      });
      it('should define the shapeJson property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.sp, context_.command.sp,
            'shapeJSON values are equal');
      });
      it('should define the containerNumber property', function() {
        var data = cmd_.dcpData();
        assert.strictEqual(data.cn, 1, 'containerNumber values are equal');
      });
    });


    describe('Add shape editCommandStandardAsserts:', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(cmd_);
        EditCommandStandardAsserts.asOptimistic(cmd_, true, true);
        EditCommandStandardAsserts.asCallsService(cmd_, true);
      });
    });

    describe('Add shape undo initiated command:', function() {
      it('should pass standard edit command assert for undo initiated' +
          ' command', function() {
            context_.command.type = 'dcpCommand';
            cmd_ = AddShape.create(context_, containerWidget_, 1);

            EditCommandStandardAsserts.standard(cmd_);
            EditCommandStandardAsserts.asCallsService(cmd_, false);
            EditCommandStandardAsserts.asOptimistic(cmd_, true, false);
          });
    });
  });
});

