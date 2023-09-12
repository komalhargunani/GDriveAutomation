define([
  'qowtRoot/commands/quickpoint/edit/moveSlide',
  'qowtRoot/widgets/point/thumbnailStrip',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(
    MoveSlideCommand,
    ThumbnailStripWidget,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "moveSlide" Command', function() {

    var context_, command_;

    beforeEach(function() {
      context_ = {
        command: {
          slideNumbers: ['1'],
          moveSlideToPosition: 2
        },
        position: 'down'
      };
      command_ = MoveSlideCommand.create(context_);
    });

    afterEach(function() {
      context_ = undefined;
      command_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(command_.name, 'moveSld', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          MoveSlideCommand.create(context_);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: {command: undefined},
            errorMsg: 'Move slide command missing command data'
          },
          {
            // Missing slideNumbers
            context: {command: {moveSlideToPosition: 4}},
            errorMsg: 'Move slide cmd missing slideNumbers'
          },
          {
            // Missing moveSlideToPosition
            context: {command: {slideNumbers: ['1']}},
            errorMsg: 'Move slide cmd missing moveSlideToPosition'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            MoveSlideCommand, invalidContexts);
      });
    });

    describe('changeHtml:', function() {
      it('should move slide on changeHtml', function() {
        sinon.stub(ThumbnailStripWidget, 'moveSlides');
        command_.changeHtml();
        var command = context_.command;

        assert.isTrue(
            ThumbnailStripWidget.moveSlides.calledWith(
                command.slideNumbers, command.moveSlideToPosition,
                context_.position), 'ThumbnailStripWidget.moveSlides called ' +
                'with correct parameters');
        ThumbnailStripWidget.moveSlides.restore();
      });
    });

    describe('doRevert:', function() {
      it('should move slide on doRevert', function() {
        //Mock the thumbnail
        var thumbnail = {
          getSlideIndex: function() {return 1;}
        };

        sinon.stub(ThumbnailStripWidget, 'thumbnail').returns(thumbnail);
        var moveCommand = MoveSlideCommand.create(context_);

        sinon.stub(ThumbnailStripWidget, 'reorderThumbnails');
        moveCommand.doRevert();

        assert.isTrue(
            ThumbnailStripWidget.reorderThumbnails.calledWith(1, 0),
            'ThumbnailStripWidget.reorderThumbnails called with correct ' +
                'parameters');
        ThumbnailStripWidget.thumbnail.restore();
        ThumbnailStripWidget.reorderThumbnails.restore();
      });
    });

    describe('dcpData:', function() {
      var data;

      beforeEach(function() {
        data = command_.dcpData();
      });

      afterEach(function() {
        data = undefined;
      });

      it('should override dcpData', function() {
        assert.isFunction(command_.dcpData, 'moveSld.dcpData()');
      });

      it('should return a JSON object', function() {
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        assert.strictEqual(data.name, 'moveSld', 'name values are equal');
      });
    });

    describe('Move Slide editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(command_);
        EditCommandStandardAsserts.asCallsService(command_, true);
        EditCommandStandardAsserts.asOptimistic(command_, true, true);
      });
    });

    describe('Move slide undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated ' +
          'command', function() {
            context_.command.type = 'dcpCommand';
            var command = MoveSlideCommand.create(context_);

            EditCommandStandardAsserts.standard(command);
            EditCommandStandardAsserts.asCallsService(command, false);
            EditCommandStandardAsserts.asOptimistic(command, true, false);
          });
    });
  });
});
