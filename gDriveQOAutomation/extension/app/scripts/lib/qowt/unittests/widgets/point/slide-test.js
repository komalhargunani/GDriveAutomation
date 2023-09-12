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
  'qowtRoot/widgets/point/slide',
  'qowtRoot/utils/domListener',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/dcp/imageHandler',
  'qowtRoot/dcp/pointHandlers/shapeTextBodyHandler',
  'qowtRoot/dcp/pointHandlers/textParagraphHandler',
  'qowtRoot/dcp/metaFileHandler',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/factory'
], function(
    Slide,
    DomListener,
    PubSub,
    ShapeHandler,
    ImageHandler,
    ShapeTextBodyHandler,
    TextParagraphHandler,
    MetaFileHandler,
    QOWTMarkerUtils,
    UnitTestUtils,
    WidgetFactory) {

  'use strict';


  describe('Point slide widget', function() {

    var _slide, _parentNode;
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, false);

    beforeEach(function() {
      _parentNode = UnitTestUtils.createTestAppendArea();
    });

    afterEach(function() {
      _slide = undefined;
      _parentNode = undefined;
      UnitTestUtils.removeTestAppendArea();
    });

    it('should create a slide with index 0', function() {
      _slide = Slide.create(0, _parentNode);
      expect(_slide.getSlideIndex()).toBe(0);
    });

    it('should change correctly the slide index', function() {
      _slide = Slide.create(0, _parentNode);
      _slide.setSlideIndex(2);
      expect(_slide.getSlideIndex()).toBe(2);
    });

    it('should set correct slide aria label for a given index', function() {
      _slide = Slide.create(0, _parentNode, true);
      var slideIndex = 2;
      _slide.setSlideIndex(slideIndex);
      expect(_slide.node().getAttribute('aria-label')).toBe('slide ' +
          (slideIndex + 1));
    });

    it('should set correct aria active descendant to slide ', function() {
      _slide = Slide.create(0, _parentNode, true);
      var slideIndex = 2;
      _slide.setSlideIndex(slideIndex);
      expect(_slide.node().getAttribute('aria-activedescendant')).toBe(
          'qowt-point-slide-inner' + slideIndex);
    });

    it('should focus slide and slide should get tab index 1, when we set ' +
        'slide selected with "true" parameter', function() {
          _slide = Slide.create(0, _parentNode, true);
          spyOn(_slide.node(), 'focus');
          _slide.setSelected(true);
          expect(_slide.node().focus).toHaveBeenCalled();
          expect(_slide.node().getAttribute('tabIndex')).toBe('0');
        });

    it('should take away focus of slide and slide should get tab index -1, ' +
        'when we set slide selected with "false" parameter', function() {
          _slide = Slide.create(0, _parentNode, true);
          spyOn(_slide.node(), 'blur');
          _slide.setSelected(false);
          expect(_slide.node().blur).toHaveBeenCalled();
          expect(_slide.node().getAttribute('tabIndex')).toBe('-1');
        });

    it('should accept "EMPTY" as slide index', function() {
      _slide = Slide.create(0, _parentNode);
      _slide.setSlideIndex('EMPTY');
      expect(_slide.getSlideIndex()).toBe('EMPTY');
    });

    it('should throw an error if trying to set a negative index', function() {
      expect(function() {
        _slide = Slide.create(-1, _parentNode);
      }).toThrow('setSlideIndex - negative index!');
    });

    it('should throw error when missing constructor parameter-slideIndex',
       function() {
          var slideIndex;
          expect(function() {
            _slide = Slide.create(slideIndex, _parentNode);
          }).toThrow('Slide widget - missing constructor parameters!');
       });

    it('should throw error when missing constructor parameter-parentNode',
       function() {
          var parentNode;
          expect(function() {
            _slide = Slide.create(0, parentNode);
          }).toThrow('Slide widget - missing constructor parameters!');
       });

    it('should append the HTML elements of a slide to the parent node',
       function() {
         expect(_parentNode.childNodes[0]).toBeUndefined();
         _slide = Slide.create(0, _parentNode);
         expect(_parentNode.childNodes[0]).toBeDefined();
         expect(_parentNode.childNodes[0].childNodes[0]).toBeDefined();
       });

    it('should create HTML elements with the right classes and ids when the ' +
        'widget is a thumbnail', function() {
          _slide = Slide.create(0, _parentNode, true);
          expect(_parentNode.childNodes[0].tagName.toLowerCase()).toBe(
              'qowt-point-thumbnail');
          expect(_parentNode.childNodes[0].classList.contains(
              'qowt-point-thumb')).toBe(true);
          expect(_parentNode.childNodes[0].id).toBe('qowt-point-thumb-0');
          expect(_parentNode.childNodes[0].childNodes[0].tagName.toLowerCase()).
              toBe('div');
          expect(_parentNode.childNodes[0].childNodes[0].classList.contains(
              'qowt-point-index')).toBe(true);
          expect(_parentNode.childNodes[0].childNodes[1].classList.contains(
              'hidden-slide')).toBe(true);
          expect(_parentNode.childNodes[0].childNodes[1].childNodes[0].
              classList.contains('opaque-layer')).toBe(true);
          expect(_parentNode.childNodes[0].childNodes[1].childNodes[1].
              classList.contains('hidden-mark')).toBe(true);
          expect(_parentNode.childNodes[0].childNodes[2].classList.contains(
              'qowt-point-thumb-inner')).toBe(true);
          expect(_parentNode.childNodes[0].childNodes[2].id).toBe(
              'qowt-point-slide-inner0');
        });

    it('should not create hidden slide overlay when slide widget is not for' +
        ' thumbnail', function() {
          _slide = Slide.create(0, _parentNode, false);
          expect(_parentNode.childNodes[0].childNodes[1]).toBe(undefined);
        });

    it('should display for hidden overlay when slide widget is a thumbnail' +
        'and slide is set to be hidden', function() {
          _slide = Slide.create(0, _parentNode, true);
          _slide.setHiddenInSlideShow(true);
          expect(_parentNode.childNodes[0].childNodes[1].style.display).
              toBe('block');
        });
    it('should not display for hidden overlay when slide widget is a' +
        ' thumbnail and slide is set not to be hidden', function() {
          _slide = Slide.create(0, _parentNode, true);
          _slide.setHiddenInSlideShow(false);
          expect(_parentNode.childNodes[0].childNodes[1].style.display).
              toBe('none');
        });

    it('should return false when slide widget is a thumbnail and slide is set' +
        ' not to be hidden', function() {
          var returnValue;
          _slide = Slide.create(0, _parentNode, true);
          spyOn(_slide, 'isHidden').andCallThrough();
          _slide.setHiddenInSlideShow(false);
          returnValue = _slide.isHidden();
          expect(returnValue).toEqual(false);
        });

    it('should return true when slide widget is a thumbnail and slide is set' +
        ' to be hidden', function() {
          var returnValue;
          _slide = Slide.create(0, _parentNode, true);
          spyOn(_slide, 'isHidden').andCallThrough();
          _slide.setHiddenInSlideShow(true);
          returnValue = _slide.isHidden();
          expect(returnValue).toEqual(true);
        });

    it('should return false when slide widget is not thumbnail even when' +
        ' slide is set to be hidden', function() {
          var returnValue;
          _slide = Slide.create(0, _parentNode, false);
          spyOn(_slide, 'isHidden').andCallThrough();
          _slide.setHiddenInSlideShow(true);
          returnValue = _slide.isHidden();
          expect(returnValue).toEqual(false);
        });

    it('should return false when slide is not loaded', function() {
      _slide = Slide.create(0, _parentNode, true);
      expect(_slide.isLoaded()).toEqual(false);
    });

    it('should return true when slide is loaded', function() {
      _slide = Slide.create(0, _parentNode, true);
      _slide.setLoaded(true);
      expect(_slide.isLoaded()).toEqual(true);
    });

    it('should return false when slide is loaded', function() {
      _slide = Slide.create(0, _parentNode, true);
      _slide.setLoaded(false);
      expect(_slide.isLoaded()).toEqual(false);
    });

    describe('Utility APIs for shapes', function() {
      var _oldShapeCount, _inner, _shapeDiv, _slideDiv;
      beforeEach(function() {
        _slide = Slide.create(0, _parentNode, true);
        _inner = _slide.innerNode();

        _slideDiv = document.createElement('DIV');
        _slideDiv.setAttribute('qowt-divtype', 'slide');
        _inner.appendChild(_slideDiv);
        _oldShapeCount = _slide.getShapeCount();
        _shapeDiv = document.createElement('DIV');
        _shapeDiv.setAttribute('qowt-divtype', 'shape');
        _slideDiv.appendChild(_shapeDiv);
      });

      it('should return correct shape count', function() {

        var newShapeCount = _slide.getShapeCount();
        expect(_oldShapeCount).toEqual(0);
        expect(newShapeCount).toEqual(1);
      });

      it('should return correct shape node at given index', function() {

        var anotherTempDiv = document.createElement('DIV');
        anotherTempDiv.setAttribute('qowt-divtype', 'shape');
        _slideDiv.appendChild(anotherTempDiv);

        expect(_slide.getShapeNode(0)).toEqual(_shapeDiv);
        expect(_slide.getShapeNode(1)).toEqual(anotherTempDiv);
      });

      it('should return correct shape widget at given index', function() {
        spyOn(WidgetFactory, 'create');

        _slide.getShapeWidget(0);
        expect(WidgetFactory.create).toHaveBeenCalledWith(
            {fromNode: _shapeDiv});
      });


      it('should return all available placeholder shapes', function() {
        spyOn(WidgetFactory, 'create').andReturn(
            {isPlaceholderShape: function() {
              return true;
            }});

        var anotherTempDiv = document.createElement('DIV');
        anotherTempDiv.setAttribute('qowt-divtype', 'shape');
        _slideDiv.appendChild(anotherTempDiv);

        expect(_slide.getAllPlaceholderShapes().length).toEqual(2);
      });


      it('should return all specified placeholder shapes', function() {
        var dummyShapeWidget = {
          isPlaceholderShape: function() {
            return true;
          },
          getPlaceholderType: function() {
            return 'title';
          }
        };
        spyOn(WidgetFactory, 'create').andReturn(dummyShapeWidget);

        var anotherTempDiv = document.createElement('DIV');
        anotherTempDiv.setAttribute('qowt-divtype', 'shape');
        _slideDiv.appendChild(anotherTempDiv);

        expect(_slide.getAllPlaceholderShapes('title').length).toEqual(2);
        expect(_slide.getAllPlaceholderShapes('ctrTitle').length).toEqual(0);
        expect(_slide.getAllPlaceholderShapes('body').length).toEqual(0);
      });
    });

    it('should return all object nodes on the current slide', function() {
      _slide = Slide.create(0, _parentNode, true);

      var inner = _slide.innerNode();
      var shapeDiv = document.createElement('DIV');
      shapeDiv.setAttribute('qowt-divtype', 'shape');
      inner.appendChild(shapeDiv);

      var tableDiv = document.createElement('DIV');
      tableDiv.setAttribute('qowt-divtype', 'table');
      inner.appendChild(tableDiv);

      var chartDiv = document.createElement('DIV');
      chartDiv.setAttribute('qowt-divtype', 'grFrm');
      inner.appendChild(chartDiv);

      var elements = _slide.getAllObjectNodes();
      expect(elements.length).toEqual(3);
      expect(elements[0]).toEqual(shapeDiv);
      expect(elements[1]).toEqual(tableDiv);
      expect(elements[2]).toEqual(chartDiv);
    });

    it('should return a slide layout Id', function() {
      _slide = Slide.create(0, _parentNode);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      slideDiv.setAttribute('sldlt', 'E120');
      expect(_slide.getLayoutId()).toBe('E120');
    });


    it('should create HTML elements with the right classes and ids when the ' +
        'widget is a slide', function() {
          _slide = Slide.create(0, _parentNode);
          expect(_parentNode.childNodes[0].tagName.toLowerCase()).toBe('div');
          expect(_parentNode.childNodes[0].classList.contains(
                'qowt-point-slide')).toBe(true);
          expect(_parentNode.childNodes[0].classList.contains(
                'qowt-point-slide-shadow')).toBe(true);
          expect(_parentNode.childNodes[0].id).toBe('qowt-point-slide-0');
          expect(_parentNode.childNodes[0].childNodes[0].tagName.toLowerCase()).
              toBe('div');
          expect(_parentNode.childNodes[0].childNodes[1]).toBeUndefined();
        });

    it('should append the HTML elements of 4 thumbnails to the parent node',
       function() {
         _slide = Slide.create(0, _parentNode, true);
         _slide = Slide.create(1, _parentNode, true);
         _slide = Slide.create(2, _parentNode, true);
         _slide = Slide.create(3, _parentNode, true);
         expect(_parentNode.childNodes[0]).toBeDefined();
         expect(_parentNode.childNodes[1]).toBeDefined();
         expect(_parentNode.childNodes[2]).toBeDefined();
         expect(_parentNode.childNodes[3]).toBeDefined();
         expect(_parentNode.childNodes.length).toBe(4);
       });


    /**
     * test for setLayer() method
     */
    it('should add z-index correctly to slide node', function() {
      _slide = Slide.create(0, _parentNode, true);
      _slide.setLayer(1);
      expect(_slide.node().style.zIndex).toBe('1');
    });

    /**
     * test for empty() method
     */
    it('should empty slide widget inner node', function() {
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var tempDiv = document.createElement('DIV');
      inner.appendChild(tempDiv);
      expect(inner.hasChildNodes()).toBe(true);
      _slide.empty();
      expect(inner.hasChildNodes()).toBe(false);

    });

    /**
     * test for isEmpty() method
     */
    it('should empty slide widget inner node', function() {
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var tempDiv = document.createElement('DIV');
      inner.appendChild(tempDiv);
      expect(_slide.isEmpty()).toBe(false);
      _slide.empty();
      expect(_slide.isEmpty()).toBe(true);

    });

    it('should hide master and layout, if qowt-hideParentSp is set for div ' +
        'type slide', function() {
          _slide = Slide.create(0, _parentNode, true);
          var inner = _slide.innerNode();
          var slideDiv = document.createElement('DIV');
          inner.appendChild(slideDiv);
          slideDiv.setAttribute('qowt-divtype', 'slide');
          slideDiv.setAttribute('qowt-hideParentSp', 'true');
          _slide.handleParentShapes();
          expect(inner.classList.contains('hideSlideMaster')).toBe(true);
          expect(inner.classList.contains('hideSlideLayout')).toBe(true);
        });

    it('should hide master, if qowt-hideParentSp is set for div type ' +
        'slidelayout', function() {
          _slide = Slide.create(0, _parentNode, true);
          var inner = _slide.innerNode();
          var slideDiv = document.createElement('DIV');
          inner.appendChild(slideDiv);
          slideDiv.setAttribute('qowt-divtype', 'slideLayout');
          slideDiv.setAttribute('qowt-hideParentSp', 'true');
          _slide.handleParentShapes();
          expect(inner.classList.contains('hideSlideMaster')).toBe(true);
          expect(inner.classList.contains('hideSlideLayout')).toBe(false);
        });

    it('should add shape with shape action handler', function() {
      var shapeJson = {
        'eid': 'E629',
        'elm': [
          {
            'elm': [
              {
                'endParaRPr': {},
                'etp': 'para'
              }
            ],
            'etp': 'txBody'
          }
        ],
        'etp': 'sp',
        'nvSpPr': {},
        'spPr': {}
      };
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(WidgetFactory, 'create').andReturn({select: function() {}});
      spyOn(ShapeHandler, 'visit');
      spyOn(ShapeTextBodyHandler, 'visit');
      spyOn(TextParagraphHandler, 'visit');
      _slide.addShape(shapeJson);
      expect(ShapeHandler.visit).toHaveBeenCalled();
      expect(ShapeTextBodyHandler.visit).toHaveBeenCalled();
      expect(TextParagraphHandler.visit).toHaveBeenCalled();
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });

    it('should add shape with Image', function() {
      var shapeJson = {
        'eid': 'E629',
        'elm': [
          {
            'elm': [
              {
                'endParaRPr': {},
                'etp': 'para'
              }
            ],
            'etp': 'img'
          }
        ],
        'etp': 'pic',
        'nvSpPr': {},
        'spPr': {}
      };
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(WidgetFactory, 'create').andReturn({select: function() {}});
      spyOn(ShapeHandler, 'visit');
      spyOn(ImageHandler, 'visit');
      spyOn(ShapeTextBodyHandler, 'visit');
      spyOn(TextParagraphHandler, 'visit');
      _slide.addShape(shapeJson);
      expect(ShapeHandler.visit).toHaveBeenCalled();
      expect(ImageHandler.visit).toHaveBeenCalled();
      expect(TextParagraphHandler.visit).toHaveBeenCalled();
      expect(ShapeTextBodyHandler.visit).not.toHaveBeenCalled();
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });

    it('should add shape without text-body', function() {
      var shapeJson = {
        'eid': 'E629',
        'elm': [],
        'etp': 'sp',
        'nvSpPr': {},
        'spPr': {}
      };
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(WidgetFactory, 'create').andReturn({select: function() {}});
      spyOn(ShapeHandler, 'visit');
      spyOn(ShapeTextBodyHandler, 'visit');
      spyOn(TextParagraphHandler, 'visit');
      _slide.addShape(shapeJson);
      expect(ShapeHandler.visit).toHaveBeenCalled();
      expect(ShapeTextBodyHandler.visit).not.toHaveBeenCalled();
      expect(TextParagraphHandler.visit).not.toHaveBeenCalled();
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });

    it('should add WMF/EMF with meta text', function() {
      var shapeJson = {
        'eid': 'E629',
        'elm': [],
        'etp': 'mf',
        'nvSpPr': {},
        'spPr': {}
      };
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(WidgetFactory, 'create').andReturn({select: function() {}});
      spyOn(ShapeHandler, 'visit');
      spyOn(ShapeTextBodyHandler, 'visit');
      spyOn(TextParagraphHandler, 'visit');
      spyOn(MetaFileHandler, 'visit');
      _slide.addShape(shapeJson);
      expect(MetaFileHandler.visit).toHaveBeenCalled();
      expect(ShapeHandler.visit).not.toHaveBeenCalled();
      expect(ShapeTextBodyHandler.visit).not.toHaveBeenCalled();
      expect(TextParagraphHandler.visit).not.toHaveBeenCalled();
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });

    it('should add shape without paragraph', function() {
      var shapeJson = {
        'eid': 'E629',
        'elm': [
          {
            'elm': [

            ],
            'etp': 'txBody'
          }
        ],
        'etp': 'sp',
        'nvSpPr': {},
        'spPr': {}
      };
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      inner.appendChild(slideDiv);
      slideDiv.setAttribute('qowt-divtype', 'slide');
      spyOn(PubSub, 'publish').andCallThrough();
      spyOn(WidgetFactory, 'create').andReturn({select: function() {}});
      spyOn(ShapeHandler, 'visit');
      spyOn(ShapeTextBodyHandler, 'visit');
      spyOn(TextParagraphHandler, 'visit');
      _slide.addShape(shapeJson);
      expect(ShapeHandler.visit).toHaveBeenCalled();
      expect(ShapeTextBodyHandler.visit).toHaveBeenCalled();
      expect(TextParagraphHandler.visit).not.toHaveBeenCalled();
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
    });

    it('should generate shapeId', function() {
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var slideDiv = document.createElement('DIV');
      var shapeDiv = document.createElement('DIV');
      //if _slideContents contains only one element then it is a
      //slide-notes-div so checked for more than one element.
      var notesDiv = document.createElement('DIV');
      slideDiv.setAttribute('qowt-divtype', 'slide');
      QOWTMarkerUtils.addQOWTMarker(shapeDiv, 'shape-Id', 1);
      slideDiv.appendChild(shapeDiv);
      slideDiv.appendChild(notesDiv);
      inner.appendChild(slideDiv);
      expect(_slide.generateShapeId()).toBe(2);
    });

    it('should remove shape with given Id from the slide', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _slide = Slide.create(0, _parentNode, true);
      var inner = _slide.innerNode();
      var testShapeDiv = document.createElement('DIV');
      testShapeDiv.id = 'testShapeDiv';
      inner.appendChild(testShapeDiv);
      expect(document.getElementById('testShapeDiv')).not.toBe(null);
      _slide.removeShape('testShapeDiv');
      expect(PubSub.publish.calls[0].args[0]).toEqual(
          'qowt:clearSlideSelection');
      expect(document.getElementById('testShapeDiv')).toBe(null);
    });
    /**
     * test for setAnimationValues() method
     */
    it('should correctly set animation values to slide inner node', function() {

      _slide = Slide.create(0, _parentNode, true);
      _slide.setAnimationValues('someEffect', '1s');
      expect(_slide.innerNode().style.webkitAnimationName).toBe('someEffect');
      expect(_slide.innerNode().style.webkitAnimationDuration).toBe('1s');
      expect(_slide.innerNode().style.webkitAnimationIterationCount).toBe('1');
      expect(_slide.innerNode().style.webkitAnimationTimingFunction).toBe(
          'linear');
    });

    it('should listen to webkitAnimationEnd system event and should dispatch ' +
        'qowt:animationDone qowt event',
        function() {
          _slide = Slide.create(0, _parentNode, true);
          var animationEndEvt = document.createEvent('Event');
          animationEndEvt.initEvent('webkitAnimationEnd', true, false);

          spyOn(DomListener, 'dispatchEvent');

          _slide.innerNode().dispatchEvent(animationEndEvt);
          expect(DomListener.dispatchEvent).toHaveBeenCalledWith(document,
              'qowt:animationDone', {type: 'transition', slideIndex: 0,
                withEffect: ''});
        });

    describe('changeSlideInnerElementsId', function() {
      it('should remove t- prefix form  element ids when element are from' +
          'slide workspace area', function() {
            _slide = Slide.create(0, _parentNode, false);
            var inner = _slide.innerNode();
            var slideDiv = document.createElement('DIV');
            var shapeDiv = document.createElement('DIV');
            shapeDiv.id = 't-dummyId';

            slideDiv.appendChild(shapeDiv);
            inner.appendChild(slideDiv);
            _slide.changeSlideInnerElementsId();
            expect(shapeDiv.id).toBe('dummyId');
         });
      it('should prefix element ids with t- when element are from thumbnail',
          function() {
            _slide = Slide.create(0, _parentNode, true);
            var inner = _slide.innerNode();
            var slideDiv = document.createElement('DIV');
            var shapeDiv = document.createElement('DIV');
            shapeDiv.id = 'dummyId';

            slideDiv.appendChild(shapeDiv);
            inner.appendChild(slideDiv);
            _slide.changeSlideInnerElementsId();
            expect(shapeDiv.id).toBe('t-dummyId');
         });
    });

    //TODO write tests for following
    // _animationDoneHandler() working though private
  });
});
