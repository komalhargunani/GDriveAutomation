
define([
  'qowtRoot/models/point',
  'qowtRoot/presentation/layoutsManager',
  'qowtRoot/dcp/decorators/slideFillDecorator'
], function(PointModel,
            LayoutsManager,
            SlideFillDecorator) {

  'use strict';
  var _factory = {

    create: function() {

      // use module pattern for instance object
      var module = function() {

        /**
         * creates the slide div
         * @param id {String} slide id
         * @return {DOM} the slide div
         */
        var _createSlide = function(id, slideType) {
          //TODO: This function is more of creational in nature, and hence this
          // ideally needs to be inside some factory/abstract factory in some
          // hierarchy, like an ElementAbstractFactory and SlideFactory
          var slide = document.createElement('div');

          if(LayoutsManager.isReRenderingCurrentSlide() === true &&
              (slideType === 'sldlt' || slideType === 'sldmt')) {
            id += PointModel.SlideId;
          }

          slide.id = id;
          slide.className = "slideSize printSlide";
          return slide;
        };

        /**
         * sets the style css properties of the slide
         * @param slide {DOM} slide div
         */
        var _styleSlide = function(slide) {
          slide.classList.add("qowt-slide");
        };

        /**
         * sets the correct slide div-type and z-order, whether, slide,
         * slide-layout or master-layout Sets the z-index of slide,
         * slide-layout or master-layout to 3,2,1, respectively, as they need
         * to be in that order
         * @param slideType {String} slide-type
         * @param slide {DOM} slide div
         */
        var _setDivTypeAndZOrder = function(slideType, slide) {
          switch (slideType) {
            case 'sld':
              slide.setAttribute('qowt-divType', 'slide');
              slide.style['z-index'] = 3;
              break;
            case 'sldlt':
              slide.setAttribute('qowt-divType', 'slideLayout');
              slide.style['z-index'] = 2;
              break;
            case 'sldmt':
              slide.setAttribute('qowt-divType', 'slideMaster');
              slide.style['z-index'] = 1;
              break;
            default:
              break;
          }
        };

        var _api = {
          /**
           * Render a Slide element from DCP
           * @param slideResponse parent node containing slide JSON and HTML
           *                      node
           * @param slideDiv HTML slide div
           * @return {Object} api object containing decorator functions
           */
          decorate: function(slideResponse, slideDiv) {
            var slide = slideResponse.el;
            var _localApi = {

              /**
               * decorator / creator of the new slide div
               */
              withNewDiv: function() {
                if (!slideDiv) {
                  slideDiv = _createSlide(slide.eid, slide.etp);
                }
                return _localApi;
              },

              /**
               * decorates with slide z-index and other styles
               */
              withSlideProperties: function() {
                _styleSlide(slideDiv);
                _setDivTypeAndZOrder(slide.etp, slideDiv);
                return _localApi;
              },

              /**
               * decorates with slide backgroundDiv
               */
              withBackgroundDiv: function() {
                var backgroundDiv = document.createElement('div');
                backgroundDiv.id = 'backgroundDiv' + slide.eid;
                backgroundDiv.className = 'slideBackground ' +
                    'slideSize printSlide';

                slideResponse.node.appendChild(backgroundDiv);

                // append attributes on the div
                backgroundDiv.setAttribute('masterid',
                    PointModel.MasterSlideId);
                backgroundDiv.setAttribute('layoutid',
                    PointModel.SlideLayoutId);
                backgroundDiv.setAttribute('slideid', slide.eid);

                // Fill specified at the slide level overrides those specified
                // in layout and master. Fills are defined using CSS attribute
                // selectors.
                if (slide.fill || slide.bgFillRef) {
                  // TODO (murtaza.haveliwala): (Crbug - 431196) Refactor this
                  // to apply styles explicitly using style attribute and not
                  // via CSS attribute classes

                  // prepare selector in the form -
                  // .slideBackground[masterid="foo"][layoutid="bar"]
                  // [slideid="baz"]
                  var cssSelector = '.slideBackground[masterid="' + PointModel.
                      MasterSlideId + '"][layoutid="' + PointModel.
                      SlideLayoutId + '"][slideid="' + slide.eid + '"]';

                  SlideFillDecorator.setFill(cssSelector, slide);
                }

                return _localApi;
              },

              /**
               * getter for the decorated div
               * @return {DOM Object} returns the decorated div
               */
              getDecoratedDiv: function() {
                return slideDiv;
              }
            };
            return _localApi;
          }
        };

        return _api;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
