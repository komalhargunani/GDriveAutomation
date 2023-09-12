// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Common Time Node Handler Test.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/dcp/pointHandlers/animation/commonTimeNodeHandler',
  'qowtRoot/controls/point/animation/animationManager',
  'qowtRoot/controls/point/animation/animationContainer'
], function(
            CommonTimeNodeHandler,
            AnimationManager,
            AnimationContainer) {

  'use strict';

  describe('CommonTimeNode Handler', function() {
    var v, animationBuilder, animationObj;

    beforeEach(function() {
    });

    afterEach(function() {
      v = {};
      animationObj = undefined;
      animationBuilder = undefined;
    });

    it('should not add any animation data if etp attribute not set' +
        ' correctly', function() {

          v = {
            'el': {
              'etp': 'foo'
            }
          };

          CommonTimeNodeHandler.visit(v);
          animationBuilder = AnimationManager.getCurrentAnimationBuilder();

          expect(animationBuilder).not.toBeDefined();
        });

    it('should not add any animation data if etp attribute set,' +
        ' node attribute not set', function() {
          v = {
            'el': {
              'etp': 'cTn'
            }
          };

          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();

          expect(animationBuilder).not.toBeDefined();
        });

    it('should keep default animation data if etp & node attributes set,' +
        ' presetClass attribute not set correctly', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'presetClass': '10'
            }
          };

          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationType()).toBe('entrance');
        });

    it('should add animation data if etp, node & presetClass attributes set' +
        ' - entrance set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'presetClass': 'entr'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationType()).toBe('entrance');
        });

    it('should add animation data if etp, node & presetClass attributes set' +
        ' - emphasis set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'presetClass': 'emph'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationType()).toBe('emphasis');
        });

    it('should add animation data if etp, node & presetClass attributes set' +
        ' - exit set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'presetClass': 'exit'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationType()).toBe('exit');
        });

    it('should keep default animation data if etp & node attributes set,' +
        ' nodeType attribute not set correctly', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'nodeType': 'bar'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationStart()).toBe('onClick');
        });

    it('should add animation data if etp, node & nodeType attributes set' +
        ' - clickEffect set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'nodeType': 'clickEffect'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationStart()).toBe('onClick');
        });

    it('should add animation data if etp, node & nodeType attributes set' +
        ' - withEffect set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'nodeType': 'withEffect'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationStart()).toBe('withPrevious');
        });

    it('should add animation data if etp, node & nodeType attributes set' +
        ' - afterEffect set', function() {
          v = {
            'el': {
              'etp': 'cTn',
              'nodeType': 'afterEffect'
            }
          };
          CommonTimeNodeHandler.visit(v);

          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();
          expect(animationObj).toBeDefined();
          expect(animationObj.getAnimationType()).toBeDefined();
          expect(animationObj.getAnimationStart()).toBe('afterPrevious');
        });

    it('should add animation data in animationQuue to play it', function() {
      v = {
        'el': {
          'etp': 'cTn',
          'presetClass': 'emph'
        }
      };
      spyOn(AnimationContainer, 'addAnimation');
      CommonTimeNodeHandler.visit(v);
      CommonTimeNodeHandler.postTraverse(v);

      expect(AnimationContainer.addAnimation).toHaveBeenCalled();
    });


  });
});
