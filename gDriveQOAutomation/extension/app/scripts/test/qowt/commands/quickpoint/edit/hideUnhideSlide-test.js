define([
  'qowtRoot/commands/quickpoint/edit/hideUnhideSlide',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/widgets/point/thumbnailStrip',
  'test/qowt/commands/commandTestUtils',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(
    SldShowCmd,
    ArrayUtils,
    ThumbnailStrip,
    CommandUtils,
    EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "hideUnhideSlide" Command', function() {

    var commandData_, command_;

    beforeEach(function() {
      commandData_ = {
        slideNumbers: ['1'],
        showSlide: true
      };
      command_ = SldShowCmd.create(commandData_);
    });

    afterEach(function() {
      commandData_ = undefined;
      command_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(command_.name, 'showSld', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          SldShowCmd.create(commandData_);
        }, Error, 'should not throw error during creation');
      });

      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            /* Missing all args*/
            context: undefined,
            errorMsg: 'Hide slide cmd missing command'
          },
          {
            // Missing showSlide
            context: {slideNumbers: [1]},
            errorMsg: 'Hide slide cmd missing showSlide state'
          },
          {
            // Missing slideNumbers
            context: {showSlide: true},
            errorMsg: 'Hide slide cmd missing slideNumbers'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            SldShowCmd, invalidContexts);
      });
    });

    describe('changeHtml and doRevert', function() {

      var slide;

      beforeEach(function() {
        slide = {
          setHiddenInSlideShow: function() {
          }
        };

        sinon.stub(ThumbnailStrip, 'thumbnail').returns(slide);
        sinon.stub(slide, 'setHiddenInSlideShow');
      });

      afterEach(function() {
        ThumbnailStrip.thumbnail.restore();
        slide.setHiddenInSlideShow.restore();
        slide = undefined;
      });

      describe('changeHtml:', function() {
        it('should hide slides if state is false', function() {
          var hide_context = {
            slideNumbers: [1],
            showSlide: false
          };
          var hideCommand = SldShowCmd.create(hide_context);
          hideCommand.changeHtml();
          assert.isTrue(
              slide.setHiddenInSlideShow.calledWith(true),
              'setHiddenInSlideShow called with correct parameters');
        });

        it('should unhide slides if state is true', function() {
          command_.changeHtml();
          assert.isTrue(
              slide.setHiddenInSlideShow.calledWith(false),
              'setHiddenInSlideShow called with correct parameters');
        });
      });

      describe('doRevert:', function() {
        it('should be able to revert the command if requested to unhide the ' +
            'slide', function() {
              var hide_context = {
                slideNumbers: [1],
                showSlide: false
              };
              var hideCommand = SldShowCmd.create(hide_context);
              hideCommand.doRevert();
              assert.isTrue(
                  slide.setHiddenInSlideShow.calledWith(false),
                  'revert command to hide the slide');
            });

        it('should be able to revert the command if requested to hide the ' +
            'slide', function() {
              command_.doRevert();
              assert.isTrue(
                  slide.setHiddenInSlideShow.calledWith(true),
                  'revert command to unhide the slide');
            });
      });

    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(command_.dcpData, 'showSld.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = command_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = command_.dcpData();
        assert.strictEqual(data.name, 'showSld', 'name values are equal');
      });

      it('should return proper dcp data', function() {
        var data = command_.dcpData();
        assert.isTrue(ArrayUtils.equal(data.slideNumbers, ['1']),
            'slideNumbers are equal');
        assert.isTrue(data.showSlide, 'showSlide is true');
      });
    });

    describe('Hide unhide Slide editCommandStandardAsserts', function() {
      it('should pass standard edit command asserts', function() {
        EditCommandStandardAsserts.standard(command_);
        EditCommandStandardAsserts.asCallsService(command_, true);
        EditCommandStandardAsserts.asOptimistic(command_, true, true);
      });
    });

    describe('Hide slide undo initiated command', function() {
      it('should pass standard edit command assert for undo initiated command',
          function() {
            commandData_.type = 'dcpCommand';
            var command = SldShowCmd.create(commandData_);

            EditCommandStandardAsserts.standard(command);
            EditCommandStandardAsserts.asCallsService(command, false);
            EditCommandStandardAsserts.asOptimistic(command, true, false);
          });
    });
  });
});
