define([
  'qowtRoot/models/point',
  'qowtRoot/widgets/point/thumbnailStrip',
  'qowtRoot/widgets/point/slidesContainer',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/features/utils'
], function(
    PointModel,
    ThumbnailStrip,
    SlidesContainer,
    QOWTMarkerUtils,
    Features) {

  'use strict';

  describe('Point slides container widget', function() {

    var _slidesContainer, _parentNode, _thumbnailStrip;

    var thumbNode1 = document.createElement('DIV');
    var child1 = document.createElement('DIV');
    child1.id = 'dummyChildIdOne';
    child1.setAttribute('qowt-divType', 'slide');
    thumbNode1.appendChild(child1);
    var backgroundChild1 = document.createElement('DIV');
    backgroundChild1.className = 'slideBackground';
    thumbNode1.appendChild(backgroundChild1);
    var thumb1 = { innerNode: function() {
      return thumbNode1;
    }};


    var thumbNode2 = document.createElement('DIV');
    var child2 = document.createElement('DIV');
    child2.id = 'dummyChildIdTwo';
    child2.setAttribute('qowt-divType', 'slide');
    thumbNode2.appendChild(child2);
    var backgroundChild2 = document.createElement('DIV');
    backgroundChild2.className = 'slideBackground';
    thumbNode2.appendChild(backgroundChild2);
    var thumb2 = { innerNode: function() {
      return thumbNode2;
    }};


    var thumbNode3 = document.createElement('DIV');
    var child3 = document.createElement('DIV');
    child3.id = 'dummyChildIdThree';
    child3.setAttribute('qowt-divType', 'slide');
    thumbNode3.appendChild(child3);
    var backgroundChild3 = document.createElement('DIV');
    backgroundChild3.className = 'slideBackground';
    thumbNode3.appendChild(backgroundChild3);
    var thumb3 = { innerNode: function() {
      return thumbNode3;
    }};

    var thumbNode4 = document.createElement('DIV');
    var child4a = document.createElement('DIV');
    QOWTMarkerUtils.addQOWTMarker(child4a, 'hyperlink', 'some link');

    QOWTMarkerUtils.addQOWTMarker(child4a, 'textHyperlink', 'some link');

    child4a.id = 'dummyChildIdfour';
    child4a.setAttribute('qowt-divType', 'slide');
    thumbNode4.appendChild(child4a);
    var backgroundChild4 = document.createElement('DIV');
    backgroundChild4.className = 'slideBackground';
    thumbNode4.appendChild(backgroundChild4);

    var child4b = document.createElement('DIV');
    QOWTMarkerUtils.addQOWTMarker(child4b, 'hyperlink', 'some link');

    QOWTMarkerUtils.addQOWTMarker(child4b, 'textHyperlink', 'some link');

    child4b.id = 'dummyChildIdfour';
    child4b.setAttribute('qowt-divType', 'slide');
    thumbNode4.appendChild(child4b);


    var child4c = document.createElement('DIV');
    child4c.id = 'dummyChildIdfour';
    child4c.setAttribute('qowt-divType', 'slide');
    thumbNode4.appendChild(child4c);

    var thumb4 = { innerNode: function() {
      return thumbNode4;
    }};

    var fakeThumbnail = function(slideIndex) {
      var t;
      switch (slideIndex) {
        case 0:
          t = thumb1;
          break;
        case 1:
          t = thumb2;
          break;
        case 2:
          t = thumb3;
          break;
        case 3:
          t = thumb4;
          break;
        default:
          break;
      }
      return t;
    };

    beforeEach(function() {
      SlidesContainer.init();
      PointModel.slideShowMode = false;
      _parentNode = document.createElement('div');
      _slidesContainer = SlidesContainer;
      _slidesContainer.appendTo(_parentNode);
      _thumbnailStrip = ThumbnailStrip;

      spyOn(_thumbnailStrip, 'thumbnail').andCallFake(fakeThumbnail);

      _slidesContainer.emptySlidesContainer();
    });

    afterEach(function() {
      PointModel.slideShowMode = false;
      _slidesContainer.emptySlidesContainer();
      _slidesContainer = undefined;
      _parentNode = undefined;
      _thumbnailStrip = undefined;
    });

    it('should throw if slidesContainer.init() called multiple times',
        function() {
          expect(function() {
            SlidesContainer.init();
          }).toThrow('slidesContainer.init() called multiple times.');
        });
    //setupForSlideShow

    it('should initialise properly', function() {
      var _slidesContainerNodeTemp = _parentNode.childNodes[0];
      var _slidesZoomContainerNodeTemp =
          _parentNode.childNodes[0].childNodes[0];
      expect(_slidesContainerNodeTemp).not.toBe(undefined);
      expect(_slidesZoomContainerNodeTemp).not.toBe(undefined);
      expect(_slidesContainerNodeTemp.classList.contains(
            'qowt-point-slides-container')).toBe(true);
      expect(_slidesZoomContainerNodeTemp.classList.contains(
          'qowt-point-slides-zoom-container')).toBe(true);
    });
    it('should setup for slide show properly when we have 3 slides and' +
        ' current slide set is first', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(0);
          _slidesContainer.setupForSlideShow();

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              0);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');

        });

    it('should setup for slide show properly when we have 3 slides and' +
        ' current slide set is second', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(1);
          _slidesContainer.setupForSlideShow();

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
        });

    it('should setup for slide show properly when we have 3 slides and' +
        ' current slide set is third', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(2);
          _slidesContainer.setupForSlideShow();

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              2);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);

        });

    it('should setup for slide show properly when we have 5 slides and' +
        ' current slide set is out of range i.e. sixth slide', function() {
          PointModel.numberOfSlidesInPreso = 5;

          _slidesContainer.setSlide(5);
          _slidesContainer.setupForSlideShow();

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
        });


    //emptySlidesContainer

    it('should clear all three slide widgets when emptySlidesContainer() ' +
        'method is called', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(1);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(0);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');

          _slidesContainer.emptySlidesContainer();

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              'EMPTY');
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
        });


    //setSlide


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is first and slide show mode is off',
       function() {
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(0);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).toBe(
             'EMPTY');
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             0);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             hasChildNodes()).toBe(false);
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdOne');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');
       });


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is second and slide show mode is off',
       function() {
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(1);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
             toBe(0);
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             1);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdOne');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdThree');
       });


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is third and slide show mode is off',
       function() {
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(2);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
             toBe(1);
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             2);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
             'EMPTY');

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdThree');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             hasChildNodes()).toBe(false);
       });


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is first and slide show mode is on',
       function() {
         _slidesContainer.setupForSlideShow();
         PointModel.slideShowMode = true;
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(0);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
             toBe('EMPTY');
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             0);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             hasChildNodes()).toBe(false);

         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdOne');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().style.
             display).toBe('block');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().style.
             display).toBe('none');
         expect(_slidesContainer.getNextSlideWidget().innerNode().style.
             display).toBe('none');
       });

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is second and slide show mode is on',
       function() {
         _slidesContainer.setupForSlideShow();
         PointModel.slideShowMode = true;
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(1);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
             toBe(0);
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             1);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdOne');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdThree');

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().style.
             display).toBe('block');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().style.
             display).toBe('none');
         expect(_slidesContainer.getNextSlideWidget().innerNode().style.
             display).toBe('none');
       });

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is third and slide show mode is on',
       function() {
         _slidesContainer.setupForSlideShow();
         PointModel.slideShowMode = true;
         PointModel.numberOfSlidesInPreso = 3;

         _slidesContainer.setSlide(2);

         expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
             toBe(1);
         expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
             2);
         expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
             'EMPTY');

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdTwo');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().
             childNodes[0].id).toBe('dummyChildIdThree');
         expect(_slidesContainer.getNextSlideWidget().innerNode().
             hasChildNodes()).toBe(false);

         expect(_slidesContainer.getPreviousSlideWidget().innerNode().style.
             display).toBe('block');
         expect(_slidesContainer.getCurrentSlideWidget().innerNode().style.
             display).toBe('none');
         expect(_slidesContainer.getNextSlideWidget().innerNode().style.
             display).toBe('none');
       });


    //setSlide with navigation
    //down navigation - step


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is first and slide show mode is off and we' +
        ' are navigating to slide 2', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(0);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              0);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');

          _slidesContainer.setSlide(1);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(0);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('2');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('1');
        });


    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is second and slide show mode is off and we' +
        ' are navigating to slide 3', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(1);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(0);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');

          _slidesContainer.setSlide(2);


          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(1);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              2);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('2');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('1');
        });


    //up navigation - step

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is third and slide show mode is off and we' +
        ' are navigating to slide 2', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(2);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(1);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              2);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);

          _slidesContainer.setSlide(1);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(0);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('1');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('2');
        });

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is two and slide show mode is off and we are' +
        ' navigating to slide 1', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(1);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(0);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              1);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(2);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');

          _slidesContainer.setSlide(0);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              0);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('1');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('2');
        });


    //down navigation - jump

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is first and slide show mode is off and we' +
        ' are navigating to slide 3', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(0);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              0);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');

          _slidesContainer.setSlide(2); // jump

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(1);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              2);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('1');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('2');
        });


    //up navigation - jump

    it('should populate slide widgets properly when we have 3 slides in total' +
        ' and current slide set is third and slide show mode is off and we' +
        ' are navigating to slide 1', function() {
          PointModel.numberOfSlidesInPreso = 3;

          _slidesContainer.setSlide(2);

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe(1);
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              2);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(
              'EMPTY');

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdThree');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              hasChildNodes()).toBe(false);

          _slidesContainer.setSlide(0); // jump

          expect(_slidesContainer.getPreviousSlideWidget().getSlideIndex()).
              toBe('EMPTY');
          expect(_slidesContainer.getCurrentSlideWidget().getSlideIndex()).toBe(
              0);
          expect(_slidesContainer.getNextSlideWidget().getSlideIndex()).toBe(1);

          expect(_slidesContainer.getPreviousSlideWidget().innerNode().
              hasChildNodes()).toBe(false);
          expect(_slidesContainer.getCurrentSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdOne');
          expect(_slidesContainer.getNextSlideWidget().innerNode().
              childNodes[0].id).toBe('dummyChildIdTwo');

          expect(_slidesContainer.getCurrentSlideWidget().node().style.zIndex).
              toBe('3');
          expect(_slidesContainer.getPreviousSlideWidget().node().style.zIndex).
              toBe('1');
          expect(_slidesContainer.getNextSlideWidget().node().style.zIndex).
              toBe('2');
        });

    it('should create a slides container widget and append it to a parent node',
       function() {
         expect(_parentNode.childNodes[0].tagName.toLowerCase()).toBe('div');
         expect(_parentNode.childNodes[0].classList.contains(
             'qowt-point-slides-container')).toBe(true);
         expect(_parentNode.childNodes[0].id).toBe(
             'qowt-point-slides-container');
         expect(_parentNode.childNodes[0].childNodes[0].tagName.toLowerCase()).
             toBe('div');
         expect(_parentNode.childNodes[0].childNodes[0].classList.contains(
             'qowt-point-slides-zoom-container')).toBe(true);
         expect(_parentNode.childNodes[0].childNodes[0].id).toBe(
             'qowt-point-slides-zoom-container');
       });

    it('should append three slide widgets to the slides container', function() {
      expect(_parentNode.childNodes[0].childNodes[0].childNodes.length).toBe(3);
      expect(_parentNode.childNodes[0].childNodes[0].childNodes[0].id).toBe(
          'qowt-point-slide-EMPTY');
      expect(_parentNode.childNodes[0].childNodes[0].childNodes[1].id).toBe(
          'qowt-point-slide-EMPTY');
      expect(_parentNode.childNodes[0].childNodes[0].childNodes[2].id).toBe(
          'qowt-point-slide-EMPTY');
    });

    it('should toggle webkit shadow when entering fullscreen mode', function() {
      _slidesContainer.toggleShadow();

      expect(_slidesContainer.getPreviousSlideWidget().innerNode().
          classList.contains('qowt-point-slide-shadow')).toBe(false);
      expect(_slidesContainer.getCurrentSlideWidget().innerNode().
          classList.contains('qowt-point-slide-shadow')).toBe(false);
      expect(_slidesContainer.getNextSlideWidget().innerNode().
          classList.contains('qowt-point-slide-shadow')).toBe(false);
    });

    it('should return false if all elements from thumbnail are not cloned to' +
        ' slide', function() {
          _slidesContainer.setSlide(0);
          _slidesContainer.setSlide(1);
          var currentSlideNode = _slidesContainer.getCurrentSlideWidget().
              innerNode();
          while (currentSlideNode.hasChildNodes()) {
            currentSlideNode.removeChild(currentSlideNode.firstChild);
          }

          var result = _slidesContainer.isThumbClonedCompletely(1);
          expect(result).toEqual(false);
        });

    it('should disable text selection when entering slideShow mode',
       function() {
         _slidesContainer.disableTextSelection();

         expect(_slidesContainer.getCurrentSlideWidget().node().
             classList.contains('qowt-selectText')).toBe(false);
       });

    it('should enable text selection when exiting slideShow mode', function() {
      spyOn(Features, 'isEnabled').andReturn(false);
      _slidesContainer.enableTextSelection();

      expect(_slidesContainer.getCurrentSlideWidget().node().classList.contains(
          'qowt-selectText')).toBe(true);
    });

    it('should empty current slide on clearSlideContainer', function() {
      _slidesContainer.setSlide(0);
      spyOn(_slidesContainer.getCurrentSlideWidget(), 'empty');
      _slidesContainer.clearSlideContainer();

      expect(_slidesContainer.getCurrentSlideWidget().empty).toHaveBeenCalled();
    });
  });
});
