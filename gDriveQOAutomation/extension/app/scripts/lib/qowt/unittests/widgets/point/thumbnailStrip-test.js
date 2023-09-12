define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/models/point',
  'qowtRoot/features/utils',
  'qowtRoot/tools/point/thumbnailStripTool',
  'qowtRoot/selection/selectionManager',
  'qowtRoot/contentMgrs/thumbnailStripContentMgr',
  'qowtRoot/presentation/slideChartsManager'
], function(
    PubSub,
    ThumbnailStrip,
    SlidesContainer,
    PointModel,
    Features,
    ThumbnailStripTool,
    SelectionManager,
    ThumbnailStripContentMgr,
    SlideChartsManager) {

  'use strict';

  describe('widgets/point/thumbnailStrip', function() {

    var _parentNode;
    var _strip;
    var _slidesContainer;

    var subscriptions;
    var _context = {
      data: {
        index: 0,
        meta: false,
        shift: false,
        type: 'click'
      }
    };

    beforeEach(function() {
      ThumbnailStripTool.activate(_context);
      SelectionManager.init();
      ThumbnailStripContentMgr.init();
      ThumbnailStrip.init();
      subscriptions = [];
      _strip = ThumbnailStrip;
      _strip.clearThumbs();
      Features.disable('pointEdit');
      _parentNode = document.createElement('div');
      _slidesContainer = SlidesContainer;
      _slidesContainer.appendTo(_parentNode);
    });

    afterEach(function() {
      if (subscriptions && subscriptions.length > 0) {
        for (var ix = 0; ix < subscriptions.length; ix++) {
          PubSub.unsubscribe(subscriptions[ix]);
        }
      }
      _parentNode = undefined;
      _slidesContainer = undefined;
      ThumbnailStripTool.deactivate(_context);
    });

    it('should throw if thumbnailStrip.init() called multiple times',
       function() {
         expect(function() {
           ThumbnailStrip.init();
         }).toThrow('thumbnailStrip.init() called multiple times.');
       });

    it("it should have 0 thumbs after it's created", function() {
      expect(_strip.numOfThumbnails()).toBe(0);
    });

    it('it should have as many thumbs as you ask to create', function() {
      _strip.createNumOfThumbs(5);
      expect(_strip.numOfThumbnails()).toBe(5);
      expect(_strip.selectedIndex()).toBe(0);
      _strip.createNumOfThumbs(2);
      expect(_strip.numOfThumbnails()).toBe(2);
      expect(_strip.selectedIndex()).toBe(0);
      _strip.createNumOfThumbs(0);
      expect(_strip.numOfThumbnails()).toBe(0);
      expect(_strip.selectedIndex()).toBe(0);
    });

    it('showStrip(true) should work properly', function() {
      _strip.showStrip(true);
      expect(_strip.node().style.display).toBe('block');
    });

    it('showStrip(false) should work properly', function() {
      _strip.showStrip(false);
      expect(_strip.node().style.display).toBe('none');
    });

    it('thumbnail(x) where x is a valid index should return a valid object',
       function() {
         _strip.createNumOfThumbs(5);
         var tn = _strip.thumbnail(3);
         expect(tn).toBeDefined();
       });

    it('thumbnail(x) where x is an invalid index should not return an object',
       function() {
         _strip.createNumOfThumbs(5);
         var tn = _strip.thumbnail(-1);
         expect(tn).toBe(undefined);
       });

    it('should not publish qowt:resetSelection event if pointEdit is not ' +
        'enabled', function() {

          _strip.createNumOfThumbs(5);
          spyOn(PubSub, 'publish').andCallThrough();
          PointModel.prevSelectedGroupShape = 'some shape';

          ThumbnailStrip.selectItem(1);

          expect(PointModel.prevSelectedGroupShape).toEqual('some shape');
        });

    it('should insert new slide at correct position in thumbnail strip',
        function() {
          _strip.createNumOfThumbs(5);
          PointModel.numberOfSlidesInPreso = 5;
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(_strip.node(), 'insertBefore');
          _strip.insertSlide(3);
          expect(_strip.numOfThumbnails()).toEqual(6);
          expect(_strip.node().insertBefore).toHaveBeenCalled();
        });

    it('should not reorder inserted slide within thumbnail strip if it is ' +
        'inserted after the last slide', function() {
          _strip.createNumOfThumbs(5);
          PointModel.numberOfSlidesInPreso = 5;
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(_strip.node(), 'insertBefore');
          _strip.insertSlide(5);
          expect(_strip.numOfThumbnails()).toEqual(6);
          expect(_strip.node().insertBefore).not.toHaveBeenCalled();
        });

    it('should delete slides properly', function() {
      _strip.createNumOfThumbs(5);
      PointModel.numberOfSlidesInPreso = 5;
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(SlideChartsManager, 'deleteSlideEntryFromChartMap');
      _strip.deleteSlides(['1']);
      expect(_strip.numOfThumbnails()).toEqual(4);
      expect(PointModel.numberOfSlidesInPreso).toEqual(4);
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideContainer');
      expect(PubSub.publish.calls[1].args[0]).toEqual('qowt:updateThumbCount');
      expect(PubSub.publish.calls[2].args[0]).toEqual('qowt:requestFocus');
      expect(SlideChartsManager.deleteSlideEntryFromChartMap).
          toHaveBeenCalled();
    });

    it('should delete slides properly when all slides are to be deleted',
        function() {
          _strip.createNumOfThumbs(5);
          PointModel.numberOfSlidesInPreso = 5;
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(SlideChartsManager, 'deleteSlideEntryFromChartMap');

          _strip.deleteSlides(['5', '4', '3', '2', '1']);
          expect(_strip.numOfThumbnails()).toEqual(0);
          expect(PointModel.numberOfSlidesInPreso).toEqual(0);
          expect(PubSub.publish.calls[0].args[0]).toEqual(
              'qowt:clearSlideContainer');
          expect(PubSub.publish.calls[1].args[0]).toEqual(
              'qowt:clearSlideContainer');
          expect(PubSub.publish.calls[2].args[0]).toEqual(
              'qowt:clearSlideContainer');
          expect(PubSub.publish.calls[3].args[0]).toEqual(
              'qowt:clearSlideContainer');
          expect(PubSub.publish.calls[4].args[0]).toEqual(
              'qowt:clearSlideContainer');
          expect(PubSub.publish.calls[5].args[0]).toEqual(
              'qowt:updateThumbCount');
          expect(PubSub.publish.calls[6].args[0]).toEqual(
              'qowt:presentationEmpty');
          expect(PubSub.publish.calls[7].args[0]).toEqual(
              'qowt:unlockScreen');
          expect(SlideChartsManager.deleteSlideEntryFromChartMap.callCount).
              toBe(5);
        });

    it('should be able to extract slide id from thumbnail div',
        function() {
          var dummyThumbDiv = {
            getAttribute: function(attr) {
              if (attr === 'aria-label') {
                return 'slide 1';
              }
            }
          };
          var slideIndex = ThumbnailStrip.getThumbnailIndexFromDiv(
              dummyThumbDiv);
          expect(slideIndex).toBe(0);
        });

    describe('reorder thumbnails', function() {

      beforeEach(function() {
        _strip.createNumOfThumbs(5);
      });

      it('should reorder all slides within range of the dragged and dropped ' +
          'position of the slide', function() {
            var originalThumb0 = ThumbnailStrip.thumbnail(0);
            var originalThumb1 = ThumbnailStrip.thumbnail(1);
            var originalThumb2 = ThumbnailStrip.thumbnail(2);
            var originalThumb3 = ThumbnailStrip.thumbnail(3);
            var originalThumb4 = ThumbnailStrip.thumbnail(4);

            _strip.reorderThumbnails(1, 4);

            expect(ThumbnailStrip.thumbnail(0)).toEqual(originalThumb0);
            expect(ThumbnailStrip.thumbnail(1)).toEqual(originalThumb2);
            expect(ThumbnailStrip.thumbnail(2)).toEqual(originalThumb3);
            expect(ThumbnailStrip.thumbnail(3)).toEqual(originalThumb4);
            expect(ThumbnailStrip.thumbnail(4)).toEqual(originalThumb1);
          });

      it('should not reorder any slides when qowt:reorderThumbnails is ' +
          'called -ve index', function() {
            var originalThumb0 = ThumbnailStrip.thumbnail(0);
            var originalThumb1 = ThumbnailStrip.thumbnail(1);
            var originalThumb2 = ThumbnailStrip.thumbnail(2);
            var originalThumb3 = ThumbnailStrip.thumbnail(3);
            var originalThumb4 = ThumbnailStrip.thumbnail(4);
            _strip.reorderThumbnails(-4, 4);

            expect(ThumbnailStrip.thumbnail(0)).toEqual(originalThumb0);
            expect(ThumbnailStrip.thumbnail(1)).toEqual(originalThumb1);
            expect(ThumbnailStrip.thumbnail(2)).toEqual(originalThumb2);
            expect(ThumbnailStrip.thumbnail(3)).toEqual(originalThumb3);
            expect(ThumbnailStrip.thumbnail(4)).toEqual(originalThumb4);
          });

      it('should not reorder any slides when qowt:reorderThumbnails is called' +
          ' with out of index range', function() {
            var originalThumb0 = ThumbnailStrip.thumbnail(0);
            var originalThumb1 = ThumbnailStrip.thumbnail(1);
            var originalThumb2 = ThumbnailStrip.thumbnail(2);
            var originalThumb3 = ThumbnailStrip.thumbnail(3);
            var originalThumb4 = ThumbnailStrip.thumbnail(4);
            _strip.reorderThumbnails(2, 24);

            expect(ThumbnailStrip.thumbnail(0)).toEqual(originalThumb0);
            expect(ThumbnailStrip.thumbnail(1)).toEqual(originalThumb1);
            expect(ThumbnailStrip.thumbnail(2)).toEqual(originalThumb2);
            expect(ThumbnailStrip.thumbnail(3)).toEqual(originalThumb3);
            expect(ThumbnailStrip.thumbnail(4)).toEqual(originalThumb4);
          });

      it('should have correct aria label', function() {
        expect(_strip.node().getAttribute('aria-label')).toBe(
            'Slide strip. Use tab to play.  Use arrows for slide navigation.');
      });
    });

    describe('move slides', function() {
      beforeEach(function() {
        _strip.createNumOfThumbs(5);
      });

      it('should reorder all slides to correct calculated position when ' +
          'moving slides in direction "down"', function() {
            spyOn(_strip, 'reorderThumbnails');

            var slidesToMove = ['1', '2'];
            var moveToPosition = 3;
            var position = 'down';
            _strip.moveSlides(slidesToMove, moveToPosition, position);

            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[0]).toBe(1);
            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[1]).toBe(2);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[0]).toBe(0);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[1]).toBe(1);
          });

      it('should reorder all slides to correct calculated position when ' +
          'moving slides in direction "up"', function() {
            spyOn(_strip, 'reorderThumbnails');

            var slidesToMove = ['2', '3'];
            var moveToPosition = 1;
            var position = 'up';

            _strip.moveSlides(slidesToMove, moveToPosition, position);

            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[0]).toBe(1);
            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[1]).toBe(0);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[0]).toBe(2);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[1]).toBe(1);
          });
      it('should reorder all slides to correct calculated position when ' +
          'moving slides to "start"', function() {
            spyOn(_strip, 'reorderThumbnails');

            var slidesToMove = ['4', '5'];
            var moveToPosition = 1;
            var position = 'start';

            _strip.moveSlides(slidesToMove, moveToPosition, position);

            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[0]).toBe(3);
            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[1]).toBe(0);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[0]).toBe(4);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[1]).toBe(1);
          });

      it('should reorder all slides to correct calculated position when ' +
          'moving slides to "end"', function() {
            spyOn(_strip, 'reorderThumbnails');

            var slidesToMove = ['1', '2'];
            var moveToPosition = 5;
            var position = 'end';

            _strip.moveSlides(slidesToMove, moveToPosition, position);

            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[0]).toBe(1);
            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[1]).toBe(4);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[0]).toBe(0);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[1]).toBe(3);
          });

      it('should reorder all slides to correct calculated position when ' +
          'direction of moving slides is undefined(during undo)', function() {
            spyOn(_strip, 'reorderThumbnails');

            var slidesToMove = ['4', '5'];
            var moveToPosition = 1;

            _strip.moveSlides(slidesToMove, moveToPosition);

            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[0]).toBe(3);
            expect(ThumbnailStrip.reorderThumbnails.calls[0].args[1]).toBe(0);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[0]).toBe(4);
            expect(ThumbnailStrip.reorderThumbnails.calls[1].args[1]).toBe(1);
          });
    });
  });
});
