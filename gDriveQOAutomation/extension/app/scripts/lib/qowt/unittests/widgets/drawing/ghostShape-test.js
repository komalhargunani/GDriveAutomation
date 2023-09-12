// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for ghost shape widget.
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/features/utils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/controls/point/slide',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/dcp/metaFileHandler'
], function(
    Features,
    PubSub,
    GhostShape,
    SlideControl,
    ShapeHandler,
    ImageHandler,
    MetaFileHandler) {

  'use strict';


  describe('ghost shape widget', function() {

    var ghostShapeNode, context;
    beforeEach(function() {
      Features.enable('edit');
      Features.enable('pointEdit');
      SlideControl.init();
      context = {
        left: 10,
        top: 10,
        width: 10,
        height: 10
      };
      ghostShapeNode = GhostShape.getWidgetElement();
    });

    afterEach(function() {
      Features.disable('edit');
      Features.disable('pointEdit');
      ghostShapeNode = undefined;
    });

    it('should throw if _ghosteShape.init() called multiple times.',
       function() {
         expect(GhostShape.init).toThrow(
             '_ghosteShape.init() called multiple times.');
       });
    it('should append the ghost shape to the container node.',
        function() {
          expect(ghostShapeNode).not.toBe(undefined);
        });
    it('should display the ghost shape node.',
        function() {
          GhostShape.display(context);
          expect(ghostShapeNode.style.display).toBe('block');
          expect(ghostShapeNode.style.left).toBe('10px');
          expect(ghostShapeNode.style.top).toBe('10px');
          expect(ghostShapeNode.style.height).toBe('10px');
          expect(ghostShapeNode.style.width).toBe('10px');
        });
    it('should resize the ghost shape node and append the the temporary' +
        'shape node with canvas to it.',
        function() {
          spyOn(ShapeHandler, 'visit');
          var shapeJSON = {
            el: {
              spPr: {
                xfrm: {
                  off: {},
                  ext: {}
                }
              }
            }
          };
          GhostShape.display(context);
          GhostShape.resize(context, shapeJSON);
          expect(ghostShapeNode.style.left).toBe('10px');
          expect(ghostShapeNode.style.top).toBe('10px');
          expect(ghostShapeNode.style.height).toBe('10px');
          expect(ghostShapeNode.style.width).toBe('10px');
          expect(ShapeHandler.visit).toHaveBeenCalled();
        });
    it('should restore the ghost shape node properties.',
        function() {
          spyOn(PubSub, 'publish').andCallThrough();
          GhostShape.restore();
          expect(ghostShapeNode.style.height).toBe('0px');
          expect(ghostShapeNode.style.width).toBe('0px');
          expect(PubSub.publish.mostRecentCall.args[0]).toEqual(
              'qowt:addShapeDone');
        });
    it('should return the JSON object of ghost shape node properties.',
        function() {
          var shapeJson;
          GhostShape.display(context);
          shapeJson = GhostShape.getShapeJson();
          expect(shapeJson.transforms).not.toBe(undefined);
        });

    it('should throw error when appendTo called with undefined context',
        function() {
         context = undefined;
         expect(function() {
           GhostShape.appendTo(context);
         }).toThrow('GhostShape.appendTo() - missing node parameter!');
       });

    it('should call image handler while resizing an image', function() {
      var shapeJSON = {
        el: {
          etp: 'pic',
          elm: [
            {
              etp: 'img'
            }],
          spPr: {
            xfrm: {
              off: {},
              ext: {}
            }
          }
        }
      };
      spyOn(ImageHandler, 'visit');

      GhostShape.resize(context, shapeJSON);

      expect(ImageHandler.visit).toHaveBeenCalled();
    });

    it('should call meta file handler while resizing meta file shape',
        function() {
          var shapeJSON = {
            el: {
              etp: 'pic',
              elm: [
                {
                  etp: 'mf',
                  elm: [
                    {
                      etp: 'img'
                    }
                  ]
                }],
              spPr: {
                xfrm: {
                  off: {},
                  ext: {}
                }
              }
            }
          };
          var metaFileDiv = document.createElement('div');
          spyOn(MetaFileHandler, 'visit').andReturn(metaFileDiv);
          spyOn(ImageHandler, 'visit');

          GhostShape.resize(context, shapeJSON);

          expect(MetaFileHandler.visit).toHaveBeenCalled();
          expect(ImageHandler.visit).toHaveBeenCalled();
        });
  });
});
