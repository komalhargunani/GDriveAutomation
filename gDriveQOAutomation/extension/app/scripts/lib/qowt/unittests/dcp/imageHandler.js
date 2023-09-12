/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/fixtures/_all'
], function(
    handler,
    FIXTURES) {

  'use strict';

  describe('QOWT/dcp/imageHandler.js', function() {

    var rootNode, retImage;
    var visitableFoobarEl, visitableImageEl, visitableImage30Pixels,
        visitableImage256x256SlightYSkew, visitableImage256x256LargeXSkew;
    var origSize, slightSkew, largeSkew;

    // Copied from image handler
    // Allow an aspect ratio change of 10% before setting the height
    var _kAllowableSkew = 0.1;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      visitableFoobarEl = {
        el: FIXTURES.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableImageEl = {
        el: FIXTURES.imageElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableImage30Pixels = {
        el: FIXTURES.imageElement(30),
        node: rootNode,
        accept: function() {}
      };
      // create skewed image elements
      origSize = 256;
      slightSkew = 1 + _kAllowableSkew / 2;
      largeSkew = 1 + _kAllowableSkew * 5;
      var y = origSize * slightSkew;
      visitableImage256x256SlightYSkew = {
        el: FIXTURES.jazzImageElement(origSize, y, 1, slightSkew),
        node: rootNode,
        accept: function() {}
      };
      var x = origSize * largeSkew;
      visitableImage256x256LargeXSkew = {
        el: FIXTURES.jazzImageElement(x, origSize, 1, largeSkew),
        node: rootNode,
        accept: function() {}
      };
    });

    it('should ignore any DCP element that is not an image', function() {
      retImage = handler.visit(visitableFoobarEl);
      expect(retImage).toBe(undefined);
      expect(visitableFoobarEl.node.childNodes.length).toBe(0);
    });

    it('should ignore any DCP element that has no id set', function() {
      visitableImageEl.el.eid = undefined;
      retImage = handler.visit(visitableImageEl);
      expect(retImage).toBe(undefined);
      expect(visitableImageEl.node.childNodes.length).toBe(0);
    });

    it('should create an html img element for an image DCP element',
        function() {
          retImage = handler.visit(visitableImageEl);
          expect(retImage).not.toEqual(undefined);
          expect(visitableImageEl.node.childNodes.length).toBe(1);
          expect(visitableImageEl.node.childNodes[0].nodeName).toBe('IMG');
        });

    it('should set the image width correctly', function() {
      var img;
      retImage = handler.visit(visitableImage30Pixels);
      expect(retImage).not.toEqual(undefined);
      expect(visitableImage30Pixels.node.childNodes.length).toBe(1);
      img = visitableImage30Pixels.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      var comparisonWidth = 30 + 'px';
      expect(img.style.width).toBe(comparisonWidth);
    });

    it('should set the height if the image has been skewed by more than the ' +
        'allowable amount', function() {
          var img;
          retImage = handler.visit(visitableImage256x256LargeXSkew);
          expect(retImage).not.toEqual(undefined);
          expect(visitableImage256x256LargeXSkew.node.childNodes.length).toBe(
              1);
          img = visitableImage256x256LargeXSkew.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          var comparisonWidth = origSize * largeSkew + 'px';
          expect(img.style.width).toBe(comparisonWidth);
          var comparisonHeight = origSize + 'px';
          expect(img.style.height).toBe(comparisonHeight);
        });

    it('should set the height if the image element belongs to POINT',
        function() {
          var pointImage = {
            el: {
              etp: 'img',
              eid: '123',
              src: 'image-src',
              wdt: 96,
              hgt: 48,
              isPointElement: true
            },
            node: rootNode,
            accept: function() {}
          };
          retImage = handler.visit(pointImage);
          expect(retImage).not.toEqual(undefined);
          expect(pointImage.node.childNodes.length).toBe(1);
          var img = pointImage.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          expect(img.style.width).toBe('96px');
          expect(img.style.height).toBe('48px');
        });

    it('should not crop image if height not present', function() {
      var pointImage = {
        el: {
          etp: 'img',
          eid: '123',
          src: 'image-src',
          wdt: 200,
          crop: {
            bottom: 5,
            top: 10,
            left: 15,
            right: 20
          }
        },
        node: rootNode,
        accept: function() {}
      };
      retImage = handler.visit(pointImage);
      expect(retImage).not.toEqual(undefined);
      expect(pointImage.node.childNodes.length).toBe(1);
      var img = pointImage.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      expect(img.style.position).toEqual('');
      expect(img.style.clip).toEqual('');
    });

    it('should crop image if rotation not present', function() {
      var pointImage = {
        el: {
          etp: 'img',
          eid: '123',
          src: 'image-src',
          wdt: 225,
          hgt: 150,
          crop: {
            b: '5',
            t: '20',
            l: '15',
            r: '10'
          },
          isPointElement: true,
          rotation: false
        },
        node: rootNode,
        accept: function() {}
      };
      retImage = handler.visit(pointImage);
      expect(retImage).not.toEqual(undefined);
      expect(pointImage.node.childNodes.length).toBe(1);
      var img = pointImage.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      expect(img.style.width).toBe('300px');
      expect(img.style.height).toBe('200px');
      expect(img.style.maxWidth).toBe('300px');
      expect(img.style.top).toBe('-40px');
      expect(img.style.left).toBe('-45px');
      expect(img.style.position).toBe('absolute');
      expect(img.style.clip).toBe('rect(40px, 270px, 190px, 45px)');
    });

    it('should not crop image if width not present', function() {
      var pointImage = {
        el: {
          etp: 'img',
          eid: '123',
          src: 'image-src',
          //hgt: 200, commented this here, since now if only the height
          //          is sent the width is assumed the same
          crop: {
            b: '5',
            t: '10',
            l: '15',
            r: '20'
          }
        },
        node: rootNode,
        accept: function() {}
      };
      retImage = handler.visit(pointImage);
      expect(retImage).not.toEqual(undefined);
      expect(pointImage.node.childNodes.length).toBe(1);
      var img = pointImage.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      expect(img.style.position).toEqual('');
      expect(img.style.clip).toEqual('');
    });

    it('should not crop image if crop not present', function() {
      var pointImage = {
        el: {
          etp: 'img',
          eid: '123',
          src: 'image-src',
          wdt: 200,
          hgt: 200
        },
        node: rootNode,
        accept: function() {}
      };
      retImage = handler.visit(pointImage);
      expect(retImage).not.toEqual(undefined);
      expect(pointImage.node.childNodes.length).toBe(1);
      var img = pointImage.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      expect(img.style.width).toBe('200px');
      expect(img.style.position).toEqual('');
      expect(img.style.clip).toEqual('');
      expect(img.style.top).toBe('');
      expect(img.style.left).toBe('');
    });

    it('should add the clip and position style elements, to the image tag, ' +
        'when crop element is present', function() {
          var pointImage = {
            el: {
              etp: 'img',
              eid: '123',
              src: 'image-src',
              wdt: 225,
              hgt: 150,
              crop: {
                b: '5',
                t: '20',
                l: '15',
                r: '10'
              },
              isPointElement: true
            },
            node: rootNode,
            accept: function() {}
          };
          retImage = handler.visit(pointImage);
          expect(retImage).not.toEqual(undefined);
          expect(pointImage.node.childNodes.length).toBe(1);
          var img = pointImage.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          expect(img.style.width).toBe('300px');
          expect(img.style.height).toBe('200px');
          expect(img.style.maxWidth).toBe('300px');
          expect(img.style.top).toBe('-40px');
          expect(img.style.left).toBe('-45px');
          expect(img.style.position).toBe('absolute');
          expect(img.style.clip).toBe('rect(40px, 270px, 190px, 45px)');
        });

    it('should crop image appropriately, when crop parameters have negative ' +
        'values', function() {
          var pointImage = {
            el: {
              etp: 'img',
              eid: '123',
              src: 'image-src',
              wdt: 250,
              hgt: 125,
              crop: {
                b: '-5',
                t: '-20',
                l: '-15',
                r: '-10'
              },
              isPointElement: true
            },
            node: rootNode,
            accept: function() {}
          };
          retImage = handler.visit(pointImage);
          expect(retImage).not.toEqual(undefined);
          expect(pointImage.node.childNodes.length).toBe(1);
          var img = pointImage.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          expect(img.style.width).toBe('200px');
          expect(img.style.height).toBe('100px');
          expect(img.style.maxWidth).toBe('200px');
          expect(img.style.top).toBe('20px');
          expect(img.style.left).toBe('30px');
          expect(img.style.position).toBe('absolute');
          expect(img.style.clip).toBe('rect(-20px, 200px, 100px, -30px)');
        });

    it('should crop image appropriately, when crop parameters have zero values',
        function() {
          var pointImage = {
            el: {
              etp: 'img',
              eid: '123',
              src: 'image-src',
              wdt: 250,
              hgt: 125,
              crop: {
                b: '0',
                t: '0',
                l: '0',
                r: '0'
              },
              isPointElement: true
            },
            node: rootNode,
            accept: function() {}
          };
          retImage = handler.visit(pointImage);
          expect(retImage).not.toEqual(undefined);
          expect(pointImage.node.childNodes.length).toBe(1);
          var img = pointImage.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          expect(img.style.width).toBe('250px');
          expect(img.style.height).toBe('125px');
          expect(img.style.maxWidth).toBe('250px');
          expect(img.style.top).toBe('0px');
          expect(img.style.left).toBe('0px');
          expect(img.style.position).toBe('absolute');
          expect(img.style.clip).toBe('rect(0px, 250px, 125px, 0px)');
        });

    it('should set the height if the isPointElement is false', function() {
      var pointImage = {
        el: {
          etp: 'img',
          eid: '123',
          src: 'image-src',
          wdt: 96,
          hgt: 48,
          isPointElement: false
        },
        node: rootNode,
        accept: function() {}
      };
      retImage = handler.visit(pointImage);
      expect(retImage).not.toEqual(undefined);
      expect(pointImage.node.childNodes.length).toBe(1);
      var img = pointImage.node.childNodes[0];
      expect(img.nodeName).toBe('IMG');
      expect(img.style.width).toBe('96px');
      expect(img.style.height).toBe('48px');
    });

    it('should set the height if the image has been skewed by less than the ' +
        'allowable amount', function() {
          var img;
          retImage = handler.visit(visitableImage256x256SlightYSkew);
          expect(retImage).not.toEqual(undefined);
          expect(visitableImage256x256SlightYSkew.node.childNodes.length).toBe(
              1);
          img = visitableImage256x256SlightYSkew.node.childNodes[0];
          expect(img.nodeName).toBe('IMG');
          var comparisonWidth = origSize + 'px';
          expect(img.style.width).toBe(comparisonWidth);
          expect(img.style.height).not.toBeFalsy();
        });

  });

});
