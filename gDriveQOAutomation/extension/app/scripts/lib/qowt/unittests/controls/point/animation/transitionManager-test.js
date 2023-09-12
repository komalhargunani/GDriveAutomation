define([
  'qowtRoot/models/point',
  'qowtRoot/controls/point/animation/transitionManager',
  'qowtRoot/widgets/point/slide'
], function(
    PointModel,
    TransitionManager,
    Slide) {

  'use strict';

  describe('transition manager', function() {
    var _transitionManager = TransitionManager;
    var slideShowApi = {
      enter: function() {
      },
      exit: function() {
      }
    };

    /**
     * test for animation manager ready() method
     */
    it('should call _slideShowMode api - enter() method', function() {
      spyOn(slideShowApi, 'enter');
      _transitionManager.setSlideShowAPI(slideShowApi);
      _transitionManager.ready();
      expect(slideShowApi.enter).toHaveBeenCalled();
    });

    /**
     * test for animation manager stop() method
     */
    it('should call _slideShowMode api - exit() method', function() {
      spyOn(slideShowApi, 'exit');
      _transitionManager.setSlideShowAPI(slideShowApi);
      _transitionManager.stop();
      expect(slideShowApi.exit).toHaveBeenCalled();
    });

    /**
     * test for displaySlideAnimation() method
     * TODO add more test cases for different effects
     */
    it('should call slide widget setAnimationValues() method with ' +
        'appropriate values', function() {
          PointModel.slideTransitions = {
            '1': {
              'effect': {
                'type': 'cover',
                'dir': 'd'
              },
              'spd': 'fast', //fast|med|slow. fast is default
              'advTm': '5000'  // advance time
            }
          };

          var _parentNode = document.createElement('div');
          var onStageSlide = Slide.create(0, _parentNode, true);

          var wingSlide = Slide.create(1, _parentNode, true);

          spyOn(wingSlide, 'setAnimationValues');

          _transitionManager.displaySlideAnimation(onStageSlide, wingSlide, 1);
          expect(wingSlide.setAnimationValues).toHaveBeenCalledWith(
              'coverDown', '0.5s');
        });

    it('should play slide transition with default strategy when effect ' +
        'is cover', function() {

          PointModel.slideTransitions = {
            '1': {
              'effect': {
                'type': 'cover',
                'dir': 'd'
              },
              'spd': 'fast', //fast|med|slow. fast is default
              'advTm': '5000'  // advance time
            }
          };

          var _parentNode = document.createElement('div');
          var onStageSlide = Slide.create(0, _parentNode, true);

          var wingSlide = Slide.create(1, _parentNode, true);

          spyOn(wingSlide, 'setAnimationValues');

          _transitionManager.displaySlideAnimation(onStageSlide, wingSlide, 1);
          expect(wingSlide.setAnimationValues).toHaveBeenCalledWith(
              'coverDown', '0.5s');
        });

    it('should play slide transition with default strategy when effect ' +
        'is ZoomIn', function() {

          PointModel.slideTransitions = {
            '1': {
              'effect': {
                'type': 'zoom',
                'dir': 'in'
              },
              'spd': 'fast', //fast|med|slow. fast is default
              'advTm': '5000'  // advance time
            }
          };

          var _parentNode = document.createElement('div');
          var onStageSlide = Slide.create(0, _parentNode, true);

          var wingSlide = Slide.create(1, _parentNode, true);

          spyOn(wingSlide, 'setAnimationValues');

          _transitionManager.displaySlideAnimation(onStageSlide, wingSlide, 1);
          expect(wingSlide.setAnimationValues).toHaveBeenCalledWith(
              'zoomIn', '0.5s');

        });

    it('should play slide transition with default strategy when effect ' +
        'is ZoomOut', function() {

          PointModel.slideTransitions = {
            '1': {
              'effect': {
                'type': 'zoom',
                'dir': 'out'
              },
              'spd': 'fast', //fast|med|slow. fast is default
              'advTm': '5000'  // advance time
            }
          };

          var _parentNode = document.createElement('div');
          var onStageSlide = Slide.create(0, _parentNode, true);

          var wingSlide = Slide.create(1, _parentNode, true);

          spyOn(wingSlide, 'setAnimationValues');

          _transitionManager.displaySlideAnimation(onStageSlide, wingSlide, 1);
          expect(wingSlide.setAnimationValues).toHaveBeenCalledWith(
              'zoomOut', '0.5s');

        });

    it('should play slide transition with onStageToWingStrategy strategy ' +
        'when effect is pull', function() {

          PointModel.slideTransitions = {
            '1': {
              'effect': {
                'type': 'pull',
                'dir': 'd'
              },
              'spd': 'fast', //fast|med|slow. fast is default
              'advTm': '5000'  // advance time
            }
          };

          var _parentNode = document.createElement('div');
          var onStageSlide = Slide.create(0, _parentNode, true);

          var wingSlide = Slide.create(1, _parentNode, true);

          spyOn(onStageSlide, 'setAnimationValues');

          _transitionManager.displaySlideAnimation(onStageSlide, wingSlide, 1);
          expect(onStageSlide.setAnimationValues).toHaveBeenCalledWith(
              'pullDown', '0.5s');
        });
  });
});
