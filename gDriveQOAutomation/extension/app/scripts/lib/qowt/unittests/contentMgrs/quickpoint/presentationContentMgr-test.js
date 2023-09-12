define([
  'qowtRoot/contentMgrs/presentationContentMgr',
  'qowtRoot/contentMgrs/shapeContentManager',
  'qowtRoot/presentation/slideZoomManager',
  'qowtRoot/controls/point/presentation',
  'qowtRoot/commands/commandManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/contentMgrs/slideContentMgr',
  'qowtRoot/contentMgrs/mutationMgr',
  'qowtRoot/widgets/ui/modalDialog',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr',
  'qowtRoot/utils/listFormatManager',
  'qowtRoot/messageBus/messageBus'], function(
  PresentationContentMgr,
  ShapeContentManager,
  SlideZoomManager,
  Presentation,
  CommandManager,
  PubSub,
  SelectionManager,
  SlideContentManager,
  MutationManager,
  ModalDialog,
  ThumbnailStripContentMgr,
  ListFormatManager,
  MessageBus) {

  'use strict';

  describe('Test initialisation', function() {
    it('should also initialise selectionManager, shapeContentManager ' +
        'mutationManager, thumbnailStripContentMgr and listFormatManager',
        function() {
          spyOn(SelectionManager, 'init').andCallThrough();
          spyOn(ShapeContentManager, 'init').andCallThrough();
          spyOn(SlideContentManager, 'init').andCallThrough();
          spyOn(MutationManager, 'init').andCallThrough();
          spyOn(ThumbnailStripContentMgr, 'init').andCallThrough();
          spyOn(ListFormatManager, 'init').andCallThrough();

          PresentationContentMgr.init();

          expect(SelectionManager.init).toHaveBeenCalled();
          expect(SelectionManager.init.calls.length).toEqual(1);

          expect(ShapeContentManager.init).toHaveBeenCalled();
          expect(ShapeContentManager.init.calls.length).toEqual(1);

          expect(MutationManager.init).toHaveBeenCalled();
          expect(MutationManager.init.calls.length).toEqual(1);

          expect(ThumbnailStripContentMgr.init).toHaveBeenCalled();
          expect(ThumbnailStripContentMgr.init.calls.length).toEqual(1);

          expect(ListFormatManager.init).toHaveBeenCalled();
          expect(ListFormatManager.init.calls.length).toEqual(1);
        });
    it('should throw error if presentationContentMgr.init() called multiple ' +
        'times', function() {
          PresentationContentMgr.init();
          expect(PresentationContentMgr.init).toThrow(
              'presentationContentMgr.init() called multiple times.');
        });
  });
  describe('presentation Content Manager', function() {

    var _doActionEventData;

    beforeEach(function() {
      spyOn(CommandManager, 'addCommand');
      _doActionEventData = {
        'action': 'openPresentation',
        'context': {
          'contentType': 'presentation',
          'path': 'exampleFilePath',
          'slideNumber': 1
        }
      };
      PresentationContentMgr.init();
    });

    it('should support opening a presentation', function() {
      PubSub.publish('qowt:doAction', _doActionEventData);
      expect(CommandManager.addCommand).toHaveBeenCalled();
    });

    it('should get slide content using the correct compound command.',
       function() {
         _doActionEventData.action = 'getSlide';
         PubSub.publish('qowt:doAction', _doActionEventData);

         expect(CommandManager.addCommand).toHaveBeenCalled();
         var containingCmd = CommandManager.addCommand.mostRecentCall.args[0];

         // We expect 4 immediate children paricipating in this compound
         // command.
         expect(containingCmd.childCount()).toBe(4);
       });

    it('should throw error when _getSlide called with undefined slideIndex',
       function() {
         _doActionEventData.action = 'getSlide';
         _doActionEventData.context.slideNumber = undefined;
          expect(function() {
            PubSub.publish('qowt:doAction', _doActionEventData);
          }).toThrow('PresentationContentMgr._getSlide() not given slide' +
                  ' number');
       });

    it('should throw error when _getSlide called with slideIndex which is not' +
        ' a number', function() {
         _doActionEventData.action = 'getSlide';
         _doActionEventData.context.slideNumber = 'slidenumber';
          expect(function() {
            PubSub.publish('qowt:doAction', _doActionEventData);
          }).toThrow('PresentationContentMgr._getSlide() not given slide' +
                  ' number');
       });

    it('should zoom-in', function() {
      _doActionEventData.action = 'zoomIn';
      spyOn(SlideZoomManager, 'zoomIn');
      PubSub.publish('qowt:doAction', _doActionEventData);

      expect(SlideZoomManager.zoomIn).toHaveBeenCalled();
    });

    it('should zoom-out', function() {
      _doActionEventData.action = 'zoomOut';
      spyOn(SlideZoomManager, 'zoomOut');
      PubSub.publish('qowt:doAction', _doActionEventData);

      expect(SlideZoomManager.zoomOut).toHaveBeenCalled();
    });

    it('should start slide-show', function() {
      spyOn(MessageBus, 'pushMessage').andCallFake(function(){});
      _doActionEventData.action = 'startSlideshow';
      spyOn(Presentation, 'toggleFullScreen');
      PubSub.publish('qowt:doAction', _doActionEventData);
      expect(Presentation.toggleFullScreen).toHaveBeenCalled();
    });

    it('should print', function() {
      _doActionEventData.action = 'print';

      var modelDlgInstance = {

        clickHandler: undefined,

        destroy: function() {},

        clickOk: function() {
          modelDlgInstance.clickHandler();
        },

        setClickHandler: function(callback) {
          modelDlgInstance.clickHandler = callback;
        }
      };

      var fakeInfo = function(str1, str2, callback) {
        str1 = str1 || '';
        str2 = str2 || '';
        modelDlgInstance.setClickHandler(callback);

        return modelDlgInstance;

      };

      spyOn(ModalDialog, 'info').andCallFake(fakeInfo);
      spyOn(window, 'print');
      spyOn(modelDlgInstance, 'destroy');


      PubSub.publish('qowt:doAction', _doActionEventData);

      modelDlgInstance.clickOk();

      expect(ModalDialog.info).toHaveBeenCalled();
      expect(window.print).toHaveBeenCalled();
      expect(modelDlgInstance.destroy).toHaveBeenCalled();
    });
  });
});
