define([
  'qowtRoot/api/pointAPI',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/domUtils',
  'qowtRoot/models/point',
  'qowtRoot/models/transientFormatting',
  'qowtRoot/controls/point/thumbnailStrip',
  'qowtRoot/controls/point/slide',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/widgets/point/slideNotesSplitter',
  'qowtRoot/widgets/point/slidenotes',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/utils/domListener',
  'qowtRoot/controls/point/animation/transitionManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/presentation/slideZoomManager'
], function(
    PointAPI,
    Presentation,
    SelectionManager,
    DomTextSelection,
    DomUtils,
    PointModel,
    TransientFormattingModel,
    ThumbnailStripControl,
    SlideControl,
    SlidesContainer,
    SlideNotesSplitter,
    SlideNotes,
    ThumbnailStrip,
    DomListener,
    TransitionManager,
    PubSub,
    SlideZoomManager) {

  'use strict';

  describe('Point: Presentation Control', function() {

    var sandbox_, slidesContainerNode_, rootContainer_;
    beforeEach(function() {
      rootContainer_ = {
        appendChild: function() {}
      };
      sandbox_ = sinon.sandbox.create();
      slidesContainerNode_ = {
        addEventListener: function() {}
      };

      sandbox_.stub(DomUtils, 'contains').returns(true);
      sandbox_.stub(TransientFormattingModel, 'update');
      sandbox_.stub(ThumbnailStripControl, 'init');
      sandbox_.stub(ThumbnailStripControl, 'appendTo');
      sandbox_.stub(SlideControl, 'init');
      sandbox_.stub(SlideControl, 'appendTo');
      sandbox_.stub(SlideControl, 'addListenerToSlideNote');
      sandbox_.stub(SlidesContainer, 'node').returns(slidesContainerNode_);
      sandbox_.stub(SlideNotesSplitter, 'init');
      sandbox_.stub(SlideNotesSplitter, 'appendTo');
      sandbox_.stub(SlideNotesSplitter, 'height');
      sandbox_.stub(SlideNotes, 'init');
      sandbox_.stub(SlideNotes, 'appendTo');
      sandbox_.spy(DomListener, 'add');
      sandbox_.stub(TransitionManager, 'init');
      sandbox_.stub(TransitionManager, 'setSlideShowAPI');
      sandbox_.stub(window, 'setTimeout');
      sandbox_.spy(PubSub, 'publish');
    });

    afterEach(function() {
      rootContainer_ = undefined;
      sandbox_.restore();
      sandbox_ = undefined;
      slidesContainerNode_ = undefined;
    });

    describe('init:', function() {
      var range_, selection_, selectionChangeEvt_;
      beforeEach(function() {
        range_ = {
          startContainer: new QowtPointPara(),
          endContainer: new QowtPointPara()
        };
        selection_ = {contentType: 'text'};

        // generate a selectionchange event
        selectionChangeEvt_ = document.createEvent('Event');
        selectionChangeEvt_.initEvent('selectionchange', true, false);

        sandbox_.stub(SelectionManager, 'getSelection').returns(selection_);
      });

      afterEach(function() {
        range_ = undefined;
        selection_ = undefined;
        selectionChangeEvt_ = undefined;
      });

      it('should updateSelection only if startContainer and endContainer are ' +
          'present in context', function() {
            sandbox_.stub(DomTextSelection, 'getRange').returns(range_);
            Presentation.init(rootContainer_);

            document.dispatchEvent(selectionChangeEvt_);

            assert.strictEqual(PubSub.publish.getCall(0).args[0],
                'qowt:updateSelection', 'selection updated');
          });

      it('should not updateSelection if endContainer is undefined in context',
          function() {
            range_.endContainer = undefined;
            sandbox_.stub(DomTextSelection, 'getRange').returns(range_);
            Presentation.init(rootContainer_);

            document.dispatchEvent(selectionChangeEvt_);

            assert.isTrue(PubSub.publish.notCalled, 'selection not updated');
          });

      it('should not updateSelection if startContainer is undefined in context',
          function() {
            range_.startContainer = undefined;
            sandbox_.stub(DomTextSelection, 'getRange').returns(range_);
            Presentation.init(rootContainer_);

            document.dispatchEvent(selectionChangeEvt_);

            assert.isTrue(PubSub.publish.notCalled, 'selection not updated');
          });

      it('should set endParaRPr properties to span on selection change event',
          function() {
            sandbox_.stub(DomTextSelection, 'getRange').returns(range_);

            Presentation.init(rootContainer_);
            range_.startContainer.model.endParaRPr = {siz: 28};

            document.dispatchEvent(selectionChangeEvt_);

            var expectedContext = {
              action: 'endParaRpr',
              context: {formatting: range_.startContainer.model.endParaRPr}
            };
            assert.isTrue(
                TransientFormattingModel.update.calledOnce,
                'update method called');

            assert.deepEqual(
                TransientFormattingModel.update.firstCall.args[0],
                expectedContext,
                'TransientFormattingModel.update called with correct params');
          });
    });

    describe('keydown handling', function() {
      var arrowKeyDownEvent_, selection_;
      beforeEach(function() {
        Presentation.init(rootContainer_);
        selection_ = {contentType: 'slideManagement'};
        sandbox_.stub(SelectionManager, 'getSelection').returns(selection_);
        arrowKeyDownEvent_ = document.createEvent('Event');
        arrowKeyDownEvent_.initEvent('keydown', true, false);
        arrowKeyDownEvent_.keyCode = 40;
      });

      afterEach(function() {
        arrowKeyDownEvent_ = undefined;
      });

      it('arrow key down should not do anything meta key is pressed',
          function() {
            arrowKeyDownEvent_.metaKey = true;
            document.dispatchEvent(arrowKeyDownEvent_);
            assert.isFalse(
                PubSub.publish.calledWith('qowt:clearSlideSelection'),
                'slide selection not published');
          });

      it('arrow key down should not do anything control key is pressed',
          function() {
            arrowKeyDownEvent_.ctrlKey = true;
            document.dispatchEvent(arrowKeyDownEvent_);
            assert.isFalse(
                PubSub.publish.calledWith('qowt:clearSlideSelection'),
                'slide selection not published');
          });
    });

    describe('getSlide request', function() {

      var mockThumb_, innerNode_;

      beforeEach(function() {
        Presentation.init(rootContainer_);
        sandbox_.stub(SlidesContainer, 'setSlide');
        sandbox_.stub(SlideZoomManager, 'zoomToFit');
        sandbox_.stub(SlideNotes, 'getSlideNotesNode').returns({
          hasChildNodes: function() {}
        });

        // Mock thumbnail widget
        innerNode_ = document.createElement('div');
        mockThumb_ = {
          isRequested: false,
          innerNode: function() {
            return innerNode_;
          },
          isLoaded: function() {
            return false;
          },
          showSlide: function() {
          }
        };
        sandbox_.stub(ThumbnailStrip, 'thumbnail').returns(mockThumb_);
        sandbox_.stub(PointAPI, 'getSlide');
      });

      afterEach(function() {
        mockThumb_ = undefined;
        innerNode_ = undefined;
      });

      it('should request for getSlide if not already requested', function() {
        PubSub.publish('qowt:pointSetSlide', {slide: 0});
        assert.strictEqual(PointAPI.getSlide.getCall(0).args[0], innerNode_,
            'data requested for correct thumb');
        assert.strictEqual(PointAPI.getSlide.getCall(0).args[1], 1,
            'data requested with correct slide index');
        assert.isTrue(mockThumb_.isRequested, 'isRequested flag set to true');
      });

      it('should not request for getSlide if already requested', function() {
        mockThumb_.isRequested = true;
        PubSub.publish('qowt:pointSetSlide', {});
        assert.isTrue(PointAPI.getSlide.notCalled, 'request not made');
      });
    });
  });

  describe('Verify exiting slide show mode', function() {

    var sandbox_, rootContainer_;
    beforeEach(function() {
      rootContainer_ = {
        appendChild: function() {}
      };
      PointModel.slideShowMode = true;

      sandbox_ = sinon.sandbox.create();
      // While initializing the slidesContainer, a PaperToast element is created
      // The PaperToast adds an iron-announcer in document's body. Stubbing this
      // here as it is not required in this test and to avoid leaking of nodes.
      sandbox_.stub(Polymer.IronA11yAnnouncer, 'requestAvailability');
      sandbox_.stub(Presentation, 'calculateThumbnailsWindow');
      sandbox_.stub(SlideZoomManager, 'zoomToFit');
      sandbox_.spy(PubSub, 'publish');
      sandbox_.stub(TransitionManager, 'init');
    });

    afterEach(function() {
      rootContainer_ = undefined;
      sandbox_.restore();
      sandbox_ = undefined;
    });

    it('should call calculateThumbnailsWindow and zoomToFit after slide' +
        ' show is stopped', function() {
      Presentation.init(rootContainer_);
      var slidesContainerNode = SlidesContainer.node();
      var evt = document.createEvent('Event');
      evt.initEvent('webkitfullscreenchange', true, false);
      slidesContainerNode.dispatchEvent(evt);
      assert.isTrue(PubSub.publish.calledWith('qowt:slideShowStopped'));
      assert.isTrue(PubSub.publish.calledWith('qowt:pointSetSlide'));
      assert.isTrue(Presentation.calculateThumbnailsWindow.called,
          'calculateThumbnailsWindow method called');
      assert.isTrue(SlideZoomManager.zoomToFit.called,
          'zoomToFit method called');
    });
  });
});
