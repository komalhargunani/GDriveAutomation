define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/env',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/idGenerator',
  'qowtRoot/utils/wordDocumentUtils',
  'qowtRoot/variants/utils/resourceLocator',
  'utils/analytics/googleAnalytics',
  'qowtRoot/utils/converters/pt2mm',
  'qowtRoot/utils/converters/px2pt',
  'qowtRoot/utils/converters/twip2pt'
], function(
    PubSub,
    EnvModel,
    Converter,
    DomTextSelection,
    DomUtils,
    IdGenerator,
    WordDocUtils,
    ResourceLocator,
    GA
    /*pt2mm*/
    /*px2pt*/
    /*twip2pt*/) {

  'use strict';

  var factory_ = {
    create: function() {
      function module() {
        var api_ = {

          /**
           * Inserts the given media in the DOM.
           */
          insertMedia: function() {
            throw new Error('insertMedia() is not overridden!');
          },


          /**
           * Registers the media to sandbox
           * @param {Object} media - the media to be inserted.
           */
          tryToRegisterMedia: function(media) {
            if (!media.src || !(media.data instanceof ArrayBuffer)) {
              throw (new Error('cannot register media; insufficient data!!'));
            }
            // create a blob for future reference of file
            // only if we don't already have a blob for this url.
            if (ResourceLocator.pathToUrl(media.src) === undefined) {
              try {
                var dataView = new window.DataView(media.data);
                var blob = new window.Blob([dataView]);
                var url = window.URL.createObjectURL(blob);
                ResourceLocator.registerUrl(media.src, url);
              }
              catch (error) {
                // not a fatal error; the app will still continue inserting the
                // current media.
                var msg = 'Could not registering the media ' + media.src +
                    ' ; Error : ' + error;
                GA.sendException({msg: msg, fatal: false});
              }
            }
          },


          /**
           * @param {String} mediaName - the media name from which extension
           *                             needs to be extracted.
           *                             Ex: '/SomeImageName.png'
           * @return {String} the extension of the media | undefined.
           */
          getMediaExtensionFromName: function(mediaName) {
            var indexOfDot = mediaName.lastIndexOf('.');
            var extension;
            if (indexOfDot !== -1) {
              extension = mediaName.substring(indexOfDot + 1);
            }
            return extension;
          },


          /**
           * @param {String} mimeType - the mime-type from which the extension
           *                            is to be deciphered. Ex: 'image/png'
           * @return {String} the extension of media(Ex: png) | undefined
           */
          getMediaExtensionFromMimeType: function(mimeType) {
            var indexOfSlash = mimeType.lastIndexOf('/');
            var extension;
            if (indexOfSlash !== -1) {
              extension = mimeType.substring(indexOfSlash + 1);
            }
            return extension;
          },


          /**
           * @param {String} mediaName - The current media name with extension.
           * @param {String} mediaType - Type of media i.e image || video ||
           *                             audio etc
           * @return {string} unique name for the media.
           */
          getUniqueNameForMedia: function(mediaName, mediaType) {
            var nameWithoutExt =
                mediaName.substring(0, mediaName.lastIndexOf('.'));
            var uniqueName;
            if (mediaType === 'image') {
              uniqueName = IdGenerator.getUniqueImageId();
            }
            mediaName = mediaName.replace(nameWithoutExt, uniqueName);
            return ('/' + mediaName);
          },


          /**
           * Adjusts the image height and width to fit the page
           * @param {Object} mediaProperties
           * @private
           */
          getMediaDimensionsAdjusted: function(mediaProperties) {
            if (EnvModel.app !== 'word') {
              throw (new Error('Cannot adjust the dimensions for app other ' +
                  'than word'));
            }
            if (!mediaProperties ||
                !mediaProperties.wdt || !mediaProperties.hgt) {
                  throw (new Error('Missing properties; cannot adjust the ' +
                      'dimensions'));
            }

            // Note: section.pageSize is maintained in "twips", whereas
            // section.pageMargin is maintained in "pt". And the media however
            // onload is in pixels.
            // We convert everything to "pt" here for ease of calculation.
            // TODO(umesh.kadam): We should be maintaining same units for
            // pageSize, pageMargin and pageBorders
            var mediaWidth = Converter.px2pt(mediaProperties.wdt);
            var mediaHeight = Converter.px2pt(mediaProperties.hgt);
            var ratioHgtToWdt = mediaHeight / mediaWidth;
            var ratioWdtToHgt = mediaWidth / mediaHeight;
            var container = api_.getContainerElementForMedia_();
            var containerWidth = Converter.px2pt(
                Math.floor(container.getBoundingClientRect().width));
            var section = api_.getSection_();
            var sectionHeightOnPage =
                Converter.twip2pt(section.pageSize.height) -
                (Math.floor(section.pageMargins.top) +
                    Math.floor(section.pageMargins.bottom));

            while (mediaWidth > containerWidth ||
                mediaHeight > sectionHeightOnPage) {
              if (mediaWidth > containerWidth) {
                mediaWidth = containerWidth;
                // maintain the aspect ratio of the media so that it does not
                // appear shrunk or stretched.
                mediaHeight = ratioHgtToWdt * mediaWidth;
              }

              if (mediaHeight > sectionHeightOnPage) {
                mediaHeight = sectionHeightOnPage;
                // maintain the aspect ratio of the media so that it does not
                // appear shrunk or stretched.
                mediaWidth = ratioWdtToHgt * mediaHeight;
              }
            }
            mediaProperties.wdt = Converter.pt2twip(mediaWidth);
            mediaProperties.hgt = Converter.pt2twip(mediaHeight);
          },


          /**
           * Splits the run if the caret is in-between the run.
           */
          splitRunIfNeeded: function() {
            var range = DomTextSelection.getRange();
            if (DomTextSelection.isCaretBetweenRun(range)) {
              var node = range.startContainer;
              var offset = range.startOffset;
              if (node.nodeType === Node.TEXT_NODE) {
                node = node.parentNode;
              }
              PubSub.publish('qowt:doAction', {
                'action': 'breakRun',
                'context': {
                  'contentType': 'text',
                  'node': node,
                  'offset': offset
                }
              });
            }
          },


          // Private functions
          /**
           * Start a QOWT transaction, to group all commands created by the
           * translators. This will make all other transactions(by text tool) as
           * part of this "one" transaction, until the endTransaction is called.
           */
          startTransaction_: function() {
            PubSub.publish('qowt:doAction', {
              'action': 'startTransaction',
              'context': {
                'contentType': 'mutation',
                'doNotResetTxn': true
              }
            });
          },


          /**
           * end the QOWT transaction, which will cause the compound transaction
           * to be executed. This will mark the end of "one" compound trans'n
           */
          endTransaction_: function() {
            PubSub.publish('qowt:doAction', {
              'action': 'endTransaction',
              'context': {
                'contentType': 'mutation',
                'doNotResetTxn': true
              }
            });
          },


          /**
           * Since the media is un-editable we position the media with the
           * default values.
           *
           * @return {Object} : default positioning for the drawing mediaElement
           * @private
           */
          getDefaultModelForDrawing_: function() {
            return {
              distanceFromText: {b: 0, l: 0, r: 0, t: 0},
              horizontalPosOffset: 0,
              horizontalPosition: 'absolute',
              horizontalPositionRel: 'character',
              verticalPosOffset: 0,
              verticalPosition: 'absolute',
              verticalPositionRel: 'line',
              wrappingStyle: 'inlineWithText'
            };
          },


          /**
           * Breaks the current run (if desired) and inserts the image
           * in-between the two runs
           *
           * @param {Object} mediaElement - mediaElement to be inserted after
           *                               breaking the run.
           * @private
           */
          breakRunAndInsertMedia_: function(mediaElement) {
            // If the selection is in between the run then split the run
            api_.splitRunIfNeeded();

            // TODO(umesh.kadam): Try to implement this in a better way. Remove
            // all the setTimeout's. Is there an easy way to do this without
            // changing the current implementation of mutation summaries and
            // command generation?

            // Allow text tool to handle the mutation summaries for the run
            // break in this macro turn and then in the next macro turn insert
            // the image node.
            window.setTimeout(function() {
              var sel = window.getSelection();
              if (sel && sel.anchorNode) {
                var refNode = (sel.anchorNode.nodeType === Node.TEXT_NODE) ?
                    sel.anchorNode.parentNode : sel.anchorNode;
                var range = DomTextSelection.getRange();
                if (EnvModel.app === 'word' &&
                    refNode instanceof QowtWordPara && refNode.isEmpty()) {
                  DomUtils.insertAtEnd(mediaElement, refNode);
                } else if (range.startOffset === 0) {
                  DomUtils.insertBefore(mediaElement, refNode);
                } else {
                  DomUtils.insertAfter(mediaElement, refNode);
                }
              } else {
                // Failed to find the selection.
                // This could happen if the user selects everything and tries to
                // insert media (i.e. ctrl+A + insert media). Where in entire
                // content should be deleted and media should be inserted. While
                // doing this operation we might end up deleting everything
                // including the paragraphs. Text tool/ cleaners however add
                // back an empty paragraph so that the document remains editable
                // but the selection is lost.

                // We try to add the media at appropriate position here, if we
                // fail to do so we log GA.
                tryAddingImageOrLogGA_(mediaElement);
              }
              // end the transaction in next macro turn so that in this macro
              // turn text text tool handles the inserted node for the
              // generated mutations.
              window.setTimeout(function() {
                api_.endTransaction_();
              }, 0);
            }, 0);
          },


          /**
           * Inserts the media in the dom by breaking run if needed.
           * @param {Object} mediaElement - media element to be inserted in
           *                                the dom
           * @private
           */
          insertMediaInDOM_: function(mediaElement) {
            var sel = window.getSelection();
            var range = sel && sel.getRangeAt(0);

            // While inserting the media we have to consider the current
            // selection and
            // 1) Delete text if a range of text is selected.
            // 2) Break the existing run if the caret is placed in between a run
            // 3) And only then insert the media.
            // Note that all these activities should happen synchronously
            // because that is how core will get to know where exactly the
            // media should be inserted.
            // Not adhering to this would result in "ued" from core.
            api_.startTransaction_();
            if (range && !range.collapsed) {
              // remove text and then insert the media i.e. delete the current
              // range and insert the media to the same selection.
              range.deleteContents();
              adjustSelIfSectionNode_(sel, range);
              // add the media in the next macro turn; allow text tool to
              // handle the mutation for the deleted text in this macro turn.
              window.setTimeout(
                  api_.breakRunAndInsertMedia_.bind(null, mediaElement), 0);
            } else {
              api_.breakRunAndInsertMedia_(mediaElement);
            }
          },


          /**
           * @return {section} - returns the section under which the selection
           *                     falls.
           * @private
           */
          getSection_: function() {
            var sel = window.getSelection();

            var section;
            var elm = sel && sel.anchorNode;
            while (elm) {
              if (elm instanceof QowtSection) {
                section = elm;
                break;
              }
              elm = elm.parentNode;
            }
            return section;
          },


          getContainerElementForMedia_: function() {
            var sel = window.getSelection();

            var container;
            var elm = sel && sel.anchorNode;
            while (elm) {
              if (elm instanceof QowtTableCell || elm instanceof QowtWordPara ||
                  elm instanceof QowtSection) {
                container = elm;
                break;
              }
              elm = elm.parentNode;
            }
            return container;
          }
        };
        return api_;
      }

      /////////// Private functions //////////
      /**
       * If document has no paras then add an empty para to doc with media as
       * the child.
       * If document has only empty paragraph(s) then add the media to the
       * first para.
       * Log GA otherwise.
       *
       * @private
       */
      function tryAddingImageOrLogGA_(mediaElement) {
        if (WordDocUtils.isDocWithEmptyParas()) {
          // add media to first para
          var firstPara = document.querySelector('qowt-section > P');
          DomUtils.insertAtEnd(mediaElement, firstPara);
        } else if (WordDocUtils.isDocWithoutPara()) {
          createParaAndAddMedia_(mediaElement);
        } else {
          var msg = 'Could not find a suitable position to insert media';
          GA.sendException({msg: msg, fatal: false});
        }
      }


      /**
       * Creates a word para and adds media
       * @private
       */
      function createParaAndAddMedia_(mediaElement) {
        if (EnvModel.app === 'word') {
          var para = new QowtWordPara();
          para.appendChild(mediaElement);
          var section = document.querySelector('qowt-section');
          section.appendChild(para);
          DomTextSelection.setCaret(para.lastChild, 0);
        }
      }


      /**
       * If the selection's anchor node is Qowt section then it is possible that
       * user has selected entire content and inserted media. To handle this
       * scenario we make some adjustments.
       * 1) If we have a focus node after deleting the range then we set the
       *    caret to the focused node.
       * 2) If we do not find the focus node then we rest the selection to the
       *    updated range so that the proceeding logic of inserting media will
       *    have the media inserted appropriately. This is a worst case scenario
       *    and is unlikely to occur. We still handle it so that the media is
       *    not inserted beyond the section.
       *
       * @param {Object} sel - current selection
       * @param {Object} range - range after deletion of content.
       * @private
       */
      function adjustSelIfSectionNode_(sel, range) {
        if (sel && sel.anchorNode instanceof QowtSection) {
          // selectAll + insert media scenario
          if (sel.focusNode instanceof QowtWordPara) {
            // After deleting the content if we still have the focus node
            // for the selection then set the caret to focus node (i.e.
            // the first para)
            DomTextSelection.setCaret(sel.focusNode, 0);
          } else {
            // worst case; add the new range so that media is not inserted
            // outside qowt-section.
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };
  return factory_;
});

