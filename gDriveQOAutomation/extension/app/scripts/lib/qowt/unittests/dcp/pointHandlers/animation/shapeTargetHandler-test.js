// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Shape Target Handler Test.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/dcp/pointHandlers/animation/shapeTargetHandler',
  'qowtRoot/controls/point/animation/animationManager',
  'qowtRoot/controls/point/animation/animationBuilders/fadeAnimationBuilder'
], function(ShapeTargetHandler, AnimationManager,
            FadeAnimatinBuilder) {

  'use strict';

  describe('ShapeTarget Handler', function() {
    var v, animationObj, animationBuilder;

    beforeEach(function() {
      animationBuilder = FadeAnimatinBuilder.create();
      AnimationManager.setCurrentAnimationBuilder(animationBuilder);
    });

    afterEach(function() {
      v = {};
      animationObj = undefined;
      animationBuilder = undefined;
      AnimationManager.resetCurrentAnimationProperties();
    });

    it('should not set shape id to animation if etp & node attributes set,' +
        ' spid attribute not set', function() {
          v = {
            'el': {
              'etp': 'spTgt'
            }
          };

          ShapeTargetHandler.visit(v);
          animationBuilder = AnimationManager.getCurrentAnimationBuilder();
          animationObj = animationBuilder.getAnimation();

          expect(animationObj.getAnimationShapeId()).not.toBeDefined();
        });

    it('should set shape id to animation if etp, node & spid attributes set',
       function() {
         v = {
           'el': {
             'etp': 'spTgt',
             'spid': '25'
           }
         };

         ShapeTargetHandler.visit(v);
         animationBuilder = AnimationManager.getCurrentAnimationBuilder();
         animationObj = animationBuilder.getAnimation();

         expect(animationObj).toBeDefined();
         expect(animationObj.getAnimationShapeId()).toBeDefined();
         expect(animationObj.getAnimationShapeId()).toBe(v.el.spid);
       });
  });
});
