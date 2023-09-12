
define([
  'qowtRoot/media/insertMediaHandler',
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/converters/pt2mm',
  'qowtRoot/utils/converters/px2pt',
  'qowtRoot/utils/converters/twip2pt'
], function(
    InsertMediaHandler,
    EnvModel,
    PubSub,
    Converter,
    DomTextSelection
    /*pt2mm*/
    /*px2pt*/
    /*twip2pt*/) {

  'use strict';

  // TODO(umesh.kadam): There is no uniformity in the units used for different
  // widgets; some use 'twips', some 'pt'; Core to Qowt or Qowt to core
  // communication sometimes happens in 'mm', sometimes in 'twips' etc. Get rid
  // of all these and unify one unit which is used all across.

  // following are in 'twips'
  var PAGE_HEIGHT = 16834;
  var PAGE_WIDTH = 11909;

  // following are in 'pt'
  var PAGE_MARGIN_LEFT = 30;
  var PAGE_MARGIN_RIGHT = 30;
  var PAGE_MARGIN_TOP = 20;
  var PAGE_MARGIN_BOTTOM = 20;


  describe('Test insertMediaHandler_.js', function() {
    var insertMediaHandler_;
    beforeEach(function() {
      EnvModel.app = 'word';
      insertMediaHandler_ = InsertMediaHandler.create();
    });


    describe('insertMediaHandler_.getMediaDimensionsAdjusted', function() {
      var page_, section_, media_, sandbox_;
      var mediaHeightInPt_, mediaWidthInPt_, sectionWidthInPt_,
          sectionHeightInPt_;
      var expectedMediaHeightInTwip_, expectedMediaWidthInTwip_;

      function initializeData_() {
        page_ = document.getElementById('page');
        assert.isNotNull(page_);
        createAndAddSectionToPage_(page_);
        section_ = Polymer.dom(page_).lastChild;
        assert.isDefined(section_);
        media_ = {};
        // Dimensions are in pixels.
        media_.properties = {
          wdt: 5184,
          hgt: 3456
        };

        // convert all to 'pt' for simplicity of calculation
        mediaHeightInPt_ = Converter.px2pt(media_.properties.hgt);
        mediaWidthInPt_ = Converter.px2pt(media_.properties.wdt);
        sectionWidthInPt_ = Converter.twip2pt(section_.pageSize.width);
        sectionHeightInPt_ = Converter.twip2pt(section_.pageSize.height);
        sandbox_ = sinon.sandbox.create();
      }

      function resetData_() {
        sandbox_.restore();
        section_ = page_ = media_ = undefined;
        mediaHeightInPt_ = sectionHeightInPt_ = sectionWidthInPt_ = undefined;
        expectedMediaHeightInTwip_ = expectedMediaWidthInTwip_ = undefined;
      }


      beforeEach(function() {
        this.stampOutTempl('insert-media-test-template');
        initializeData_();

        function returnSection_() {return section_;}
        sandbox_.stub(insertMediaHandler_, 'getContainerElementForMedia_',
            returnSection_);
        sandbox_.stub(insertMediaHandler_, 'getSection_', returnSection_);
      });


      afterEach(function() {
        resetData_();
      });


      it('should not alter the dimensions of the media if the height and ' +
          'width of the media are lesser than that of the page/section',
          function() {
            mediaHeightInPt_ = sectionHeightInPt_ - 300;
            mediaWidthInPt_ = sectionWidthInPt_ - 210;

            assert.isTrue(mediaHeightInPt_ > 0, 'media height should be +ve');
            assert.isTrue(mediaWidthInPt_ > 0, 'media width should be +ve');

            // We should have the media dimensions in px and not in 'pt'
            // It was merely for the sake of calculation we had converted the
            // unit to 'pt'. Convert the calculated value to 'px'
            media_.properties.hgt = Converter.pt2px(mediaHeightInPt_);
            media_.properties.wdt = Converter.pt2px(mediaWidthInPt_);

            // The resulting dimensions will be in twip because core needs the
            // units to be twip. Thus we check the resulting dimension with
            // original dimensions in twip
            expectedMediaHeightInTwip_ = Converter.pt2twip(mediaHeightInPt_);
            expectedMediaWidthInTwip_ = Converter.pt2twip(mediaWidthInPt_);
            insertMediaHandler_.getMediaDimensionsAdjusted(media_.properties);

            // values should not be altered.
            assert.strictEqual(expectedMediaHeightInTwip_,
                media_.properties.hgt);
            assert.strictEqual(expectedMediaWidthInTwip_,
                media_.properties.wdt);
          });


      it('should adjust the media\'s height and width without losing the ' +
          'aspect ratio when media.width > section.width and media.height <= ' +
          'section.height', function() {

            mediaHeightInPt_ = sectionHeightInPt_ - 300;
            assert.isTrue(mediaHeightInPt_ > 0, 'media height should be +ve');
            assert.isTrue(mediaWidthInPt_ > sectionWidthInPt_,
                'media.width should be > than section.width for testing');

            var ratioHgtToWdt = mediaHeightInPt_ / mediaWidthInPt_;
            // We should have the media dimensions in px and not in 'pt'
            // It was merely for the sake of calculation we had converted the
            // unit to 'pt'. Convert the calculated value to 'px'
            media_.properties.hgt = Converter.pt2px(mediaHeightInPt_);

            // The resulting dimensions will be in twip because core needs the
            // units to be twip. Thus we check the resulting dimension with
            // original dimensions in twip
            expectedMediaWidthInTwip_ = Converter.pt2twip(mediaWidthInPt_);
            insertMediaHandler_.getMediaDimensionsAdjusted(media_.properties);

            // values should be altered to fit media in section and aspect ratio
            // maintained.
            var expectedMediaHeight_ = ratioHgtToWdt *
                Converter.twip2pt(media_.properties.wdt);
            assert.strictEqual(Math.floor(expectedMediaHeight_),
                Math.floor(Converter.twip2pt(media_.properties.hgt)));
            assert.notStrictEqual(expectedMediaWidthInTwip_,
                media_.properties.wdt);
            var sectionWidthInTwip_ = Converter.pt2twip(sectionWidthInPt_);
            assert.isTrue(
                media_.properties.wdt <= sectionWidthInTwip_,
                'media.width should be <= section.width after adjusting');
          });


      it('should adjust the media\'s height and width without losing the ' +
          'aspect ratio when media.height > section.height and media.width ' +
          '<= section.width', function() {

            mediaWidthInPt_ = sectionWidthInPt_ - 300;
            assert.isTrue(mediaWidthInPt_ > 0, 'media width should be +ve');
            assert.isTrue(mediaHeightInPt_ > sectionHeightInPt_,
                'media.height should be > than section.height for testing');

            var ratioWdtToHgt = mediaWidthInPt_ / mediaHeightInPt_;
            // We should have the media dimensions in px and not in 'pt'
            // It was merely for the sake of calculation we had converted the
            // unit to 'pt'. Convert the calculated value to 'px'
            media_.properties.wdt = Converter.pt2px(mediaWidthInPt_);
            // The resulting dimensions will be in twip because core needs the
            // units to be twip. Thus we check the resulting dimension with
            // original dimensions in twip
            expectedMediaHeightInTwip_ = Converter.pt2twip(mediaHeightInPt_);
            insertMediaHandler_.getMediaDimensionsAdjusted(media_.properties);

            // values should be altered to fit media in section and aspect ratio
            // maintained.
            var expectedMediaWidth_ = ratioWdtToHgt *
                Converter.twip2pt(media_.properties.hgt);
            assert.strictEqual(Math.floor(expectedMediaWidth_),
                Math.floor(Converter.twip2pt(media_.properties.wdt)));
            assert.notStrictEqual(Math.floor(expectedMediaHeightInTwip_),
                Math.floor(media_.properties.hgt));
            var sectionHeightInTwip_ =
                Math.floor(Converter.pt2twip(sectionHeightInPt_));
            assert.isTrue(
                Math.floor(media_.properties.hgt) <= sectionHeightInTwip_,
                'media.height should be <= section.height after adjusting');
          });


      it('should adjust the media\'s height and width without losing the ' +
          'aspect ratio when media.height > section.height and media.width ' +
          '> section.width', function() {

            assert.isTrue(mediaWidthInPt_ > sectionWidthInPt_,
                'media.width should be > than section.width for testing');
            assert.isTrue(mediaHeightInPt_ > sectionHeightInPt_,
                'media.height should be > than section.height for testing');

            var ratioHgtToWdt = mediaHeightInPt_ / mediaWidthInPt_;
            // The resulting dimensions will be in twip because core needs the
            // units to be twip. Thus we check the resulting dimension with
            // original dimensions in twip
            expectedMediaHeightInTwip_ = Converter.pt2twip(mediaHeightInPt_);
            expectedMediaWidthInTwip_ = Converter.pt2twip(mediaWidthInPt_);
            insertMediaHandler_.getMediaDimensionsAdjusted(media_.properties);

            // media height and width should not be the same as earlier after
            // the function call.
            assert.notStrictEqual(Math.floor(expectedMediaHeightInTwip_),
                Math.floor(media_.properties.hgt));
            assert.notStrictEqual(Math.floor(expectedMediaWidthInTwip_),
                Math.floor(media_.properties.wdt));


            var sectionWidthInTwip_ =
                Math.floor(Converter.pt2twip(sectionWidthInPt_));
            assert.isTrue(
                Math.floor(media_.properties.wdt) <= sectionWidthInTwip_,
                'media.width should be <= section.width after adjusting');
            var sectionHeightInTwip_ =
                Math.floor(Converter.pt2twip(sectionHeightInPt_));
            assert.isTrue(
                Math.floor(media_.properties.hgt) <= sectionHeightInTwip_,
                'media.height should be <= section.height after adjusting');
            // ensure that the aspect ratio is maintained
            var expectedMediaHeight_ = ratioHgtToWdt *
                Converter.twip2pt(media_.properties.wdt);
            assert.strictEqual(Math.floor(expectedMediaHeight_),
                Math.floor(Converter.twip2pt(media_.properties.hgt)));
          });
    });


    describe('Test insertMediaHandler_ transaction calls', function() {
      var sandbox_;

      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
      });


      afterEach(function() {
        sandbox_.restore();
      });


      describe('insertMediaHandler_.startTransaction', function() {
        it('should publish startTransaction signal with an indication to ' +
            'mutation manager to not reset the transactions', function() {
              sandbox_.spy(PubSub, 'publish');
              insertMediaHandler_.startTransaction_();
              assert.strictEqual(PubSub.publish.callCount, 1);

              var signal = 'qowt:doAction';
              var signalData = {
                'action': 'startTransaction',
                'context': {
                  'contentType': 'mutation',
                  'doNotResetTxn': true
                }
              };
              assert.isTrue(PubSub.publish.calledWith(signal, signalData));
            });
      });


      describe('insertMediaHandler_.endTransaction', function() {
        it('should publish endTransaction signal with an indication to ' +
            'mutation manager start resetting the transactions', function() {
              sandbox_.spy(PubSub, 'publish');
              insertMediaHandler_.endTransaction_();
              assert.strictEqual(PubSub.publish.callCount, 1);

              var signal = 'qowt:doAction';
              var signalData = {
                'action': 'endTransaction',
                'context': {
                  'contentType': 'mutation',
                  'doNotResetTxn': true
                }
              };
              assert.isTrue(PubSub.publish.calledWith(signal, signalData));
            });
      });
    });


    describe('insertMediaHandler_.splitRunIfNeeded', function() {
      var sandbox_;

      beforeEach(function() {
        sandbox_ = sinon.sandbox.create();
        sandbox_.stub(PubSub, 'publish');
      });


      afterEach(function() {
        sandbox_.restore();
      });


      it('should not break the run if the caret is not between the run',
          function() {
            // DomTextSelection.getRange() - called by
            // insertMediaHandler_.splitRunIfNeeded()
            sandbox_.stub(DomTextSelection, 'getRange', function() {
              var range = {};
              range.isCollapsed = true;
              range.startContainer = {
                nodeType: Node.TEXT_NODE,
                parentNode: {
                  textContent: 'SomeNodeThatWeDontCare',
                  length: 'SomeNodeThatWeDontCare'.length
                }
              };
              range.endContainer = {
                nodeType: Node.TEXT_NODE,
                parentNode: {
                  textContent: 'SomeNodeThatWeDontCare',
                  length: 'SomeNodeThatWeDontCare'.length
                }
              };
              // says that the caret is at the beginning of the text
              range.startOffset = 0;
              range.endOffset = 0;
              return range;
            });


            insertMediaHandler_.splitRunIfNeeded();
            var range = DomTextSelection.getRange();
            var signal = 'qowt:doAction';
            var signalData = {
              'action': 'breakRun',
              'context': {
                'contentType': 'text',
                'node': range.startContainer.parentNode,
                'offset': range.startOffset
              }
            };
            assert.isFalse(PubSub.publish.calledWith(signal, signalData));
          });


      it('should break the run if the caret lies in between the run',
          function() {
            // DomTextSelection.getRange() - called by
            // insertMediaHandler_.splitRunIfNeeded()
            sandbox_.stub(DomTextSelection, 'getRange', function() {
              var range = {};
              range.isCollapsed = true;
              range.startContainer = {
                nodeType: Node.TEXT_NODE,
                parentNode: {
                  textContent: 'SomeNodeThatWeDontCare',
                  length: 'SomeNodeThatWeDontCare'.length
                }
              };
              range.endContainer = {
                nodeType: Node.TEXT_NODE,
                parentNode: {
                  textContent: 'SomeNodeThatWeDontCare',
                  length: 'SomeNodeThatWeDontCare'.length
                }
              };
              // says that the caret lies in-between the text
              range.startOffset = 4;
              range.endOffset = 4;
              return range;
            });

            insertMediaHandler_.splitRunIfNeeded();
            var range = DomTextSelection.getRange();
            var signal = 'qowt:doAction';
            var signalData = {
              'action': 'breakRun',
              'context': {
                'contentType': 'text',
                'node': range.startContainer.parentNode,
                'offset': range.startOffset
              }
            };
            assert.isTrue(PubSub.publish.calledWith(signal, signalData));
          });
    });


    describe('insertMediaHandler_.tryToRegisterMedia', function() {
      var media_;
      var error = 'cannot register media; insufficient data!!';

      beforeEach(function() {
        media_ = {
          src: 'someVideo.avi',
          data: new ArrayBuffer()
        };
      });


      it('should throw error if media.src is undefined', function() {
        delete media_.src;
        assert.throw(function() {
          insertMediaHandler_.tryToRegisterMedia(media_);
        }, error);
      });


      it('should throw error if media.data is undefined', function() {
        delete media_.data;
        assert.throw(function() {
          insertMediaHandler_.tryToRegisterMedia(media_);
        }, error);
      });


      it('should throw error if media.data is not an ArrayBuffer', function() {
        media_.data = 'Some data-type but ArrayBuffer';
        assert.throw(function() {
          insertMediaHandler_.tryToRegisterMedia(media_);
        });
      });


      it('should not throw error if media has required data', function() {
        assert.doesNotThrow(function() {
          insertMediaHandler_.tryToRegisterMedia(media_);
        }, error);
      });
    });


    describe('insertMediaHandler_.getMediaExtensionFromName', function() {
      it('should return the extension from the image name', function() {
        var imageName = '/someName.png';
        var extension =
                insertMediaHandler_.getMediaExtensionFromName(imageName);
        assert.strictEqual(extension, 'png');
      });


      it('should return undefined if the image name does not have extension',
          function() {
            var imageName = '/someNameWithoutExtension';
            var extension =
                insertMediaHandler_.getMediaExtensionFromName(imageName);
            assert.isUndefined(extension);
          });
    });


    describe('insertMediaHandler_.getMediaExtensionFromMimeType', function() {
      it('should return the extension from the image format', function() {
        var imageFormat = 'image/jpeg';
        var extension =
            insertMediaHandler_.getMediaExtensionFromMimeType(imageFormat);
        assert.strictEqual(extension, 'jpeg');
      });


      it('should return undefined if the extension could not be deciphered' +
          ' from image format',
          function() {
            var imageFormat = 'imageFormatWithoutType';
            var extension =
                insertMediaHandler_.getMediaExtensionFromName(imageFormat);
            assert.isUndefined(extension);
          });
    });
  });


  function createAndAddSectionToPage_(page) {
    var section = new QowtSection();
    section.setPageSize({
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      orientation: 'portrait'
    });
    section.setPageMargins({
      top: PAGE_MARGIN_TOP,
      bottom: PAGE_MARGIN_BOTTOM,
      left: PAGE_MARGIN_LEFT,
      right: PAGE_MARGIN_RIGHT
    });
    section.style.display = 'block';
    Polymer.dom(page).appendChild(section);
    Polymer.dom(page).flush();
  }
});