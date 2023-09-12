define([
  'qowtRoot/controls/point/presentation',
  'qowtRoot/controls/point/animation/animationRequestHandler',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/controls/point/animation/transitionManager',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/env',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/point/thumbnailStrip',
  'qowtRoot/api/pointAPI',
  'qowtRoot/models/point',
  'qowtRoot/features/utils',
  'qowtRoot/utils/mockKeyboard/keyboard',
  'qowtRoot/utils/mockKeyboard/keys',
  'qowtRoot/interactiontests/waitHelper',
  'qowtRoot/commands/quickpoint/edit/deleteSlide',
  'qowtRoot/commands/quickpoint/edit/insertSlide',
  'qowtRoot/widgets/point/slidenotes',
  'qowtRoot/controls/viewLayoutControl',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr'
], function(
    Presentation,
    AnimationRequestHandler,
    ThumbnailStrip,
    SlidesContainer,
    TransitionManager,
    DomListener,
    EnvModel,
    UnittestUtils,
    PubSub,
    ThumbnailStripControl,
    PointAPI,
    PointModel,
    Features,
    Keyboard,
    keys,
    WaitFor,
    DeleteSlideCommand,
    InsertSlideCommand,
    SlideNotes,
    ViewLayoutControl,
    ThumbnailStripTool,
    SelectionManager,
    ThumbnailStripContentMgr) {

  'use strict';

  describe('point presentation control', function() {

    var rootContainer;
    var _testAppendArea = UnittestUtils.createTestAppendArea();

    beforeEach(function() {
      rootContainer = document.createElement('div');
      _testAppendArea.appendChild(rootContainer);
      rootContainer.main = { id: 'mainId' };
      rootContainer.thumbsChevron = { id: 'thumbsChevronId'};
      EnvModel.rootNode = UnittestUtils.createTestAppendArea();
    });

    afterEach(function() {
      UnittestUtils.removeTestHTMLElement(rootContainer);
      EnvModel.rootNode = undefined;
      UnittestUtils.flushTestAppendArea();
    });

    describe('Test initialization', function() {
      it('should throw if presentation.init() called multiple times',
          function() {
            Presentation.init(rootContainer);
            expect(Presentation.init).toThrow(
                'presentation.init() called multiple times.');
          });

      it('should append thumbnail to container div on init', function() {
        spyOn(ThumbnailStripControl, 'appendTo');
        Presentation.init(rootContainer);
        expect(ThumbnailStripControl.appendTo).toHaveBeenCalled();
      });

      it('should initialize thumbnailStripControl on init', function() {
        spyOn(ThumbnailStripControl, 'init').andCallThrough();
        Presentation.init(rootContainer);
        expect(ThumbnailStripControl.init).toHaveBeenCalled();
      });
    });

    describe('Test behavior', function() {
      beforeEach(function() {
        Presentation.init(rootContainer);
      });

      it('should prepare \'presentation\' div appropriately on ' +
          'Presentation.init', function() {
        var presentationDiv = rootContainer.firstChild;

        expect(presentationDiv.tagName).toBe('DIV');
        expect(presentationDiv.id).toBe('qowt-point-presentation');
        expect(presentationDiv.className).toBe('qowt-root');
        expect(presentationDiv.style.overflow).toBe('hidden');
        expect(presentationDiv.hasAttribute('spellcheck')).toBe(true);
        expect(presentationDiv.getAttribute('spellcheck')).toBe('false');
        expect(presentationDiv.childNodes.length).toBe(3);
        expect(presentationDiv.lastChild.nodeName).
            toBe('CORE-KEYBOARD-SHORTCUT');
        expect(EnvModel.rootNode).toEqual(presentationDiv);
      });

      /**
       * test for presentation widget's _slideShow object - stop() method
       */
      it('should call animation manager stop() method', function() {
        spyOn(TransitionManager, 'stop');
        Presentation.slideShow.stop();

        expect(TransitionManager.stop).toHaveBeenCalled();
      });

      it('should toggle shadow when entering slideShow mode', function() {
        spyOn(SlidesContainer, 'toggleShadow');
        Presentation.slideShowMode.enter();

        expect(SlidesContainer.toggleShadow).toHaveBeenCalled();
      });

      it('should toggle shadow when exiting slideShow mode', function() {
        spyOn(SlidesContainer, 'toggleShadow');
        Presentation.slideShowMode.exit();

        expect(SlidesContainer.toggleShadow).toHaveBeenCalled();
      });


      it('should add class qowt-uneditable if pointEdit is not enabled',
          function() {
            expect(rootContainer.className).toEqual(' qowt-uneditable');
          });


      it('should disable text selection when entering slideShow mode',
         function() {
           spyOn(SlidesContainer, 'disableTextSelection');
           Presentation.slideShowMode.enter();

           expect(SlidesContainer.disableTextSelection).toHaveBeenCalled();
         });

      it('should enable text selection when exiting slideShow mode',
          function() {
            spyOn(SlidesContainer, 'enableTextSelection');
            Presentation.slideShowMode.exit();

            expect(SlidesContainer.enableTextSelection).toHaveBeenCalled();
          });

      it('should set correct slide on "qowt:pointSetSlide" event', function() {
        ThumbnailStrip.createNumOfThumbs(1);
        var thumb = ThumbnailStrip.thumbnail(0);
        spyOn(PubSub, 'publish').andCallThrough();
        spyOn(PointAPI, 'getSlide');
        spyOn(thumb, 'showSlide');
        spyOn(SlidesContainer, 'setSlide');

        PubSub.publish('qowt:pointSetSlide', { 'slide': 0 });

        expect(PubSub.publish.mostRecentCall.args[0]).toBe(
            'qowt:contentReceived');
        expect(PointAPI.getSlide).toHaveBeenCalled();
        expect(thumb.showSlide).toHaveBeenCalled();
        expect(SlidesContainer.setSlide).toHaveBeenCalled();
      });

      it('should not send request to service to fetch slide data on ' +
          '"qowt:pointSetSlide" if it is already fetched', function() {
            ThumbnailStrip.createNumOfThumbs(1);
            var thumb = ThumbnailStrip.thumbnail(0);
            thumb.setLoaded(true);
            spyOn(PubSub, 'publish').andCallThrough();
            spyOn(PointAPI, 'getSlide');
            spyOn(thumb, 'showSlide');
            spyOn(SlidesContainer, 'setSlide');

            PubSub.publish('qowt:pointSetSlide', { 'slide': 0 });
            expect(PubSub.publish.calls[0].args[0]).toBe(
                'qowt:pointSetSlide');
            expect(PointAPI.getSlide).not.toHaveBeenCalled();
            expect(thumb.showSlide).toHaveBeenCalled();
            expect(SlidesContainer.setSlide).toHaveBeenCalled();
          });

      it('should set correct slide on "qowt:slideLoaded" event', function() {
        ThumbnailStrip.createNumOfThumbs(1);

        // Mock a thumbnail object
        var loaded = false;
        var visible = false;
        var innerNode = UnittestUtils.createTestAppendArea();
        var mockThumb = {
          innerNode: function() { return innerNode; },
          height: function() { return 0; },
          isVisible: function() { return visible; },
          isLoaded: function() { return loaded; },
          setLoaded: function(val) { loaded = val; },
          showSlide: function(val) { visible = val; },
          changeSlideInnerElementsId: function() {},
          handleParentShapes: function() {}
        };

        // Mock the thumbnail strip
        spyOn(ThumbnailStrip, 'thumbnail').andReturn(mockThumb);

        var thumb = ThumbnailStrip.thumbnail(0);
        spyOn(PubSub, 'publish').andCallThrough();
        spyOn(thumb, 'setLoaded');
        spyOn(thumb, 'changeSlideInnerElementsId');
        spyOn(thumb, 'handleParentShapes');

        var _rootNode = UnittestUtils.createTestAppendArea();

        var slideLoad = {'root': _rootNode, 'sn': 1};
        DomListener.dispatchEvent(EnvModel.rootNode, 'qowt:slideLoaded',
            slideLoad);

        expect(PubSub.publish.mostRecentCall.args[0]).toBe(
            'qowt:logBucket');
        expect(thumb.setLoaded).toHaveBeenCalled();
        expect(thumb.changeSlideInnerElementsId).toHaveBeenCalled();
        expect(thumb.handleParentShapes).toHaveBeenCalled();
      });

      it('should publish set slide before contentComplete', function() {
        // Mock PointModel
        PointModel.numberOfSlidesInPreso = 1;

        // Mock a thumbnail object
        var loaded = false;
        var visible = false;
        var innerNode = UnittestUtils.createTestAppendArea();
        var mockThumb = {
          innerNode: function() { return innerNode; },
          height: function() { return 0; },
          isVisible: function() { return visible; },
          isLoaded: function() { return loaded; },
          setLoaded: function(val) { loaded = val; },
          showSlide: function(val) { visible = val; },
          changeSlideInnerElementsId: function() {},
          handleParentShapes: function() {}
        };

        // Mock the thumbnail strip
        spyOn(ThumbnailStrip, 'createNumOfThumbs');
        spyOn(ThumbnailStrip, 'thumbnail').andReturn(mockThumb);
        spyOn(ThumbnailStrip, 'selectedIndex').andReturn(0);

        // Mock PubSub to handle qowt:doAction with getSlide.
        var originalPublish = PubSub.publish;
        spyOn(PubSub, 'publish').andCallFake(
            function(eventType, eventData) {
              if (eventType === 'qowt:doAction' && eventData &&
                  eventData.action && eventData.action === 'getSlide') {
                var slideLoad = {'root': EnvModel.rootNode, 'sn': 1};
                DomListener.dispatchEvent(EnvModel.rootNode, 'qowt:slideLoaded',
                    slideLoad);
              } else {
                originalPublish.call(PubSub, eventType, eventData);
              }
            });

        // Trigger presentation creation by publishing cmdgetStyleStop
        PubSub.publish('qowt:cmdgetStylesStop', {});

        // Assert that qowt:pointSetSlide (Clones the thumbnail to slide area)
        // is published before qowt:contentComplete.
        expect(PubSub.publish.calls.length).toBe(19);
        expect(PubSub.publish.calls[1].args[0]).toBe('qowt:contentReceived');
        expect(PubSub.publish.calls[2].args[0]).toBe('qowt:doAction');
        expect(PubSub.publish.calls[3].args[0]).toBe('qowt:pointSetSlide');
        expect(PubSub.publish.calls[5].args[0]).toBe('qowt:contentComplete');
      });

      it('should remove all listeners on "qowt:disable" event', function() {
        spyOn(DomListener, 'removeGroup');
        PubSub.publish('qowt:disable', {});

        expect(DomListener.removeGroup.callCount).toBe(1);
        expect(DomListener.removeGroup.calls[0].args[0]).toBe('presentation');
      });

      it('should handle deleteSlide event properly', function() {
        var slideNotesNode = SlideNotes.getSlideNotesNode();
        var dummyNotesDiv = document.createElement('div');
        slideNotesNode.appendChild(dummyNotesDiv);
        spyOn(slideNotesNode, 'removeChild');
        spyOn(SlidesContainer, 'clearSlideContainer');
        PubSub.publish('qowt:clearSlideContainer', {
          index: 1
        });

        expect(SlidesContainer.clearSlideContainer).toHaveBeenCalled();
        expect(slideNotesNode.removeChild).toHaveBeenCalled();
      });

      it('should publish event qowt:stopObservingSlideMutations before ' +
          'cloning thumbnail data into slide area', function() {
            spyOn(PubSub, 'publish').andCallThrough();
            spyOn(Features, 'isEnabled').andReturn(true);

            PubSub.publish('qowt:pointSetSlide', { 'slide': 1 });

            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:pointSetSlide');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
                'qowt:stopObservingSlideMutations');
          });

      it('should publish event qowt:slideShowStopped after ' +
          'slide show is stopped', function() {
            PointModel.slideShowMode = true;
            spyOn(PubSub, 'publish').andCallThrough();

            var slidesContainerNode = SlidesContainer.node();
            var evt = document.createEvent('Event');
            evt.initEvent('webkitfullscreenchange', true, false);

            slidesContainerNode.dispatchEvent(evt);

            expect(PubSub.publish).toHaveBeenCalledWith(
                'qowt:slideShowStopped');
          });

      it('should publish event qowt:slideShowStarted before slide show is ' +
          'started and slide management tool is activated', function() {
            spyOn(PubSub, 'publish').andCallThrough();
            spyOn(ThumbnailStrip, 'selectedIndex').andReturn(0);

            var slidesContainerNode = SlidesContainer.node();
            var evt = document.createEvent('Event');
            evt.initEvent('webkitfullscreenchange', true, false);

            slidesContainerNode.dispatchEvent(evt);

            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:slideShowStarted');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
                'qowt:requestFocus');
            expect(PubSub.publish.calls[1].args[1]).toEqual(
                { contentType: 'slideManagement', index: 0 });
          });

      it('should lock screen when pointSetSlide is called on a thumbnail ' +
          'which is not loaded', function() {
            ThumbnailStrip.createNumOfThumbs(2);

            spyOn(PubSub, 'publish').andCallThrough();
            spyOn(Features, 'isEnabled').andReturn(true);
            spyOn(ThumbnailStrip.thumbnail(1), 'isLoaded').andReturn(false);
            PubSub.publish('qowt:pointSetSlide', { 'slide': 1 });
            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:pointSetSlide');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
               'qowt:stopObservingSlideMutations');
            expect(PubSub.publish.calls[2].args[0]).toEqual('qowt:lockScreen');
          });

      it('should unlock screen when pointSetSlide is called on a thumbnail ' +
          'which is loaded', function() {
            ThumbnailStrip.createNumOfThumbs(2);

            spyOn(PubSub, 'publish').andCallThrough();
            spyOn(Features, 'isEnabled').andReturn(true);
            spyOn(ThumbnailStrip.thumbnail(1), 'isLoaded').andReturn(true);
            PubSub.publish('qowt:pointSetSlide', { 'slide': 1 });
            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:pointSetSlide');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
                'qowt:stopObservingSlideMutations');
            expect(PubSub.publish.calls[2].args[0]).toEqual(
                'qowt:unlockScreen');
          });

      it('should insert new slide at correct position in thumbnail strip',
          function() {
            ThumbnailStrip.createNumOfThumbs(5);
            PointModel.numberOfSlidesInPreso = 5;
            spyOn(PubSub, 'publish').andCallThrough();
            Presentation.insertSlide(3);
            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:updateThumbCount');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
                'qowt:clearSlideSelection');
            expect(PubSub.publish.calls[2].args[0]).toEqual(
                'qowt:requestAction');
            expect(PubSub.publish.calls[2].args[1].action).toEqual(
                'slideSelect');
            expect(PointModel.numberOfSlidesInPreso).toEqual(6);
          });

      it('should insert duplicated slide at correct position in thumbnail ' +
          'strip', function() {
            ThumbnailStrip.createNumOfThumbs(5);
            PointModel.numberOfSlidesInPreso = 5;
            spyOn(PubSub, 'publish').andCallThrough();
            Presentation.duplicateSlides(['3']);
            expect(PubSub.publish.calls[0].args[0]).toEqual(
                'qowt:updateThumbCount');
            expect(PubSub.publish.calls[1].args[0]).toEqual(
                'qowt:clearSlideSelection');
            expect(PubSub.publish.calls[2].args[0]).toEqual(
                'qowt:requestAction');
            expect(PubSub.publish.calls[2].args[1].action).toEqual(
                'slideSelect');
            expect(PubSub.publish.calls[2].args[1].context.index).toEqual(3);
            expect(PointModel.numberOfSlidesInPreso).toEqual(6);
          });

      it('should return correct index on getCurrentSlideIndex', function() {
        var dummySlideWidget = {
          getSlideIndex: function() {
            return 1;
          }
        };
        spyOn(SlidesContainer, 'getCurrentSlideWidget').andReturn(
            dummySlideWidget);

        expect(Presentation.getCurrentSlideIndex()).toEqual(1);
      });
    });
    describe('Test key handling', function() {
      var _context;
      beforeEach(function() {
        var config = {
          'anchorNode': document.createElement('div'),
          'appContext': 'point'
        };
        spyOn(Features, 'isEnabled').andReturn(true);
        ViewLayoutControl.init(config);

        _context = {
          data: {
            index: 0,
            meta: false,
            shift: false,
            type: 'click'
          }
        };
        SelectionManager.init();
        ThumbnailStripContentMgr.init();
        ThumbnailStripTool.activate(_context);
      });

      afterEach(function() {
        ThumbnailStripTool.deactivate(_context);
      });

      it('arrow key press should fire appropriate events', function() {
        ThumbnailStrip.createNumOfThumbs(2);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);
        spyOn(PubSub, 'publish').andCallThrough();
        runs(function() {
          Keyboard.type(keys('down'));
        });
        WaitFor.mockKeyboard();

        // Expect updateSlideMenu to be called as we update slide menu on
        // slide selection change
        runs(function() {
          expect(PubSub.publish.calls[16].args[0]).toBe('qowt:updateSlideMenu');
        });
      });

      it('arrow key up should not do anything when the top thumb is selected',
          function() {
        ThumbnailStrip.createNumOfThumbs(5);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);

        runs(function() {
          Keyboard.type(keys('up'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(ThumbnailStrip.selectedIndex()).toBe(0);
        });
      });

      it('should play animation if available when user is in slide show ' +
          'mode and presses up key', function() {
        PointModel.slideShowMode = true;

        ThumbnailStrip.createNumOfThumbs(5);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);

        spyOn(AnimationRequestHandler, 'isPreviousAnimationToBePlayed').
            andReturn(true);
        spyOn(AnimationRequestHandler, 'goBackInAnimationHistory');

        runs(function() {
          Keyboard.type(keys('up'));
        });
        WaitFor.mockKeyboard();

        runs(function() {
          expect(AnimationRequestHandler.goBackInAnimationHistory).
              toHaveBeenCalled();
        });
      });

      it('should play animation if available when user is in slide show ' +
          'mode and presses down key', function() {
        PointModel.slideShowMode = true;

        ThumbnailStrip.createNumOfThumbs(5);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);

        spyOn(AnimationRequestHandler, 'isAnimationToBePlayed').andReturn(
            true);
        spyOn(AnimationRequestHandler, 'playOnClick');
        runs(function() {
          Keyboard.type(keys('down'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(AnimationRequestHandler.playOnClick).toHaveBeenCalled();
        });
      });

      //Delete key handling
      it('should play animation if available when user is in slide show ' +
          'mode and presses delete/backspace key', function() {
        PointModel.slideShowMode = true;

        ThumbnailStrip.createNumOfThumbs(5);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);

        spyOn(AnimationRequestHandler, 'isPreviousAnimationToBePlayed').
            andReturn(true);
        spyOn(AnimationRequestHandler, 'goBackInAnimationHistory');
        runs(function() {
          Keyboard.type(keys('backspace'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(AnimationRequestHandler.goBackInAnimationHistory).
              toHaveBeenCalled();
        });
      });

      it('should fire deleteSlide action on delete/backspace key press' +
          ' when user is in editor mode ', function() {
        ThumbnailStrip.createNumOfThumbs(5);
        PubSub.publish('qowt:unlockScreen');
        expect(ThumbnailStrip.selectedIndex()).toBe(0);
        spyOn(PubSub, 'publish').andCallThrough();
        spyOn(DeleteSlideCommand, 'create');
        runs(function() {
          Keyboard.type(keys('backspace'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(PubSub.publish.calls[4].args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.calls[4].args[1].action).toBe(
              'deleteSlide');
          expect(DeleteSlideCommand.create).toHaveBeenCalled();
        });
      });

      it('should not fire deleteSlide action on delete/backspace key press' +
          ' when user is in editor mode but the presentation does not ' +
          'contain any slides', function() {
        ThumbnailStrip.createNumOfThumbs(0);
        spyOn(DeleteSlideCommand, 'create');
        runs(function() {
          Keyboard.type(keys('backspace'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(DeleteSlideCommand.create).not.toHaveBeenCalled();
        });
      });

      it('should not fire deleteSlide action on delete/backspace key when in ' +
          'editor mode but "qowt:lockScreen" is published', function() {
        ThumbnailStrip.createNumOfThumbs(0);
        PubSub.publish('qowt:lockScreen');
        spyOn(DeleteSlideCommand, 'create');
        runs(function() {
          Keyboard.type(keys('backspace'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(DeleteSlideCommand.create).not.toHaveBeenCalled();
        });
      });

      it('should fire insertSlide action on enter key when in editor mode.',
          function() {
        spyOn(SelectionManager, 'getSelection').andCallFake(function() {
          return {contentType: 'slideManagement'};
        });

        ThumbnailStrip.createNumOfThumbs(5);
        expect(ThumbnailStrip.selectedIndex()).toBe(0);
        spyOn(InsertSlideCommand, 'create');
        PubSub.publish('qowt:unlockScreen');
        runs(function() {
          Keyboard.type(keys('enter'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(InsertSlideCommand.create).toHaveBeenCalled();
        });
      });

      it('should not fire insertSlide action on enter key when in editor mode' +
          ' but the presentation does not contain any slides', function() {
        ThumbnailStrip.createNumOfThumbs(0);
        spyOn(InsertSlideCommand, 'create');
        runs(function() {
          Keyboard.type(keys('enter'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(InsertSlideCommand.create).not.toHaveBeenCalled();
        });
      });

      it('should not fire insertSlide action on enter key when in editor mode' +
          ' but "qowt:lockScreen" event is published', function() {
        ThumbnailStrip.createNumOfThumbs(5);
        PubSub.publish('qowt:lockScreen');
        spyOn(InsertSlideCommand, 'create');
        runs(function() {
          Keyboard.type(keys('enter'));
        });
        WaitFor.mockKeyboard();
        runs(function() {
          expect(InsertSlideCommand.create).not.toHaveBeenCalled();
        });
      });
    });
  });
});
